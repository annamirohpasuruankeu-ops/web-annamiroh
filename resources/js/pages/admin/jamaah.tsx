import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import {
    BookOpen,
    Search,
    Users,
    Edit3,
    X,
    Globe,
    UserCheck,
    FileSpreadsheet,
} from 'lucide-react';
import Pagination from '@/components/pagination';
import { router } from '@inertiajs/react';
import { SearchableSelect } from '@/components/searchable-select';

interface JamaahMember {
    id: number;
    name: string;
    jenis_kelamin: string;
    tempat_lahir: string;
    tgl_lahir: string;
    nomor_paspor: string;
    paspor_issued: string;
    paspor_expiry: string;
    paspor_office: string;
    pp: string;
    vm: string;
    vp: string;
    paspor_file: string | null;
    paspor_second_file: string | null;
    ktp_file: string | null;
    kk_file: string | null;
    vaksin_file: string | null;
    user?: {
        name: string;
        role?: string;
        agent?: {
            name: string;
        };
    };
    bookings?: Array<{
        id: number;
        package?: {
            name: string;
        };
    }>;
}

export default function Jamaahs({
    jamaahs,
    activePackages,
    agents,
    totalJamaahCount,
    passportFilledCount,
    filters,
    auth,
}: PageProps<{
    jamaahs: any;
    activePackages: any[];
    agents: any[];
    totalJamaahCount: number;
    passportFilledCount: number;
    filters?: any;
}>) {
    const [search, setSearch] = useState(filters?.search || '');
    const [selectedPackageId, setSelectedPackageId] = useState(
        filters?.package_id || '',
    );
    const [selectedAgentId, setSelectedAgentId] = useState(
        filters?.agent_id || '',
    );
    const [showModal, setShowModal] = useState(false);
    const [editingMember, setEditingMember] = useState<JamaahMember | null>(
        null,
    );

    const packageOptions = [
        {
            value: '',
            label: `Semua Paket (${activePackages ? activePackages.reduce((acc: number, curr: any) => acc + (curr.bookings_count || 0), 0) : 0} Jamaah)`,
        },
        ...(activePackages || []).map((p: any) => ({
            value: String(p.id),
            label: `${p.name} (${p.bookings_count || 0} Jamaah)`,
        })),
    ];

    const agentOptions = [
        { value: '', label: 'Semua Agen / Pusat' },
        ...(agents || []).map((a: any) => ({
            value: String(a.id),
            label: a.name,
        })),
    ];

    const { data, setData, post, reset, processing, errors } = useForm({
        name: '',
        jenis_kelamin: '',
        tempat_lahir: '',
        tgl_lahir: '',
        nomor_paspor: '',
        paspor_issued: '',
        paspor_expiry: '',
        paspor_office: '',
        pp: '-',
        vm: '-',
        vp: '-',
        paspor_file: null as File | null,
        paspor_second_file: null as File | null,
        ktp_file: null as File | null,
        kk_file: null as File | null,
        vaksin_file: null as File | null,
    });

    // Calculate age based on date of birth
    const calculateAge = (dobString: string) => {
        if (!dobString) return '-';
        const dob = new Date(dobString);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age >= 0 ? age : '-';
    };

    const openEdit = (member: JamaahMember) => {
        setEditingMember(member);
        setData({
            name: member.name || '',
            jenis_kelamin: member.jenis_kelamin || '',
            tempat_lahir: member.tempat_lahir || '',
            tgl_lahir: member.tgl_lahir || '',
            nomor_paspor: member.nomor_paspor || '',
            paspor_issued: member.paspor_issued || '',
            paspor_expiry: member.paspor_expiry || '',
            paspor_office: member.paspor_office || '',
            pp: member.pp || '-',
            vm: member.vm || '-',
            vp: member.vp || '-',
            paspor_file: null,
            paspor_second_file: null,
            ktp_file: null,
            kk_file: null,
            vaksin_file: null,
        });
        setShowModal(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingMember) return;

        post(`/admin/jamaah/${editingMember.id}`, {
            forceFormData: true,
            onSuccess: () => {
                setShowModal(false);
                setEditingMember(null);
                reset();
            },
        });
    };

    const handleFilterChange = (
        pkgId: string,
        agtId: string,
        searchVal: string,
    ) => {
        const queryParams: any = {};
        if (searchVal) queryParams.search = searchVal;
        if (pkgId) queryParams.package_id = pkgId;
        if (agtId) queryParams.agent_id = agtId;

        router.get('/admin/jamaah', queryParams, { preserveState: true });
    };

    const handleResetFilters = () => {
        setSearch('');
        setSelectedPackageId('');
        setSelectedAgentId('');
        router.get('/admin/jamaah', {}, { preserveState: true });
    };

    const handleExportExcel = () => {
        const queryParams: any = {};
        if (search) queryParams.search = search;
        if (selectedPackageId) queryParams.package_id = selectedPackageId;
        if (selectedAgentId) queryParams.agent_id = selectedAgentId;

        const queryString = new URLSearchParams(queryParams).toString();
        window.location.href = `/admin/jamaah/export${queryString ? '?' + queryString : ''}`;
    };

    return (
        <div className="mx-auto min-h-screen w-full max-w-full bg-slate-50 p-6 font-sans md:p-8">
            <Head title="Data Manifest Jamaah" />

            {/* Header section */}
            <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-800">
                        <BookOpen className="text-emerald-600" size={28} />
                        Manifest Keberangkatan Jamaah
                    </h1>
                    <p className="mt-1 text-sm font-bold text-slate-500">
                        Daftar lengkap seluruh jamaah dari Booking Order yang
                        siap berangkat.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleExportExcel}
                        className="flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-extrabold text-white shadow-md transition-all hover:bg-emerald-800"
                    >
                        <FileSpreadsheet size={16} />
                        Export Excel
                    </Button>
                </div>
            </div>

            {/* Statistics */}
            <div className="mb-6 grid gap-6 md:grid-cols-2">
                {/* Total Pilgrims */}
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div>
                        <span className="block text-xs font-bold tracking-wider text-slate-400 uppercase">
                            Total Manifest Jamaah
                        </span>
                        <div className="mt-2 flex items-baseline gap-1.5 text-3xl font-black text-slate-800">
                            {totalJamaahCount || 0}
                            <span className="text-xs font-bold text-slate-400 uppercase">
                                Orang
                            </span>
                        </div>
                        <p className="mt-1 text-xs font-bold text-slate-400">
                            Total jamaah terdaftar di semua order.
                        </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm">
                        <Users size={24} />
                    </div>
                </div>

                {/* Passport registered */}
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div>
                        <span className="block text-xs font-bold tracking-wider text-slate-400 uppercase">
                            Paspor Terdaftar
                        </span>
                        <div className="mt-2 flex items-baseline gap-1.5 text-3xl font-black text-slate-800">
                            {passportFilledCount || 0}
                            <span className="text-xs font-bold text-slate-400 uppercase">
                                Jamaah
                            </span>
                        </div>
                        <p className="mt-1 text-xs font-bold text-slate-400">
                            Jumlah jamaah yang sudah menginput nomor paspor.
                        </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shadow-sm">
                        <Globe size={24} />
                    </div>
                </div>
            </div>

            {/* Consolidated Dropdown Search & Filters */}
            <div className="mb-6 flex flex-col items-end gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row">
                {/* Search Input */}
                <div className="w-full flex-1">
                    <Label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Cari Nama / Paspor
                    </Label>
                    <div className="relative">
                        <Search
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                            size={18}
                        />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter')
                                    handleFilterChange(
                                        selectedPackageId,
                                        selectedAgentId,
                                        e.currentTarget.value,
                                    );
                            }}
                            placeholder="Ketik nama atau nomor paspor..."
                            className="w-full rounded-xl border-slate-300 bg-white pl-9 font-bold text-slate-700 shadow-sm"
                        />
                    </div>
                </div>

                {/* Package Dropdown Search */}
                <div className="w-full md:w-72">
                    <Label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Paket Keberangkatan
                    </Label>
                    <SearchableSelect
                        options={packageOptions}
                        value={String(selectedPackageId)}
                        onChange={(val) => {
                            setSelectedPackageId(val);
                            handleFilterChange(val, selectedAgentId, search);
                        }}
                        placeholder="Pilih Paket..."
                        searchPlaceholder="Cari nama paket..."
                    />
                </div>

                {/* Agent Dropdown Search (Only for admin/pusat) */}
                {auth?.user?.role !== 'agen' && (
                    <div className="w-full md:w-64">
                        <Label className="mb-1.5 block text-xs font-bold text-slate-700">
                            Agen Pendaftar
                        </Label>
                        <SearchableSelect
                            options={agentOptions}
                            value={String(selectedAgentId)}
                            onChange={(val) => {
                                setSelectedAgentId(val);
                                handleFilterChange(
                                    selectedPackageId,
                                    val,
                                    search,
                                );
                            }}
                            placeholder="Pilih Agen..."
                            searchPlaceholder="Cari nama agen..."
                        />
                    </div>
                )}

                {/* Filter and Reset Buttons */}
                <div className="flex w-full gap-2 md:w-auto">
                    <Button
                        onClick={() =>
                            handleFilterChange(
                                selectedPackageId,
                                selectedAgentId,
                                search,
                            )
                        }
                        className="h-10 flex-1 rounded-xl bg-emerald-600 px-6 font-bold shadow-md hover:bg-emerald-700 md:flex-initial"
                    >
                        Filter
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleResetFilters}
                        className="h-10 flex-1 rounded-xl border-slate-300 px-4 font-bold md:flex-initial"
                    >
                        Reset
                    </Button>
                </div>
            </div>

            {/* Manifest Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                        <thead className="divide-x divide-slate-800 bg-slate-900 text-[10px] font-extrabold tracking-wider text-slate-200 uppercase">
                            <tr>
                                <th className="w-10 px-4 py-3.5 text-center">
                                    No
                                </th>
                                <th className="px-5 py-3.5">Nama Jamaah</th>
                                <th className="px-4 py-3.5 text-center">Sex</th>
                                <th className="px-4 py-3.5 text-center">
                                    Umur
                                </th>
                                <th className="px-4 py-3.5">
                                    Tempat/Tgl Lahir
                                </th>
                                <th className="px-4 py-3.5">No Paspor</th>
                                <th className="px-4 py-3.5 text-center">
                                    Dokumen
                                </th>
                                <th className="px-4 py-3.5">Berkas</th>
                                <th className="px-5 py-3.5">
                                    Paket Keberangkatan
                                </th>
                                <th className="px-4 py-3.5">Agen Asal</th>
                                <th className="px-4 py-3.5 text-center">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {jamaahs.data.map(
                                (j: JamaahMember, index: number) => {
                                    const pkgName =
                                        j.bookings && j.bookings.length > 0
                                            ? j.bookings[0].package?.name
                                            : 'Belum Assign';
                                    const agentName = j.user
                                        ? j.user.role === 'agen'
                                            ? j.user.name
                                            : j.user.agent?.name ||
                                              'Pusat/Mandiri'
                                        : 'Pusat/Mandiri';

                                    return (
                                        <tr
                                            key={j.id}
                                            className="divide-x divide-slate-100 transition-colors hover:bg-slate-50/50"
                                        >
                                            <td className="px-4 py-4 text-center font-extrabold text-slate-400">
                                                {(jamaahs.current_page - 1) *
                                                    jamaahs.per_page +
                                                    index +
                                                    1}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="text-sm font-extrabold text-slate-800">
                                                    {j.name}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-center font-bold text-slate-700">
                                                {j.jenis_kelamin === 'Laki-laki'
                                                    ? 'L'
                                                    : j.jenis_kelamin ===
                                                        'Perempuan'
                                                      ? 'P'
                                                      : '-'}
                                            </td>
                                            <td className="bg-slate-50/20 px-4 py-4 text-center font-extrabold text-slate-700">
                                                {calculateAge(j.tgl_lahir)}
                                            </td>
                                            <td className="px-4 py-4">
                                                {j.tempat_lahir &&
                                                j.tgl_lahir ? (
                                                    <div className="font-semibold text-slate-700">
                                                        {j.tempat_lahir},{' '}
                                                        <span className="text-[11px] font-bold text-slate-500">
                                                            {new Date(
                                                                j.tgl_lahir,
                                                            ).toLocaleDateString(
                                                                'id-ID',
                                                            )}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                {j.nomor_paspor ? (
                                                    <div className="font-bold text-slate-800">
                                                        {j.nomor_paspor}
                                                        {j.paspor_expiry && (
                                                            <div className="text-[9px] font-extrabold text-amber-600">
                                                                Exp:{' '}
                                                                {new Date(
                                                                    j.paspor_expiry,
                                                                ).toLocaleDateString(
                                                                    'id-ID',
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="font-bold text-slate-400 italic">
                                                        Belum Isi
                                                    </span>
                                                )}
                                            </td>
                                            {/* PP, VM, VP statuses */}
                                            <td className="px-4 py-4">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span
                                                        className={`rounded px-2 py-0.5 text-[9px] font-black ${j.pp && j.pp !== '-' ? 'text-emerald-850 border border-emerald-200 bg-emerald-100' : 'bg-slate-100 text-slate-400'}`}
                                                    >
                                                        PP:{' '}
                                                        {j.pp && j.pp !== '-'
                                                            ? j.pp
                                                            : '-'}
                                                    </span>
                                                    <span
                                                        className={`rounded px-2 py-0.5 text-[9px] font-black ${j.vm && j.vm !== '-' ? 'text-indigo-855 border border-indigo-200 bg-indigo-100' : 'bg-slate-100 text-slate-400'}`}
                                                    >
                                                        VM:{' '}
                                                        {j.vm && j.vm !== '-'
                                                            ? j.vm
                                                            : '-'}
                                                    </span>
                                                    <span
                                                        className={`rounded px-2 py-0.5 text-[9px] font-black ${j.vp && j.vp !== '-' ? 'text-amber-855 border border-amber-200 bg-amber-100' : 'bg-slate-100 text-slate-400'}`}
                                                    >
                                                        VP:{' '}
                                                        {j.vp && j.vp !== '-'
                                                            ? j.vp
                                                            : '-'}
                                                    </span>
                                                </div>
                                            </td>
                                            {/* Files */}
                                            <td className="px-4 py-4">
                                                <div className="flex flex-col gap-1">
                                                    {j.paspor_file ? (
                                                        <a
                                                            href={`/storage-file/${j.paspor_file}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-0.5 text-[10px] font-extrabold text-emerald-700 hover:underline"
                                                        >
                                                            ✓ Paspor
                                                        </a>
                                                    ) : (
                                                        <span className="text-[10px] text-slate-400 italic">
                                                            No Paspor File
                                                        </span>
                                                    )}
                                                    {j.vaksin_file ? (
                                                        <a
                                                            href={`/storage-file/${j.vaksin_file}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-0.5 text-[10px] font-extrabold text-emerald-700 hover:underline"
                                                        >
                                                            ✓ Vaksin
                                                        </a>
                                                    ) : (
                                                        <span className="text-[10px] text-slate-400 italic">
                                                            No Vaksin File
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span
                                                    className="block max-w-[180px] truncate font-extrabold text-slate-700"
                                                    title={pkgName}
                                                >
                                                    {pkgName}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-[9px] font-black tracking-wider text-slate-600 uppercase">
                                                    {agentName}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openEdit(j)}
                                                    className="mx-auto flex items-center gap-1 rounded-lg border-emerald-200 bg-emerald-50 px-2.5 py-1.5 font-extrabold text-emerald-700 hover:bg-emerald-100"
                                                >
                                                    <Edit3 size={13} /> Edit
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                },
                            )}
                        </tbody>
                    </table>
                    {jamaahs.data.length === 0 && (
                        <div className="flex flex-col items-center p-12 text-center text-sm text-slate-500">
                            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-slate-100 bg-slate-50">
                                <Users size={28} className="text-slate-300" />
                            </div>
                            <p className="font-extrabold text-slate-600">
                                Tidak ada manifest jamaah.
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                                Isi manifest dengan mengisi rombongan jamaah
                                pada Booking Order.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <Pagination links={jamaahs.links} />

            {/* Quick Edit Modal */}
            {showModal && editingMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
                    <div className="flex max-h-[90vh] w-full max-w-lg animate-in flex-col overflow-hidden rounded-3xl bg-white p-0 shadow-2xl duration-200 zoom-in-95">
                        <div className="relative flex items-center justify-between overflow-hidden bg-emerald-900 p-6 text-white">
                            <div className="absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500 opacity-20 blur-2xl"></div>
                            <div>
                                <h2 className="relative z-10 flex items-center gap-2 text-xl font-bold">
                                    <UserCheck
                                        size={20}
                                        className="text-amber-400"
                                    />
                                    Edit Data Jamaah
                                </h2>
                                <p className="relative z-10 mt-0.5 text-[11px] font-medium text-emerald-200/90">
                                    Manifest Keberangkatan
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingMember(null);
                                }}
                                className="relative z-10 text-emerald-300 transition-colors hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form
                            onSubmit={submit}
                            className="flex-1 space-y-4 overflow-y-auto p-6"
                        >
                            {Object.keys(errors).length > 0 && (
                                <div className="space-y-1 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-600">
                                    {Object.values(errors).map((err, idx) => (
                                        <p key={idx}>• {err}</p>
                                    ))}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <Label className="text-xs font-bold text-slate-700">
                                        Nama Lengkap *
                                    </Label>
                                    <Input
                                        required
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label className="text-xs font-bold text-slate-700">
                                        Jenis Kelamin *
                                    </Label>
                                    <select
                                        required
                                        value={data.jenis_kelamin}
                                        onChange={(e) =>
                                            setData(
                                                'jenis_kelamin',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 h-9 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm"
                                    >
                                        <option value="">Pilih...</option>
                                        <option value="Laki-laki">
                                            Laki-laki
                                        </option>
                                        <option value="Perempuan">
                                            Perempuan
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <Label className="text-xs font-bold text-slate-700">
                                        Tempat Lahir
                                    </Label>
                                    <Input
                                        value={data.tempat_lahir}
                                        onChange={(e) =>
                                            setData(
                                                'tempat_lahir',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label className="text-xs font-bold text-slate-700">
                                        Tanggal Lahir
                                    </Label>
                                    <Input
                                        type="date"
                                        value={data.tgl_lahir}
                                        onChange={(e) =>
                                            setData('tgl_lahir', e.target.value)
                                        }
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label className="text-xs font-bold text-slate-700">
                                        Nomor Paspor
                                    </Label>
                                    <Input
                                        value={data.nomor_paspor}
                                        onChange={(e) =>
                                            setData(
                                                'nomor_paspor',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label className="text-xs font-bold text-slate-700">
                                        Tanggal Terbit
                                    </Label>
                                    <Input
                                        type="date"
                                        value={data.paspor_issued}
                                        onChange={(e) =>
                                            setData(
                                                'paspor_issued',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label className="text-xs font-bold text-slate-700">
                                        Tanggal Habis Berlaku
                                    </Label>
                                    <Input
                                        type="date"
                                        value={data.paspor_expiry}
                                        onChange={(e) =>
                                            setData(
                                                'paspor_expiry',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <Label className="text-xs font-bold text-slate-700">
                                        Kantor Imigrasi
                                    </Label>
                                    <Input
                                        value={data.paspor_office}
                                        onChange={(e) =>
                                            setData(
                                                'paspor_office',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            {/* Checklist status toggles */}
                            <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <span className="block text-[11px] font-black tracking-wider text-slate-400 uppercase">
                                    Checklist Persyaratan
                                </span>
                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <Label className="text-[10px] font-bold text-slate-500">
                                            Paspor (PP)
                                        </Label>
                                        <select
                                            value={data.pp}
                                            onChange={(e) =>
                                                setData('pp', e.target.value)
                                            }
                                            className="border-slate-350 mt-1 h-8 w-full rounded-lg border bg-white px-2 text-xs font-bold text-slate-700"
                                        >
                                            <option value="-">-</option>
                                            <option value="Pusat">Pusat</option>
                                            <option value="Pasuruan">
                                                Pasuruan
                                            </option>
                                            <option value="Jamaah">
                                                Jamaah
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label className="text-[10px] font-bold text-slate-500">
                                            Vaksin Meningitis (VM)
                                        </Label>
                                        <select
                                            value={data.vm}
                                            onChange={(e) =>
                                                setData('vm', e.target.value)
                                            }
                                            className="border-slate-350 mt-1 h-8 w-full rounded-lg border bg-white px-2 text-xs font-bold text-slate-700"
                                        >
                                            <option value="-">-</option>
                                            <option value="Pusat">Pusat</option>
                                            <option value="Pasuruan">
                                                Pasuruan
                                            </option>
                                            <option value="Jamaah">
                                                Jamaah
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label className="text-[10px] font-bold text-slate-500">
                                            Vaksin Polio (VP)
                                        </Label>
                                        <select
                                            value={data.vp}
                                            onChange={(e) =>
                                                setData('vp', e.target.value)
                                            }
                                            className="border-slate-350 mt-1 h-8 w-full rounded-lg border bg-white px-2 text-xs font-bold text-slate-700"
                                        >
                                            <option value="-">-</option>
                                            <option value="Pusat">Pusat</option>
                                            <option value="Pasuruan">
                                                Pasuruan
                                            </option>
                                            <option value="Jamaah">
                                                Jamaah
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Documents Upload */}
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div>
                                    <Label className="mb-1 block text-xs font-bold text-slate-700">
                                        Unggah Paspor (Ganti)
                                    </Label>
                                    <Input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={(e) =>
                                            setData(
                                                'paspor_file',
                                                e.target.files?.[0] || null,
                                            )
                                        }
                                        className="border-slate-305 cursor-pointer bg-slate-50 text-xs"
                                    />
                                    {editingMember.paspor_file &&
                                        !data.paspor_file && (
                                            <span className="mt-1 block text-[10px] font-extrabold text-emerald-600">
                                                ✓ File Tersimpan
                                            </span>
                                        )}
                                </div>
                                <div>
                                    <Label className="mb-1 block text-xs font-bold text-slate-700">
                                        Unggah Paspor Lembar Kedua (Ganti)
                                    </Label>
                                    <Input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={(e) =>
                                            setData(
                                                'paspor_second_file',
                                                e.target.files?.[0] || null,
                                            )
                                        }
                                        className="border-slate-305 cursor-pointer bg-slate-50 text-xs"
                                    />
                                    {editingMember.paspor_second_file &&
                                        !data.paspor_second_file && (
                                            <span className="mt-1 block text-[10px] font-extrabold text-emerald-600">
                                                ✓ File Tersimpan
                                            </span>
                                        )}
                                </div>
                                <div>
                                    <Label className="mb-1 block text-xs font-bold text-slate-700">
                                        Unggah KTP (Ganti)
                                    </Label>
                                    <Input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={(e) =>
                                            setData(
                                                'ktp_file',
                                                e.target.files?.[0] || null,
                                            )
                                        }
                                        className="border-slate-305 cursor-pointer bg-slate-50 text-xs"
                                    />
                                    {editingMember.ktp_file &&
                                        !data.ktp_file && (
                                            <span className="mt-1 block text-[10px] font-extrabold text-emerald-600">
                                                ✓ File Tersimpan
                                            </span>
                                        )}
                                </div>
                                <div>
                                    <Label className="mb-1 block text-xs font-bold text-slate-700">
                                        Unggah KK (Ganti)
                                    </Label>
                                    <Input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={(e) =>
                                            setData(
                                                'kk_file',
                                                e.target.files?.[0] || null,
                                            )
                                        }
                                        className="border-slate-305 cursor-pointer bg-slate-50 text-xs"
                                    />
                                    {editingMember.kk_file && !data.kk_file && (
                                        <span className="mt-1 block text-[10px] font-extrabold text-emerald-600">
                                            ✓ File Tersimpan
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <Label className="mb-1 block text-xs font-bold text-slate-700">
                                        Unggah Vaksin (Ganti)
                                    </Label>
                                    <Input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={(e) =>
                                            setData(
                                                'vaksin_file',
                                                e.target.files?.[0] || null,
                                            )
                                        }
                                        className="border-slate-305 cursor-pointer bg-slate-50 text-xs"
                                    />
                                    {editingMember.vaksin_file &&
                                        !data.vaksin_file && (
                                            <span className="mt-1 block text-[10px] font-extrabold text-emerald-600">
                                                ✓ File Tersimpan
                                            </span>
                                        )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingMember(null);
                                    }}
                                    className="rounded-xl font-bold"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-emerald-600 font-extrabold text-white shadow-md hover:bg-emerald-700"
                                >
                                    Simpan Perubahan
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

Jamaahs.layout = {
    breadcrumbs: [{ title: 'Manifest Keberangkatan', href: '/admin/jamaah' }],
};
