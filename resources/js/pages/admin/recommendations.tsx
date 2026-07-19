import { Head, useForm, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import {
    FileText,
    Search,
    CheckCircle,
    X,
    AlertCircle,
    Plus,
    Eye,
    Check,
    Database,
    Users,
    Globe,
    HelpCircle,
    MessageSquare,
    Printer,
} from 'lucide-react';
import Pagination from '@/components/pagination';

interface Recommendation {
    id: number;
    agent_id: number;
    jamaah_member_id: number;
    nomor_paspor: string;
    nama_paspor: string;
    keterangan: string | null;
    keterangan_admin: string | null;
    paspor_file: string;
    paspor_file_url: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    agent?: {
        id: number;
        name: string;
    };
    jamaah_member?: {
        id: number;
        name: string;
        nomor_paspor: string | null;
    };
}

export default function Recommendations({
    recommendations,
    summary,
    filters,
    userRole,
}: PageProps<{
    recommendations: any;
    summary: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
    };
    filters: {
        search: string;
        status: string;
    };
    userRole: string;
}>) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedRecId, setSelectedRecId] = useState<number | null>(null);

    // Search Jamaah Autocomplete states
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [selectedJamaah, setSelectedJamaah] = useState<any | null>(null);

    // Form for agent submission
    const { data, setData, post, processing, errors, reset } = useForm({
        jamaah_member_id: '',
        nomor_paspor: '',
        nama_paspor: '',
        keterangan: '',
        paspor_file: null as File | null,
    });

    // Form for admin rejection
    const {
        data: rejectData,
        setData: setRejectData,
        post: postReject,
        processing: rejecting,
        reset: resetReject,
    } = useForm({
        keterangan_admin: '',
    });

    // Handle searching for jamaah
    const handleSearchJamaah = async (queryStr: string) => {
        setSearchQuery(queryStr);
        if (queryStr.trim().length < 2) {
            setSearchResults([]);
            return;
        }
        setLoadingSearch(true);
        try {
            const response = await fetch(
                `/admin/recommendations/search-jamaah?search=${encodeURIComponent(queryStr)}`,
            );
            if (response.ok) {
                const results = await response.json();
                setSearchResults(results);
            }
        } catch (err) {
            console.error('Error searching jamaah:', err);
        } finally {
            setLoadingSearch(false);
        }
    };

    const handleSelectJamaah = (jamaah: any) => {
        setSelectedJamaah(jamaah);
        setData('jamaah_member_id', jamaah.id.toString());
        setData('nama_paspor', jamaah.name); // Default to current name
        setData('nomor_paspor', jamaah.nomor_paspor || ''); // Default to current passport number if exists
        setSearchResults([]);
        setSearchQuery('');
    };

    const handleSearchSubmit = () => {
        router.get(
            '/admin/recommendations',
            { search, status: statusFilter },
            { preserveState: true },
        );
    };

    const handleStatusFilterChange = (newStatus: string) => {
        setStatusFilter(newStatus);
        router.get(
            '/admin/recommendations',
            { search, status: newStatus },
            { preserveState: true },
        );
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/recommendations', {
            forceFormData: true,
            onSuccess: () => {
                setShowCreateModal(false);
                setSelectedJamaah(null);
                reset();
            },
        });
    };

    const handleApprove = (id: number) => {
        if (
            confirm(
                'Apakah Anda yakin ingin menyetujui pengajuan rekomendasi paspor ini? Data jamaah akan otomatis diperbarui.',
            )
        ) {
            router.post(`/admin/recommendations/${id}/approve`);
        }
    };

    const openRejectModal = (id: number) => {
        setSelectedRecId(id);
        setShowRejectModal(true);
    };

    const submitReject = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRecId) return;

        postReject(`/admin/recommendations/${selectedRecId}/reject`, {
            onSuccess: () => {
                setShowRejectModal(false);
                setSelectedRecId(null);
                resetReject();
            },
        });
    };

    return (
        <div className="mx-auto min-h-screen w-full max-w-full bg-slate-50 p-6 font-sans md:p-8">
            <Head title="Rekomendasi Paspor" />

            {/* Header section */}
            <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-800">
                        <FileText className="text-emerald-600" size={28} />
                        Rekomendasi Paspor
                    </h1>
                    <p className="mt-1 text-sm font-bold text-slate-500">
                        {userRole === 'agen'
                            ? 'Ajukan dan pantau rekomendasi pembaruan paspor jamaah Anda.'
                            : 'Kelola dan setujui berkas pengajuan paspor yang dikirimkan oleh agen.'}
                    </p>
                </div>

                <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center md:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                        <Search
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                            size={18}
                        />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSearchSubmit();
                            }}
                            placeholder="Cari nama / nomor paspor..."
                            className="w-full rounded-xl border-slate-300 bg-white pl-9 font-bold text-slate-700 shadow-sm sm:w-64"
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={handleSearchSubmit}
                            className="rounded-xl bg-emerald-600 px-5 font-bold shadow-md hover:bg-emerald-700"
                        >
                            Cari
                        </Button>

                        {userRole === 'agen' && (
                            <Button
                                onClick={() => setShowCreateModal(true)}
                                className="flex items-center gap-1.5 rounded-xl bg-emerald-800 px-5 font-extrabold text-white shadow-md hover:bg-emerald-950"
                            >
                                <Plus size={16} /> Ajukan Rekomendasi
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div>
                        <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                            Total Pengajuan
                        </span>
                        <div className="mt-1 text-2xl font-black text-slate-800">
                            {summary.total}
                        </div>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500 shadow-inner">
                        <FileText size={20} />
                    </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div>
                        <span className="block text-[10px] font-bold tracking-wider text-amber-500 uppercase">
                            Menunggu Persetujuan
                        </span>
                        <div className="mt-1 text-2xl font-black text-amber-600">
                            {summary.pending}
                        </div>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 shadow-inner">
                        <HelpCircle size={20} />
                    </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div>
                        <span className="block text-[10px] font-bold tracking-wider text-emerald-600 uppercase">
                            Disetujui
                        </span>
                        <div className="mt-1 text-2xl font-black text-emerald-600">
                            {summary.approved}
                        </div>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shadow-inner">
                        <CheckCircle size={20} />
                    </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div>
                        <span className="block text-[10px] font-bold tracking-wider text-rose-500 uppercase">
                            Ditolak
                        </span>
                        <div className="mt-1 text-2xl font-black text-rose-600">
                            {summary.rejected}
                        </div>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 shadow-inner">
                        <X size={20} />
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="mb-5 flex w-fit items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
                {[
                    { value: 'all', label: 'Semua Status' },
                    { value: 'pending', label: 'Menunggu' },
                    { value: 'approved', label: 'Disetujui' },
                    { value: 'rejected', label: 'Ditolak' },
                ].map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => handleStatusFilterChange(tab.value)}
                        className={`rounded-lg px-4 py-2 text-xs font-black transition-all ${
                            statusFilter === tab.value
                                ? 'bg-emerald-900 text-white shadow-sm'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Table Card */}
            <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                        <thead className="divide-x divide-slate-800 bg-slate-900 text-[10px] font-extrabold tracking-wider text-slate-200 uppercase">
                            <tr>
                                <th className="w-10 px-4 py-3.5 text-center">
                                    No
                                </th>
                                <th className="px-5 py-3.5">Nama Jamaah</th>
                                {userRole !== 'agen' && (
                                    <th className="px-4 py-3.5">
                                        Agen Pengaju
                                    </th>
                                )}
                                <th className="px-4 py-3.5">
                                    Nomor Paspor Baru
                                </th>
                                <th className="px-5 py-3.5">
                                    Nama Sesuai Paspor
                                </th>
                                <th className="px-4 py-3.5">Keterangan Agen</th>
                                <th className="px-4 py-3.5 text-center">
                                    Berkas
                                </th>
                                <th className="px-4 py-3.5 text-center">
                                    Status
                                </th>
                                <th className="px-4 py-3.5">Alasan/Catatan</th>
                                <th className="w-36 px-4 py-3.5 text-center">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {recommendations.data.map(
                                (rec: Recommendation, index: number) => {
                                    return (
                                        <tr
                                            key={rec.id}
                                            className="divide-x divide-slate-100 transition-colors hover:bg-slate-50/50"
                                        >
                                            <td className="px-4 py-4 text-center font-extrabold text-slate-400">
                                                {(recommendations.current_page -
                                                    1) *
                                                    recommendations.per_page +
                                                    index +
                                                    1}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="text-sm font-extrabold text-slate-800">
                                                    {rec.jamaah_member?.name ||
                                                        'Jamaah Dihapus'}
                                                </div>
                                                {rec.jamaah_member
                                                    ?.nomor_paspor && (
                                                    <div className="mt-0.5 text-[10px] font-bold text-slate-400">
                                                        Paspor Lama:{' '}
                                                        {
                                                            rec.jamaah_member
                                                                .nomor_paspor
                                                        }
                                                    </div>
                                                )}
                                            </td>
                                            {userRole !== 'agen' && (
                                                <td className="px-4 py-4">
                                                    <span className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-[9px] font-black tracking-wider text-slate-600 uppercase">
                                                        {rec.agent?.name ||
                                                            'Sistem/Admin'}
                                                    </span>
                                                </td>
                                            )}
                                            <td className="px-4 py-4 font-bold text-slate-800">
                                                {rec.nomor_paspor}
                                            </td>
                                            <td className="px-5 py-4 font-bold text-slate-800">
                                                {rec.nama_paspor}
                                            </td>
                                            <td className="max-w-xs px-4 py-4 leading-relaxed font-medium whitespace-normal text-slate-500">
                                                {rec.keterangan || '-'}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                {rec.paspor_file_url ? (
                                                    <a
                                                        href={
                                                            rec.paspor_file_url
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1.5 font-extrabold text-emerald-700 shadow-sm transition-colors hover:bg-emerald-100"
                                                    >
                                                        <Eye size={13} /> Paspor
                                                    </a>
                                                ) : (
                                                    <span className="text-slate-400 italic">
                                                        Tidak ada file
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span
                                                    className={`rounded-full px-2 py-1 text-[9px] font-black tracking-wide uppercase ${
                                                        rec.status ===
                                                        'approved'
                                                            ? 'border border-emerald-200 bg-emerald-100 text-emerald-800'
                                                            : rec.status ===
                                                                'rejected'
                                                              ? 'border border-rose-200 bg-rose-100 text-rose-800'
                                                              : 'text-amber-850 border border-amber-200 bg-amber-100'
                                                    }`}
                                                >
                                                    {rec.status === 'approved'
                                                        ? 'Disetujui'
                                                        : rec.status ===
                                                            'rejected'
                                                          ? 'Ditolak'
                                                          : 'Menunggu'}
                                                </span>
                                            </td>
                                            <td className="max-w-xs px-4 py-4 leading-relaxed font-medium whitespace-normal text-slate-500">
                                                {rec.status === 'rejected' &&
                                                rec.keterangan_admin ? (
                                                    <div className="flex items-start gap-1 rounded-lg border border-rose-100 bg-rose-50/50 p-2 text-rose-800">
                                                        <MessageSquare
                                                            size={12}
                                                            className="mt-0.5 shrink-0 text-rose-500"
                                                        />
                                                        <span className="text-[10px] font-semibold">
                                                            {
                                                                rec.keterangan_admin
                                                            }
                                                        </span>
                                                    </div>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <div className="flex flex-col items-center justify-center gap-1.5">
                                                    {rec.status === 'pending' &&
                                                        userRole !== 'agen' && (
                                                            <div className="mb-1 flex justify-center gap-1.5">
                                                                <Button
                                                                    onClick={() =>
                                                                        handleApprove(
                                                                            rec.id,
                                                                        )
                                                                    }
                                                                    size="sm"
                                                                    className="flex h-7 items-center gap-0.5 rounded-lg bg-emerald-600 px-2.5 text-[10px] font-extrabold text-white shadow-sm hover:bg-emerald-700"
                                                                >
                                                                    <Check
                                                                        size={
                                                                            11
                                                                        }
                                                                    />{' '}
                                                                    Setujui
                                                                </Button>
                                                                <Button
                                                                    onClick={() =>
                                                                        openRejectModal(
                                                                            rec.id,
                                                                        )
                                                                    }
                                                                    size="sm"
                                                                    className="flex h-7 items-center gap-0.5 rounded-lg bg-rose-600 px-2.5 text-[10px] font-extrabold text-white shadow-sm hover:bg-rose-700"
                                                                >
                                                                    <X
                                                                        size={
                                                                            11
                                                                        }
                                                                    />{' '}
                                                                    Tolak
                                                                </Button>
                                                            </div>
                                                        )}

                                                    <div className="flex flex-wrap justify-center gap-1">
                                                        {/* Cetak Kosongan is always available for any status */}
                                                        <a
                                                            href={`/admin/recommendations/${rec.id}/print`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="hover:bg-slate-205 inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 px-2 py-1.5 text-[10px] font-extrabold text-slate-700 shadow-sm transition-colors hover:text-slate-900"
                                                            title="Cetak Surat Rekomendasi Kosongan (Belum TTE)"
                                                        >
                                                            <Printer
                                                                size={11}
                                                            />{' '}
                                                            Kosongan
                                                        </a>

                                                        {/* Cetak Tertanda Tangan is only available when approved */}
                                                        {rec.status ===
                                                            'approved' && (
                                                            <a
                                                                href={`/admin/recommendations/${rec.id}/print?signed=1`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="hover:bg-emerald-750 inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2 py-1.5 text-[10px] font-extrabold text-white shadow-sm transition-colors"
                                                                title="Cetak Surat Rekomendasi Resmi dengan TTE/Stempel"
                                                            >
                                                                <Printer
                                                                    size={11}
                                                                />{' '}
                                                                Tertanda Tangan
                                                            </a>
                                                        )}
                                                    </div>

                                                    {rec.status ===
                                                        'approved' && (
                                                        <span className="mt-1 flex items-center gap-0.5 rounded border border-emerald-100 bg-emerald-50 px-1.5 py-0.5 text-[9px] font-black tracking-wider text-emerald-600 uppercase">
                                                            <CheckCircle
                                                                size={10}
                                                            />{' '}
                                                            Sinkron
                                                        </span>
                                                    )}
                                                    {rec.status ===
                                                        'rejected' && (
                                                        <span className="mt-1 rounded border border-rose-100 bg-rose-50 px-1.5 py-0.5 text-[9px] font-black tracking-wider text-rose-600 uppercase">
                                                            Ditolak
                                                        </span>
                                                    )}
                                                    {rec.status === 'pending' &&
                                                        userRole === 'agen' && (
                                                            <span className="mt-1 rounded border border-amber-100 bg-amber-50 px-1.5 py-0.5 text-[9px] font-black tracking-wider text-amber-600 uppercase">
                                                                Review
                                                            </span>
                                                        )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                },
                            )}
                        </tbody>
                    </table>

                    {recommendations.data.length === 0 && (
                        <div className="flex flex-col items-center p-12 text-center text-sm text-slate-500">
                            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-slate-100 bg-slate-50">
                                <FileText
                                    size={28}
                                    className="text-slate-350"
                                />
                            </div>
                            <p className="text-slate-650 font-extrabold">
                                Tidak ada data pengajuan rekomendasi.
                            </p>
                            <p className="mt-1 text-xs font-medium text-slate-400">
                                Gunakan kata kunci pencarian atau filter status
                                yang berbeda.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <Pagination links={recommendations.links} />

            {/* Create Recommendation Modal (Agent Only) */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                    <div className="flex max-h-[90vh] w-full max-w-lg animate-in flex-col overflow-hidden rounded-3xl bg-white p-0 text-slate-800 shadow-2xl duration-200 zoom-in-95">
                        <div className="relative flex items-center justify-between overflow-hidden bg-emerald-950 p-6 text-white">
                            <div className="absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500 opacity-20 blur-2xl"></div>
                            <div>
                                <h2 className="relative z-10 flex items-center gap-2 text-xl font-bold">
                                    <Globe
                                        size={20}
                                        className="text-amber-400"
                                    />
                                    Ajukan Rekomendasi Paspor
                                </h2>
                                <p className="relative z-10 mt-0.5 text-[11px] font-medium text-emerald-200/90">
                                    Pembuatan / Pembaruan Paspor Baru
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setSelectedJamaah(null);
                                    reset();
                                }}
                                className="relative z-10 text-emerald-300 transition-colors hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form
                            onSubmit={submitCreate}
                            className="flex-1 space-y-4 overflow-y-auto p-6"
                        >
                            {/* Autocomplete Jamaah search */}
                            <div>
                                <Label className="text-xs font-bold text-slate-700">
                                    Cari Jamaah *
                                </Label>
                                <div className="relative mt-1">
                                    <Input
                                        value={searchQuery}
                                        onChange={(e) =>
                                            handleSearchJamaah(e.target.value)
                                        }
                                        placeholder="Ketik minimal 2 huruf nama jamaah..."
                                        className="rounded-xl border-slate-300"
                                        disabled={!!selectedJamaah}
                                    />
                                    {selectedJamaah && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedJamaah(null);
                                                setData('jamaah_member_id', '');
                                                setSearchQuery('');
                                            }}
                                            className="hover:text-slate-750 absolute top-1/2 right-3 -translate-y-1/2 p-1 text-slate-400 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>

                                {loadingSearch && (
                                    <div className="mt-2 flex items-center gap-2 px-1 text-xs font-bold text-slate-500">
                                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"></div>
                                        Mencari...
                                    </div>
                                )}

                                {!loadingSearch && searchResults.length > 0 && (
                                    <div className="position relative z-55 mt-1 max-h-48 divide-y divide-slate-100 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                                        {searchResults.map((member) => (
                                            <div
                                                key={member.id}
                                                onClick={() =>
                                                    handleSelectJamaah(member)
                                                }
                                                className="flex cursor-pointer items-center justify-between p-3 text-left transition-colors hover:bg-slate-50"
                                            >
                                                <div>
                                                    <div className="text-xs font-bold text-slate-800">
                                                        {member.name}
                                                    </div>
                                                    <div className="mt-0.5 text-[10px] font-semibold text-slate-400">
                                                        Paspor saat ini:{' '}
                                                        {member.nomor_paspor ||
                                                            '-'}
                                                    </div>
                                                </div>
                                                <Badge className="border-emerald-200 bg-emerald-50 text-[10px] text-emerald-800">
                                                    Pilih
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {errors.jamaah_member_id && (
                                    <p className="mt-1 text-xs font-bold text-rose-600">
                                        Harap pilih jamaah terlebih dahulu.
                                    </p>
                                )}
                            </div>

                            {/* Selected Jamaah Details */}
                            {selectedJamaah && (
                                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="rounded-xl bg-emerald-50 p-2 text-emerald-700">
                                        <Database size={18} />
                                    </div>
                                    <div>
                                        <span className="block text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                                            Jamaah Terpilih
                                        </span>
                                        <span className="block text-xs font-extrabold text-slate-800">
                                            {selectedJamaah.name}
                                        </span>
                                        <span className="mt-0.5 block text-[10px] font-semibold text-slate-500">
                                            Sex:{' '}
                                            {selectedJamaah.jenis_kelamin ===
                                            'Laki-laki'
                                                ? 'Laki-laki'
                                                : 'Perempuan'}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Passport Details */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs font-bold text-slate-700">
                                        Nomor Paspor Baru *
                                    </Label>
                                    <Input
                                        required
                                        value={data.nomor_paspor}
                                        onChange={(e) =>
                                            setData(
                                                'nomor_paspor',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Contoh: B123456"
                                        className="mt-1 rounded-xl border-slate-300"
                                    />
                                    {errors.nomor_paspor && (
                                        <p className="mt-1 text-[10px] font-bold text-rose-600">
                                            {errors.nomor_paspor}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label className="text-xs font-bold text-slate-700">
                                        Nama Sesuai Paspor *
                                    </Label>
                                    <Input
                                        required
                                        value={data.nama_paspor}
                                        onChange={(e) =>
                                            setData(
                                                'nama_paspor',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Contoh: AHMAD SUBARI"
                                        className="mt-1 rounded-xl border-slate-300"
                                    />
                                    {errors.nama_paspor && (
                                        <p className="mt-1 text-[10px] font-bold text-rose-600">
                                            {errors.nama_paspor}
                                        </p>
                                    )}
                                </div>

                                <div className="col-span-2">
                                    <Label className="text-xs font-bold text-slate-700">
                                        Keterangan Pengajuan
                                    </Label>
                                    <textarea
                                        value={data.keterangan}
                                        onChange={(e) =>
                                            setData(
                                                'keterangan',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Tulis keterangan/catatan tambahan pengajuan rekomendasi..."
                                        rows={3}
                                        className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <Label className="mb-1 block text-xs font-bold text-slate-700">
                                        Upload Berkas/Scan Paspor * (Maks 2MB)
                                    </Label>
                                    <Input
                                        type="file"
                                        required
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={(e) =>
                                            setData(
                                                'paspor_file',
                                                e.target.files?.[0] || null,
                                            )
                                        }
                                        className="cursor-pointer border-slate-300 bg-slate-50 text-xs"
                                    />
                                    {errors.paspor_file && (
                                        <p className="mt-1 text-[10px] font-bold text-rose-600">
                                            {errors.paspor_file}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setSelectedJamaah(null);
                                        reset();
                                    }}
                                    className="rounded-xl border-slate-300 font-bold text-slate-600 hover:bg-slate-50"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={
                                        processing || !data.jamaah_member_id
                                    }
                                    className="rounded-xl bg-emerald-600 px-6 font-extrabold text-white shadow-md hover:bg-emerald-700"
                                >
                                    {processing
                                        ? 'Mengirim...'
                                        : 'Kirim Pengajuan'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Reject Confirmation Modal (Admin/Pusat Only) */}
            {showRejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                    <div className="flex w-full max-w-md animate-in flex-col overflow-hidden rounded-3xl bg-white p-0 text-slate-800 shadow-2xl duration-200 zoom-in-95">
                        <div className="relative flex items-center justify-between overflow-hidden bg-rose-900 p-6 text-white">
                            <h2 className="relative z-10 flex items-center gap-2 text-xl font-bold">
                                <AlertCircle
                                    size={20}
                                    className="text-amber-400"
                                />
                                Alasan Penolakan Rekomendasi
                            </h2>
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setSelectedRecId(null);
                                    resetReject();
                                }}
                                className="relative z-10 text-rose-200 transition-colors hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={submitReject} className="space-y-4 p-6">
                            <div>
                                <Label className="mb-1 block text-xs font-bold text-slate-700">
                                    Catatan/Alasan Ditolak
                                </Label>
                                <textarea
                                    required
                                    value={rejectData.keterangan_admin}
                                    onChange={(e) =>
                                        setRejectData(
                                            'keterangan_admin',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Tulis alasan penolakan berkas rekomendasi ini agar dapat dibaca oleh agen..."
                                    rows={4}
                                    className="w-full rounded-xl border border-slate-300 p-3 text-xs focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowRejectModal(false);
                                        setSelectedRecId(null);
                                        resetReject();
                                    }}
                                    className="rounded-xl border-slate-300 font-bold text-slate-600 hover:bg-slate-50"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={rejecting}
                                    className="rounded-xl bg-rose-600 font-extrabold text-white shadow-md hover:bg-rose-700"
                                >
                                    {rejecting
                                        ? 'Menolak...'
                                        : 'Konfirmasi Tolak'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

Recommendations.layout = {
    breadcrumbs: [
        { title: 'Rekomendasi Paspor', href: '/admin/recommendations' },
    ],
};
