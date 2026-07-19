import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    ClipboardList,
    ArrowLeft,
    Save,
    FileUp,
    Check,
    ShieldCheck,
    AlertCircle,
    FileText,
    UserCheck,
    ArrowRightLeft,
    X,
    Search,
    Database,
    Printer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

interface PaxRow {
    booking_id: number | null;
    member_id: number | null;
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
    paspor_file_url: string | null;
    vaksin_file_url: string | null;
    // Client-only fields
    paspor_file?: File | null;
    vaksin_file?: File | null;
}

export default function IsiJamaah({
    order,
    paxRows,
    packages = [],
}: PageProps<{
    order: any;
    paxRows: PaxRow[];
    packages: any[];
}>) {
    const [rows, setRows] = useState<PaxRow[]>(paxRows);
    const [processing, setProcessing] = useState(false);
    const [selectedRowToMove, setSelectedRowToMove] = useState<PaxRow | null>(
        null,
    );
    const [targetPackageId, setTargetPackageId] = useState<string>('');
    const [moving, setMoving] = useState(false);

    // Search Master Data states
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searchIndex, setSearchIndex] = useState<number | null>(null);
    const [loadingSearch, setLoadingSearch] = useState(false);

    useEffect(() => {
        setRows(paxRows);
    }, [paxRows]);

    const handleSearchJamaah = async (queryStr: string) => {
        setSearchQuery(queryStr);
        if (queryStr.trim().length < 2) {
            setSearchResults([]);
            return;
        }
        setLoadingSearch(true);
        try {
            const response = await fetch(
                `/admin/jamaah-members/search?search=${encodeURIComponent(queryStr)}`,
            );
            if (response.ok) {
                const data = await response.json();
                setSearchResults(data);
            }
        } catch (err) {
            console.error('Error searching jamaah:', err);
        } finally {
            setLoadingSearch(false);
        }
    };

    const handleSelectJamaah = (member: any) => {
        if (searchIndex === null) return;
        const newRows = [...rows];
        newRows[searchIndex] = {
            ...newRows[searchIndex],
            member_id: member.id,
            name: member.name,
            jenis_kelamin: member.jenis_kelamin || 'Laki-laki',
            tempat_lahir: member.tempat_lahir || '',
            tgl_lahir: member.tgl_lahir || '',
            nomor_paspor: member.nomor_paspor || '',
            paspor_issued: member.paspor_issued || '',
            paspor_expiry: member.paspor_expiry || '',
            paspor_office: member.paspor_office || '',
            pp: member.pp || '-',
            vm: member.vm || '-',
            vp: member.vp || '-',
            paspor_file_url: member.paspor_file_url || null,
            vaksin_file_url: member.vaksin_file_url || null,
        };
        setRows(newRows);
        setSearchModalOpen(false);
        setSearchQuery('');
        setSearchResults([]);
        setSearchIndex(null);
    };

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

    const handleInputChange = (
        index: number,
        field: keyof PaxRow,
        value: any,
    ) => {
        const newRows = [...rows];
        newRows[index] = {
            ...newRows[index],
            [field]: value,
        };
        setRows(newRows);
    };

    const handleFileChange = (
        index: number,
        field: 'paspor_file' | 'vaksin_file',
        file: File | null,
    ) => {
        const newRows = [...rows];
        newRows[index] = {
            ...newRows[index],
            [field]: file,
        };
        setRows(newRows);
    };

    // Metrics calculations
    const totalTarget = order.total_pax;
    const filledCount = rows.filter(
        (r) => r.name && r.name.trim() !== '',
    ).length;
    const remainingCount = Math.max(0, totalTarget - filledCount);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData();

        rows.forEach((row, index) => {
            formData.append(
                `jamaahs[${index}][booking_id]`,
                row.booking_id ? row.booking_id.toString() : '',
            );
            formData.append(
                `jamaahs[${index}][member_id]`,
                row.member_id ? row.member_id.toString() : '',
            );
            formData.append(`jamaahs[${index}][name]`, row.name || '');
            formData.append(
                `jamaahs[${index}][jenis_kelamin]`,
                row.jenis_kelamin || '',
            );
            formData.append(
                `jamaahs[${index}][tempat_lahir]`,
                row.tempat_lahir || '',
            );
            formData.append(
                `jamaahs[${index}][tgl_lahir]`,
                row.tgl_lahir || '',
            );
            formData.append(
                `jamaahs[${index}][nomor_paspor]`,
                row.nomor_paspor || '',
            );
            formData.append(
                `jamaahs[${index}][paspor_issued]`,
                row.paspor_issued || '',
            );
            formData.append(
                `jamaahs[${index}][paspor_expiry]`,
                row.paspor_expiry || '',
            );
            formData.append(
                `jamaahs[${index}][paspor_office]`,
                row.paspor_office || '',
            );
            formData.append(`jamaahs[${index}][pp]`, row.pp || '-');
            formData.append(`jamaahs[${index}][vm]`, row.vm || '-');
            formData.append(`jamaahs[${index}][vp]`, row.vp || '-');

            if (row.paspor_file) {
                formData.append(`paspor_file_${index}`, row.paspor_file);
            }
            if (row.vaksin_file) {
                formData.append(`vaksin_file_${index}`, row.vaksin_file);
            }
        });

        router.post(`/admin/orders/${order.id}/save-jamaah`, formData, {
            forceFormData: true,
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <div className="mx-auto min-h-screen w-full max-w-full bg-slate-50 p-6 font-sans md:p-8">
            <Head title="Input Data Jamaah" />

            {/* Top Navigation & Title */}
            <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-800">
                        <ClipboardList className="text-emerald-600" size={28} />
                        Penginputan Manifest Jamaah
                    </h1>
                    <p className="mt-1 text-sm font-bold text-slate-500">
                        {order.agent?.name} • Paket: {order.package?.name}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.get('/admin/orders')}
                        className="flex items-center gap-1.5 rounded-xl border-slate-300 bg-white font-bold text-slate-700 shadow-sm hover:bg-slate-100"
                    >
                        <ArrowLeft size={16} /> Kembali ke Order
                    </Button>
                </div>
            </div>

            {/* Metrics Dashboard Row */}
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                {/* Metric 1 */}
                <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-emerald-800 bg-emerald-900 p-5 text-white shadow-lg">
                    <div className="absolute top-0 right-0 h-24 w-24 translate-x-1/3 -translate-y-1/2 rounded-full bg-amber-400 opacity-20 blur-2xl"></div>
                    <span className="mb-2 block text-[10px] font-bold tracking-wider text-emerald-200 uppercase">
                        TARGET PAX ORDER
                    </span>
                    <span className="text-3xl font-black tracking-tight text-amber-400">
                        {totalTarget}{' '}
                        <span className="text-sm font-medium text-emerald-200">
                            Seat
                        </span>
                    </span>
                </div>
                {/* Metric 2 */}
                <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <span className="mb-2 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        JAMAAH TERISI
                    </span>
                    <span className="text-3xl font-black tracking-tight text-emerald-600">
                        {filledCount}{' '}
                        <span className="text-xs font-bold text-slate-400">
                            terisi
                        </span>
                    </span>
                </div>
                {/* Metric 3 */}
                <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <span className="mb-2 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        SISA BELUM DIISI
                    </span>
                    <span className="text-3xl font-black tracking-tight text-slate-700">
                        {remainingCount}
                        <span className="ml-1 text-xs font-bold text-slate-400">
                            pax kosong
                        </span>
                    </span>
                </div>
                {/* Metric 4 - Tip Box */}
                <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm md:col-span-1">
                    <div className="mt-0.5 shrink-0 rounded-xl bg-amber-100 p-2 text-amber-700">
                        <UserCheck size={18} />
                    </div>
                    <div>
                        <span className="mb-0.5 block text-xs font-black text-amber-800">
                            Pengisian Cepat
                        </span>
                        <p className="text-[11px] leading-relaxed font-bold text-amber-700/90">
                            Cukup isi <span className="underline">Nama</span> &{' '}
                            <span className="underline">Sex</span> untuk
                            menyimpan. Paspor & Dokumen lainnya bisa dikosongi
                            dan diisi menyusul.
                        </p>
                    </div>
                </div>
            </div>

            {/* Spreadsheet Grid Table */}
            <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                        <thead className="bg-slate-900 font-extrabold text-slate-200">
                            <tr className="divide-x divide-slate-800">
                                <th className="w-10 px-3 py-3.5 text-center text-[10px] tracking-wider uppercase">
                                    No
                                </th>
                                <th className="w-56 px-4 py-3.5 text-[10px] tracking-wider text-amber-400 uppercase">
                                    Nama Lengkap *
                                </th>
                                <th className="w-32 px-3 py-3.5 text-center text-[10px] tracking-wider text-amber-400 uppercase">
                                    Sex (L/P) *
                                </th>
                                <th className="w-14 px-3 py-3.5 text-center text-[10px] tracking-wider uppercase">
                                    Age
                                </th>
                                <th className="w-32 px-3 py-3.5 text-[10px] tracking-wider uppercase">
                                    Tempat Lahir
                                </th>
                                <th className="w-36 px-3 py-3.5 text-[10px] tracking-wider uppercase">
                                    Tgl Lahir
                                </th>
                                <th className="w-36 px-3 py-3.5 text-[10px] tracking-wider uppercase">
                                    No Paspor
                                </th>
                                <th className="w-36 px-3 py-3.5 text-[10px] tracking-wider uppercase">
                                    Issued Date
                                </th>
                                <th className="w-36 px-3 py-3.5 text-[10px] tracking-wider uppercase">
                                    Expiry Date
                                </th>
                                <th className="w-40 px-3 py-3.5 text-[10px] tracking-wider uppercase">
                                    Kantor Imigrasi
                                </th>
                                <th className="w-28 bg-slate-950 px-3 py-3.5 text-center text-[10px] tracking-wider uppercase">
                                    PP
                                </th>
                                <th className="w-28 bg-slate-950 px-3 py-3.5 text-center text-[10px] tracking-wider uppercase">
                                    VM
                                </th>
                                <th className="w-28 bg-slate-950 px-3 py-3.5 text-center text-[10px] tracking-wider uppercase">
                                    VP
                                </th>
                                <th className="w-48 px-4 py-3.5 text-[10px] tracking-wider uppercase">
                                    Upload Paspor
                                </th>
                                <th className="w-48 px-4 py-3.5 text-[10px] tracking-wider uppercase">
                                    Upload Vaksin
                                </th>
                                <th className="w-32 px-4 py-3.5 text-center text-[10px] tracking-wider uppercase">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {rows.map((row, index) => {
                                const hasName =
                                    row.name && row.name.trim() !== '';
                                return (
                                    <tr
                                        key={index}
                                        className={`divide-x divide-slate-100 transition-colors ${
                                            hasName
                                                ? 'bg-white hover:bg-slate-50/50'
                                                : 'bg-slate-50/40 hover:bg-slate-100/30'
                                        }`}
                                    >
                                        {/* NO */}
                                        <td className="px-3 py-4 text-center font-extrabold text-slate-400">
                                            {index + 1}
                                        </td>

                                        {/* NAMA LENGKAP */}
                                        <td className="p-1">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="text"
                                                    value={row.name}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            index,
                                                            'name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="placeholder-slate-350 w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pr-8 pl-2.5 text-xs font-bold text-slate-800 transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                                                    placeholder="Ketik Nama Jamaah..."
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSearchIndex(index);
                                                        setSearchModalOpen(
                                                            true,
                                                        );
                                                    }}
                                                    className="absolute right-2 p-1 text-slate-400 transition-colors hover:text-slate-700"
                                                    title="Pilih dari database jamaah"
                                                >
                                                    <Search size={14} />
                                                </button>
                                            </div>
                                        </td>

                                        {/* SEX (L/P) TOGGLES */}
                                        <td className="p-1 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleInputChange(
                                                            index,
                                                            'jenis_kelamin',
                                                            'Laki-laki',
                                                        )
                                                    }
                                                    className={`rounded-lg border px-3 py-2 text-xs font-black transition-all ${
                                                        row.jenis_kelamin ===
                                                        'Laki-laki'
                                                            ? 'border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/10'
                                                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                                    }`}
                                                >
                                                    L
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleInputChange(
                                                            index,
                                                            'jenis_kelamin',
                                                            'Perempuan',
                                                        )
                                                    }
                                                    className={`rounded-lg border px-3 py-2 text-xs font-black transition-all ${
                                                        row.jenis_kelamin ===
                                                        'Perempuan'
                                                            ? 'border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/10'
                                                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                                    }`}
                                                >
                                                    P
                                                </button>
                                            </div>
                                        </td>

                                        {/* AGE */}
                                        <td className="bg-slate-50/20 px-3 py-4 text-center font-bold text-slate-600">
                                            {calculateAge(row.tgl_lahir)}
                                        </td>

                                        {/* PLACE OF BIRTH */}
                                        <td className="p-1">
                                            <input
                                                type="text"
                                                value={row.tempat_lahir}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        index,
                                                        'tempat_lahir',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-2.5 py-2.5 text-xs font-bold text-slate-700 transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                                                placeholder="Kota Lahir..."
                                            />
                                        </td>

                                        {/* DOB */}
                                        <td className="p-1">
                                            <input
                                                type="date"
                                                value={row.tgl_lahir}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        index,
                                                        'tgl_lahir',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-2.5 py-2 text-xs font-bold text-slate-700 transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                                            />
                                        </td>

                                        {/* PASSPORT NO */}
                                        <td className="p-1">
                                            <input
                                                type="text"
                                                value={row.nomor_paspor}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        index,
                                                        'nomor_paspor',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-2.5 py-2.5 text-xs font-bold text-slate-700 transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                                                placeholder="No Paspor..."
                                            />
                                        </td>

                                        {/* PASSPORT ISSUED DATE */}
                                        <td className="p-1">
                                            <input
                                                type="date"
                                                value={row.paspor_issued}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        index,
                                                        'paspor_issued',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-2.5 py-2 text-xs font-bold text-slate-700 transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                                            />
                                        </td>

                                        {/* PASSPORT EXPIRY DATE */}
                                        <td className="p-1">
                                            <input
                                                type="date"
                                                value={row.paspor_expiry}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        index,
                                                        'paspor_expiry',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-2.5 py-2 text-xs font-bold text-slate-700 transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                                            />
                                        </td>

                                        {/* IMMIGRATION OFFICE */}
                                        <td className="p-1">
                                            <input
                                                type="text"
                                                value={row.paspor_office}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        index,
                                                        'paspor_office',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-2.5 py-2.5 text-xs font-bold text-slate-700 transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                                                placeholder="Kantor Imigrasi..."
                                            />
                                        </td>

                                        {/* PP DROPDOWN */}
                                        <td className="bg-slate-50/40 p-1 text-center">
                                            <select
                                                value={row.pp || '-'}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        index,
                                                        'pp',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-9 w-24 rounded-lg border border-slate-300 bg-white px-2 text-xs font-bold text-slate-700"
                                            >
                                                <option value="-">-</option>
                                                <option value="Pusat">
                                                    Pusat
                                                </option>
                                                <option value="Pasuruan">
                                                    Pasuruan
                                                </option>
                                                <option value="Mandiri">
                                                    Mandiri
                                                </option>
                                            </select>
                                        </td>

                                        {/* VM DROPDOWN */}
                                        <td className="bg-slate-50/40 p-1 text-center">
                                            <select
                                                value={row.vm || '-'}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        index,
                                                        'vm',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-9 w-24 rounded-lg border border-slate-300 bg-white px-2 text-xs font-bold text-slate-700"
                                            >
                                                <option value="-">-</option>
                                                <option value="Pusat">
                                                    Pusat
                                                </option>
                                                <option value="Pasuruan">
                                                    Pasuruan
                                                </option>
                                                <option value="Mandiri">
                                                    Mandiri
                                                </option>
                                            </select>
                                        </td>

                                        {/* VP DROPDOWN */}
                                        <td className="bg-slate-50/40 p-1 text-center">
                                            <select
                                                value={row.vp || '-'}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        index,
                                                        'vp',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-9 w-24 rounded-lg border border-slate-300 bg-white px-2 text-xs font-bold text-slate-700"
                                            >
                                                <option value="-">-</option>
                                                <option value="Pusat">
                                                    Pusat
                                                </option>
                                                <option value="Pasuruan">
                                                    Pasuruan
                                                </option>
                                                <option value="Mandiri">
                                                    Mandiri
                                                </option>
                                            </select>
                                        </td>

                                        {/* UPLOAD PASSPORT */}
                                        <td className="px-3 py-2.5">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="file"
                                                    id={`paspor-upload-${index}`}
                                                    className="hidden"
                                                    accept=".jpg,.jpeg,.png,.pdf"
                                                    onChange={(e) => {
                                                        const file =
                                                            e.target
                                                                .files?.[0] ||
                                                            null;
                                                        handleFileChange(
                                                            index,
                                                            'paspor_file',
                                                            file,
                                                        );
                                                    }}
                                                />
                                                <label
                                                    htmlFor={`paspor-upload-${index}`}
                                                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1.5 text-[11px] font-bold text-slate-700 transition-colors hover:bg-slate-200"
                                                >
                                                    <FileUp size={13} /> Upload
                                                </label>
                                                {row.paspor_file && (
                                                    <span
                                                        className="max-w-[80px] truncate text-[10px] font-extrabold text-emerald-600"
                                                        title={
                                                            row.paspor_file.name
                                                        }
                                                    >
                                                        ✓ {row.paspor_file.name}
                                                    </span>
                                                )}
                                                {!row.paspor_file &&
                                                    row.paspor_file_url && (
                                                        <a
                                                            href={
                                                                row.paspor_file_url
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-0.5 text-[11px] font-extrabold text-emerald-700 hover:underline"
                                                        >
                                                            <ShieldCheck
                                                                size={12}
                                                            />{' '}
                                                            Lihat
                                                        </a>
                                                    )}
                                            </div>
                                        </td>

                                        {/* UPLOAD VAKSIN */}
                                        <td className="px-3 py-2.5">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="file"
                                                    id={`vaksin-upload-${index}`}
                                                    className="hidden"
                                                    accept=".jpg,.jpeg,.png,.pdf"
                                                    onChange={(e) => {
                                                        const file =
                                                            e.target
                                                                .files?.[0] ||
                                                            null;
                                                        handleFileChange(
                                                            index,
                                                            'vaksin_file',
                                                            file,
                                                        );
                                                    }}
                                                />
                                                <label
                                                    htmlFor={`vaksin-upload-${index}`}
                                                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1.5 text-[11px] font-bold text-slate-700 transition-colors hover:bg-slate-200"
                                                >
                                                    <FileUp size={13} /> Upload
                                                </label>
                                                {row.vaksin_file && (
                                                    <span
                                                        className="max-w-[80px] truncate text-[10px] font-extrabold text-emerald-600"
                                                        title={
                                                            row.vaksin_file.name
                                                        }
                                                    >
                                                        ✓ {row.vaksin_file.name}
                                                    </span>
                                                )}
                                                {!row.vaksin_file &&
                                                    row.vaksin_file_url && (
                                                        <a
                                                            href={
                                                                row.vaksin_file_url
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-0.5 text-[11px] font-extrabold text-emerald-700 hover:underline"
                                                        >
                                                            <ShieldCheck
                                                                size={12}
                                                            />{' '}
                                                            Lihat
                                                        </a>
                                                    )}
                                            </div>
                                        </td>

                                        {/* AKSI */}
                                        <td className="px-4 py-2.5 text-center">
                                            {row.booking_id ? (
                                                <div className="flex flex-col items-center justify-center gap-1.5">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        onClick={() =>
                                                            setSelectedRowToMove(
                                                                row,
                                                            )
                                                        }
                                                        className="flex h-8 w-full items-center justify-center gap-1 rounded-lg bg-amber-500 px-2 text-[10px] font-extrabold text-white shadow-sm transition-all hover:bg-amber-600"
                                                    >
                                                        <ArrowRightLeft
                                                            size={12}
                                                        />{' '}
                                                        Pindah Paket
                                                    </Button>
                                                    <a
                                                        href={`/admin/bookings/${row.booking_id}/registration-form`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex h-8 w-full items-center justify-center gap-1 rounded-lg bg-blue-600 px-2 py-1.5 text-center text-[10px] font-bold text-white shadow-sm transition-all hover:bg-blue-700"
                                                    >
                                                        <Printer size={12} />{' '}
                                                        Cetak Form
                                                    </a>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] font-bold text-slate-400 italic">
                                                    Simpan data dulu
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
                <span className="text-xs font-bold text-slate-500">
                    * Pastikan Anda menekan tombol Simpan sebelum meninggalkan
                    halaman.
                </span>

                <div className="flex gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.get('/admin/orders')}
                        className="border-slate-350 rounded-xl px-6 font-bold hover:bg-slate-50"
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={submit}
                        disabled={processing}
                        className="gap-2 rounded-xl bg-emerald-600 px-8 font-extrabold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700"
                    >
                        <Save size={16} /> SIMPAN SEMUA DATA
                    </Button>
                </div>
            </div>

            {/* Move Package Modal */}
            {selectedRowToMove && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                    <div className="flex w-full max-w-md animate-in flex-col overflow-hidden rounded-3xl bg-white p-0 text-slate-800 shadow-2xl duration-200 zoom-in-95">
                        <div className="relative flex items-center justify-between overflow-hidden bg-emerald-900 p-6 text-white">
                            <div className="absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500 opacity-20 blur-2xl"></div>
                            <h2 className="relative z-10 flex items-center gap-2 text-xl font-bold">
                                <ArrowRightLeft
                                    size={20}
                                    className="text-amber-400"
                                />{' '}
                                Pindah Paket Jamaah
                            </h2>
                            <button
                                onClick={() => {
                                    setSelectedRowToMove(null);
                                    setTargetPackageId('');
                                }}
                                className="text-emerald-305 relative z-10 transition-colors hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-6 p-6 md:p-8">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <span className="mb-1 block text-[10px] font-bold text-slate-400 uppercase">
                                    Nama Jamaah
                                </span>
                                <span className="font-extrabold text-slate-800">
                                    {selectedRowToMove.name}
                                </span>
                                <span className="mt-3 mb-1 block text-[10px] font-bold text-slate-400 uppercase">
                                    Paket Saat Ini
                                </span>
                                <span className="text-xs font-bold text-emerald-700">
                                    {order.package?.name}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-black tracking-wider text-slate-700 uppercase">
                                    Pilih Paket Tujuan
                                </label>
                                <select
                                    required
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 focus:border-emerald-500 focus:ring-emerald-500"
                                    value={targetPackageId}
                                    onChange={(e) =>
                                        setTargetPackageId(e.target.value)
                                    }
                                >
                                    <option value="">
                                        -- Pilih Paket Tujuan --
                                    </option>
                                    {packages.map((pkg) => (
                                        <option
                                            key={pkg.id}
                                            value={pkg.id}
                                            disabled={pkg.available_seats <= 0}
                                        >
                                            {pkg.name} (
                                            {pkg.available_seats > 0
                                                ? `Sisa: ${pkg.available_seats} seat`
                                                : 'Penuh'}
                                            ) - Rp{' '}
                                            {parseFloat(
                                                pkg.price,
                                            ).toLocaleString('id-ID')}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setSelectedRowToMove(null);
                                        setTargetPackageId('');
                                    }}
                                    className="text-slate-650 rounded-xl border-slate-300 px-6 font-bold hover:bg-slate-50"
                                    disabled={moving}
                                >
                                    Batal
                                </Button>
                                <Button
                                    onClick={() => {
                                        if (!targetPackageId) return;
                                        setMoving(true);
                                        router.post(
                                            `/admin/bookings/${selectedRowToMove.booking_id}/move-package`,
                                            {
                                                target_package_id:
                                                    targetPackageId,
                                            },
                                            {
                                                onSuccess: () => {
                                                    setSelectedRowToMove(null);
                                                    setTargetPackageId('');
                                                },
                                                onFinish: () =>
                                                    setMoving(false),
                                            },
                                        );
                                    }}
                                    disabled={moving || !targetPackageId}
                                    className="rounded-xl bg-emerald-600 px-6 font-bold text-white shadow-md hover:bg-emerald-700"
                                >
                                    {moving
                                        ? 'Memproses...'
                                        : 'Konfirmasi Pindah'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Search Master Data Modal */}
            {searchModalOpen && searchIndex !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                    <div className="flex w-full max-w-lg animate-in flex-col overflow-hidden rounded-3xl bg-white p-0 text-slate-800 shadow-2xl duration-200 zoom-in-95">
                        <div className="relative flex items-center justify-between overflow-hidden bg-emerald-900 p-6 text-white">
                            <div className="absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500 opacity-20 blur-2xl"></div>
                            <h2 className="relative z-10 flex items-center gap-2 text-xl font-bold">
                                <Database
                                    size={20}
                                    className="text-amber-400"
                                />{' '}
                                Pilih dari Database Jamaah
                            </h2>
                            <button
                                onClick={() => {
                                    setSearchModalOpen(false);
                                    setSearchQuery('');
                                    setSearchResults([]);
                                    setSearchIndex(null);
                                }}
                                className="text-emerald-350 relative z-10 transition-colors hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4 p-6">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        handleSearchJamaah(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                                    placeholder="Ketik Nama atau Nomor Paspor..."
                                    autoFocus
                                />
                            </div>

                            {loadingSearch && (
                                <div className="flex items-center justify-center gap-2 py-8 text-center text-sm font-bold text-slate-500">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"></div>
                                    Mencari jamaah...
                                </div>
                            )}

                            {!loadingSearch &&
                                searchResults.length === 0 &&
                                searchQuery.trim().length >= 2 && (
                                    <div className="py-8 text-center text-sm font-semibold text-slate-500">
                                        Tidak ditemukan jamaah dengan nama/NIK
                                        tersebut.
                                    </div>
                                )}

                            {!loadingSearch &&
                                searchResults.length === 0 &&
                                searchQuery.trim().length < 2 && (
                                    <div className="py-8 text-center text-xs font-semibold text-slate-400">
                                        Ketik minimal 2 karakter untuk mulai
                                        mencari.
                                    </div>
                                )}

                            {!loadingSearch && searchResults.length > 0 && (
                                <div className="max-h-[300px] space-y-2 divide-y divide-slate-100 overflow-y-auto pr-1">
                                    {searchResults.map((member) => (
                                        <div
                                            key={member.id}
                                            onClick={() =>
                                                handleSelectJamaah(member)
                                            }
                                            className="group flex cursor-pointer items-center justify-between rounded-xl border border-transparent p-3 transition-colors hover:border-slate-100 hover:bg-slate-50"
                                        >
                                            <div className="text-left">
                                                <div className="text-sm font-extrabold text-slate-800">
                                                    {member.name}
                                                </div>
                                                <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                                                    <span>
                                                        Paspor:{' '}
                                                        {member.nomor_paspor ||
                                                            '-'}
                                                    </span>
                                                    <span>
                                                        Sex:{' '}
                                                        {member.jenis_kelamin ===
                                                        'Laki-laki'
                                                            ? 'L'
                                                            : 'P'}
                                                    </span>
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                size="sm"
                                                className="rounded-lg bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700"
                                            >
                                                Pilih
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex justify-end border-t border-slate-100 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setSearchModalOpen(false);
                                        setSearchQuery('');
                                        setSearchResults([]);
                                        setSearchIndex(null);
                                    }}
                                    className="rounded-xl border-slate-300 px-6 font-bold text-slate-600 hover:bg-slate-50"
                                >
                                    Tutup
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

IsiJamaah.layout = {
    breadcrumbs: [{ title: 'Input Data Jamaah', href: '/admin/orders' }],
};
