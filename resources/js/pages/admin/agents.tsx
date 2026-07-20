import { Head, useForm, router } from '@inertiajs/react';
import {
    Users,
    UserPlus,
    Edit3,
    X,
    Search,
    FileSpreadsheet,
    Upload,
    Download,
} from 'lucide-react';
import { useState } from 'react';
import Pagination from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { PageProps } from '@/types';

type ImportDetail = {
    row: number;
    code: string;
    name: string;
    phone: string;
    status: 'created' | 'updated' | 'duplicate' | 'conflict' | 'invalid';
    message: string;
};

type ImportResult = {
    summary: Record<
        'total' | 'created' | 'updated' | 'duplicate' | 'conflict' | 'invalid',
        number
    >;
    details: ImportDetail[];
};

export default function Agents({
    agents,
    filters,
    importResult,
}: PageProps<{
    agents: any;
    filters?: any;
    importResult?: ImportResult | null;
}>) {
    const [search, setSearch] = useState(filters?.search || '');
    const [showModal, setShowModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(Boolean(importResult));
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, reset, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        no_wa: '',
        alamat: '',
    });

    const {
        data: importData,
        setData: setImportData,
        post: postImport,
        processing: importProcessing,
        errors: importErrors,
        reset: resetImport,
    } = useForm({
        file: null as File | null,
    });

    const openAdd = () => {
        setEditingId(null);
        reset();
        setShowModal(true);
    };

    const openEdit = (agent: any) => {
        setEditingId(agent.id);
        setData({
            name: agent.name,
            email: agent.email,
            password: '',
            no_wa: agent.profile?.no_wa || '',
            alamat: agent.profile?.alamat || '',
        });
        setShowModal(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingId) {
            put(`/admin/agents/${editingId}`, {
                onSuccess: () => setShowModal(false),
            });
        } else {
            post(`/admin/agents`, { onSuccess: () => setShowModal(false) });
        }
    };

    const handleImportSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postImport('/admin/agents/import', {
            onSuccess: () => {
                resetImport();
            },
        });
    };

    const downloadImportReport = () => {
        if (!importResult) {
return;
}

        const escape = (value: string | number) =>
            `"${String(value).replace(/"/g, '""')}"`;
        const rows = [
            [
                'BARIS',
                'KODE_AGEN',
                'NAMA_AGEN',
                'NO_HP',
                'STATUS',
                'KETERANGAN',
            ],
            ...importResult.details.map((item) => [
                item.row,
                item.code,
                item.name,
                item.phone,
                item.status,
                item.message,
            ]),
        ];
        const csv =
            '\uFEFF' + rows.map((row) => row.map(escape).join(';')).join('\n');
        const url = URL.createObjectURL(
            new Blob([csv], { type: 'text/csv;charset=utf-8' }),
        );
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `laporan_import_agen_${new Date().toISOString().slice(0, 10)}.csv`;
        anchor.click();
        URL.revokeObjectURL(url);
    };

    const toggleStatus = (id: number) => {
        router.patch(
            `/admin/users/${id}/toggle-status`,
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <div className="mx-auto min-h-screen w-full max-w-7xl bg-slate-50 p-6 font-sans md:p-8">
            <Head title="Manajemen Agen" />

            <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight text-slate-800">
                        <Users className="text-amber-500" size={32} />
                        Data Agen Cabang
                    </h1>
                    <p className="mt-2 text-sm font-medium text-slate-500">
                        Kelola akun akses untuk seluruh agen travel cabang Anda.
                    </p>
                </div>
                <div className="flex w-full flex-col items-center gap-3 md:w-auto md:flex-row">
                    <div className="relative w-full md:w-64">
                        <Search
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                            size={18}
                        />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    router.get(
                                        '/admin/agents',
                                        { search },
                                        { preserveState: true, replace: true },
                                    );
                                }
                            }}
                            placeholder="Cari agen..."
                            className="border-slate-200 pl-9"
                        />
                    </div>
                    <Button
                        onClick={() => setShowImportModal(true)}
                        variant="outline"
                        className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border-emerald-600 px-5 font-bold text-emerald-700 transition-transform hover:scale-105 hover:bg-emerald-50 active:scale-95 md:w-auto"
                    >
                        <FileSpreadsheet size={18} /> Import Excel
                    </Button>
                    <Button
                        onClick={openAdd}
                        className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 font-bold text-white shadow-lg shadow-emerald-600/20 transition-transform hover:scale-105 hover:bg-emerald-700 active:scale-95 md:w-auto"
                    >
                        <UserPlus size={18} /> Tambah Agen
                    </Button>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                    <div className="flex max-h-[90vh] w-full max-w-2xl animate-in flex-col overflow-hidden rounded-3xl bg-white p-0 shadow-2xl duration-200 zoom-in-95">
                        <div className="relative flex items-center justify-between overflow-hidden bg-emerald-900 p-6 text-white">
                            <div className="absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500 opacity-20 blur-2xl"></div>
                            <h2 className="relative z-10 flex items-center gap-2 text-xl font-bold">
                                {editingId ? (
                                    <Edit3
                                        size={20}
                                        className="text-amber-400"
                                    />
                                ) : (
                                    <UserPlus
                                        size={20}
                                        className="text-amber-400"
                                    />
                                )}
                                {editingId
                                    ? 'Edit Data Agen'
                                    : 'Buat Akun Agen Baru'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="relative z-10 text-emerald-300 transition-colors hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form
                            onSubmit={submit}
                            className="flex-1 overflow-y-auto p-6 md:p-8"
                        >
                            <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700">
                                        ID Agen / Kode
                                    </Label>
                                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
                                        {editingId
                                            ? agents.data.find(
                                                  (agent: any) =>
                                                      agent.id === editingId,
                                              )?.agent_code || '-'
                                            : 'Dibuat otomatis dengan format m001, m002, dan seterusnya'}
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700">
                                        Nama Agen/Cabang *
                                    </Label>
                                    <Input
                                        required
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="Contoh: Adam (Ust) Jember"
                                        className="rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700">
                                        No Telp / WhatsApp *
                                    </Label>
                                    <Input
                                        required
                                        value={data.no_wa}
                                        onChange={(e) =>
                                            setData('no_wa', e.target.value)
                                        }
                                        placeholder="Contoh: 08123456789"
                                        className="rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                    {errors.no_wa && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.no_wa}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700">
                                        Email Login *
                                    </Label>
                                    <Input
                                        type="email"
                                        required
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        placeholder="email@agen.com"
                                        className="rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <Label className="font-bold text-slate-700">
                                        Alamat Lengkap *
                                    </Label>
                                    <Input
                                        required
                                        value={data.alamat}
                                        onChange={(e) =>
                                            setData('alamat', e.target.value)
                                        }
                                        placeholder="Alamat lengkap kantor/agen"
                                        className="rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                    {errors.alamat && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.alamat}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <Label className="font-bold text-slate-700">
                                        {editingId
                                            ? 'Password Baru (Opsional)'
                                            : 'Password Akun *'}
                                    </Label>
                                    <Input
                                        type="password"
                                        required={!editingId}
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        placeholder={
                                            editingId
                                                ? 'Kosongkan jika tidak ingin diubah'
                                                : 'Minimal 8 karakter'
                                        }
                                        className="rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-10 flex justify-end gap-3 border-t border-slate-100 pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowModal(false)}
                                    className="rounded-xl border-slate-300 px-6 font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-amber-500 px-8 font-bold text-amber-950 shadow-md shadow-amber-500/20 hover:bg-amber-600"
                                >
                                    {editingId
                                        ? 'Simpan Perubahan'
                                        : 'Buat Akun Agen'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showImportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                    <div
                        className={`flex max-h-[90vh] w-full ${importResult ? 'max-w-4xl' : 'max-w-lg'} animate-in flex-col overflow-hidden rounded-3xl bg-white p-0 shadow-2xl duration-200 zoom-in-95`}
                    >
                        <div className="relative flex items-center justify-between overflow-hidden bg-emerald-900 p-6 text-white">
                            <div className="absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500 opacity-20 blur-2xl"></div>
                            <h2 className="relative z-10 flex items-center gap-2 text-xl font-bold">
                                <FileSpreadsheet
                                    size={20}
                                    className="text-amber-400"
                                />
                                Import Agen dari Excel
                            </h2>
                            <button
                                onClick={() => setShowImportModal(false)}
                                className="relative z-10 text-emerald-300 transition-colors hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleImportSubmit}
                            className="flex-1 space-y-6 overflow-y-auto p-6 md:p-8"
                        >
                            <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <h4 className="text-sm font-bold text-amber-900">
                                        Format Excel yang Diterima:
                                    </h4>
                                    <a
                                        href="/admin/agents/import-template"
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-amber-200 px-3 py-1.5 text-[10px] font-extrabold text-amber-950 hover:bg-amber-300"
                                    >
                                        <Download size={13} /> Download Template
                                    </a>
                                </div>
                                <p className="text-xs leading-relaxed text-amber-800">
                                    Unggah file Excel (<code>.xlsx</code>,{' '}
                                    <code>.xls</code>, atau <code>.csv</code>)
                                    dengan susunan kolom sebagai berikut:
                                </p>
                                <div className="mt-2 overflow-x-auto">
                                    <table className="min-w-full border border-amber-200 bg-white text-[10px] text-amber-900">
                                        <thead>
                                            <tr className="bg-amber-100/50">
                                                <th className="border border-amber-200 px-2 py-1">
                                                    ID_AGEN
                                                </th>
                                                <th className="border border-amber-200 px-2 py-1">
                                                    NAMA_AGEN
                                                </th>
                                                <th className="border border-amber-200 px-2 py-1">
                                                    ALAMAT
                                                </th>
                                                <th className="border border-amber-200 px-2 py-1">
                                                    NO_HP
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="border border-amber-200 px-2 py-1">
                                                    a001 / kosong
                                                </td>
                                                <td className="border border-amber-200 px-2 py-1 font-semibold">
                                                    Adam Jember
                                                </td>
                                                <td className="border border-amber-200 px-2 py-1">
                                                    bunut
                                                </td>
                                                <td className="border border-amber-200 px-2 py-1">
                                                    081252777871
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p className="mt-2 text-[10px] leading-relaxed text-amber-700 italic">
                                    * Kode kosong dibuat otomatis. Email menjadi
                                    kode@annamiroh.com dan No HP digunakan
                                    sebagai password awal.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">
                                    Pilih Berkas Excel/CSV *
                                </Label>
                                <div className="relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 p-6 transition-colors hover:bg-slate-50">
                                    <input
                                        type="file"
                                        required
                                        accept=".xlsx,.xls,.csv"
                                        onChange={(e) =>
                                            setImportData(
                                                'file',
                                                e.target.files
                                                    ? e.target.files[0]
                                                    : null,
                                            )
                                        }
                                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                    />
                                    <Upload
                                        className="mb-2 text-slate-400"
                                        size={32}
                                    />
                                    <span className="text-sm font-bold text-slate-600">
                                        {importData.file
                                            ? importData.file.name
                                            : 'Klik atau seret file ke sini'}
                                    </span>
                                    <span className="mt-1 text-xs text-slate-400">
                                        Format: .xlsx, .xls, atau .csv
                                    </span>
                                </div>
                                {importErrors.file && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {importErrors.file}
                                    </p>
                                )}
                            </div>

                            {importResult && (
                                <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <h4 className="text-sm font-extrabold text-slate-800">
                                            Hasil Import Terakhir
                                        </h4>
                                        <button
                                            type="button"
                                            onClick={downloadImportReport}
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-2 text-[10px] font-bold text-white hover:bg-emerald-800"
                                        >
                                            <Download size={13} /> Download
                                            Laporan
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-[10px] sm:grid-cols-3">
                                        {[
                                            [
                                                'Baru',
                                                importResult.summary.created,
                                                'bg-emerald-100 text-emerald-800',
                                            ],
                                            [
                                                'Diperbarui',
                                                importResult.summary.updated,
                                                'bg-blue-100 text-blue-800',
                                            ],
                                            [
                                                'Duplikat',
                                                importResult.summary.duplicate,
                                                'bg-slate-200 text-slate-700',
                                            ],
                                            [
                                                'Konflik',
                                                importResult.summary.conflict,
                                                'bg-amber-100 text-amber-800',
                                            ],
                                            [
                                                'Tidak valid',
                                                importResult.summary.invalid,
                                                'bg-rose-100 text-rose-800',
                                            ],
                                        ].map(([label, value, color]) => (
                                            <div
                                                key={String(label)}
                                                className={`rounded-lg px-3 py-2 ${color}`}
                                            >
                                                <span className="font-bold">
                                                    {label}
                                                </span>
                                                <span className="float-right text-sm font-black">
                                                    {value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="max-h-56 overflow-auto rounded-xl border border-slate-200 bg-white">
                                        <table className="w-full text-left text-[10px]">
                                            <thead className="sticky top-0 bg-slate-100 text-slate-600">
                                                <tr>
                                                    <th className="px-3 py-2">
                                                        Baris
                                                    </th>
                                                    <th className="px-3 py-2">
                                                        Kode/Nama
                                                    </th>
                                                    <th className="px-3 py-2">
                                                        Status
                                                    </th>
                                                    <th className="px-3 py-2">
                                                        Keterangan
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {importResult.details.map(
                                                    (item) => (
                                                        <tr
                                                            key={`${item.row}-${item.code}`}
                                                        >
                                                            <td className="px-3 py-2 font-bold">
                                                                {item.row}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                <div className="font-bold">
                                                                    {item.code}
                                                                </div>
                                                                <div className="text-slate-500">
                                                                    {item.name}
                                                                </div>
                                                            </td>
                                                            <td className="px-3 py-2 font-bold uppercase">
                                                                {item.status}
                                                            </td>
                                                            <td className="max-w-[220px] px-3 py-2 whitespace-normal text-slate-600">
                                                                {item.message}
                                                            </td>
                                                        </tr>
                                                    ),
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowImportModal(false)}
                                    className="rounded-xl border-slate-300 px-6 font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={importProcessing}
                                    className="rounded-xl bg-emerald-600 px-8 font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700"
                                >
                                    {importProcessing ? (
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    ) : (
                                        'Mulai Import'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold tracking-wider uppercase">
                                    Profil Agen Cabang
                                </th>
                                <th className="px-6 py-4 text-[10px] font-bold tracking-wider uppercase">
                                    Kontak & Lokasi
                                </th>
                                <th className="px-6 py-4 text-[10px] font-bold tracking-wider uppercase">
                                    Total Jamaah
                                </th>
                                <th className="px-6 py-4 text-[10px] font-bold tracking-wider uppercase">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-[10px] font-bold tracking-wider uppercase">
                                    Tanggal Bergabung
                                </th>
                                <th className="px-6 py-4 text-right text-[10px] font-bold tracking-wider uppercase">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {agents.data.map((a: any) => (
                                <tr
                                    key={a.id}
                                    className={`transition-colors hover:bg-slate-50/50 ${!a.is_active ? 'opacity-60' : ''}`}
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-base font-extrabold text-slate-800">
                                                {a.name}
                                            </span>
                                            {a.agent_code && (
                                                <span className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-amber-700 uppercase">
                                                    {a.agent_code}
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-1 text-xs font-medium text-slate-500">
                                            {a.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="mb-1 inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                                            WA: {a.profile?.no_wa || '-'}
                                        </div>
                                        <div
                                            className="max-w-[200px] truncate text-xs text-slate-500"
                                            title={a.profile?.alamat}
                                        >
                                            {a.profile?.alamat || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-700">
                                            <Users
                                                size={12}
                                                className="text-amber-500"
                                            />
                                            <span>
                                                {a.jamaah_count || 0} Jamaah
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <button
                                            onClick={() => toggleStatus(a.id)}
                                            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase transition-all hover:shadow-md active:scale-95 ${
                                                a.is_active
                                                    ? 'border border-emerald-200 bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                                    : 'border border-amber-200 bg-amber-100 text-amber-700 hover:bg-amber-200'
                                            }`}
                                            title={
                                                a.is_active
                                                    ? 'Klik untuk menonaktifkan'
                                                    : 'Klik untuk verifikasi / aktifkan'
                                            }
                                        >
                                            <div
                                                className={`h-2 w-2 rounded-full ${a.is_active ? 'animate-pulse bg-emerald-500' : 'bg-amber-500'}`}
                                            ></div>
                                            {a.is_active
                                                ? 'Aktif'
                                                : 'Menunggu Verifikasi'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="font-medium text-slate-700">
                                            {new Date(
                                                a.created_at,
                                            ).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openEdit(a)}
                                            className="rounded-lg border-emerald-200 bg-emerald-50 font-bold text-emerald-700 shadow-sm hover:bg-emerald-100 hover:text-emerald-800"
                                        >
                                            <Edit3
                                                size={14}
                                                className="mr-1.5"
                                            />{' '}
                                            Edit
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {agents.data.length === 0 && (
                        <div className="bg-slate-50 p-12 text-center text-sm font-medium text-slate-500">
                            Belum ada agen cabang yang terdaftar.
                        </div>
                    )}
                </div>
            </div>

            <Pagination links={agents.links} />
        </div>
    );
}

Agents.layout = {
    breadcrumbs: [{ title: 'Data Agen', href: '/admin/agents' }],
};
