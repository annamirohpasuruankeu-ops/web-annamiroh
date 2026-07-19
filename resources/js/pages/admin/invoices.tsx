import { Head, useForm, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    Search,
    Upload,
    X,
    FileText,
    CheckCircle2,
    TrendingUp,
    TrendingDown,
    DollarSign,
    ListFilter,
    Calendar,
    Eye,
    Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import Pagination from '@/components/pagination';

interface InvoiceItemBreakdown {
    desc: string;
    vol: number;
    harga: number;
    sub: number;
}

interface DiscountBreakdown {
    desc: string;
    nominal: number;
}

interface InvoiceItem {
    id: number;
    invoice_code: string | null;
    agent_id: number | null;
    order_text: string | null;
    grand_total: number;
    keterangan: string | null;
    items: InvoiceItemBreakdown[] | null;
    discounts: DiscountBreakdown[] | null;
    raw_agent_name: string | null;
    raw_departure_date_package?: string | null;
    package_id?: number | null;
    package?: {
        id: number;
        name: string;
        code: string;
        departure_date: string;
    } | null;
    agent?: { id: number; name: string };
    created_at: string;
}

interface AgentSummary {
    agent_id: number | null;
    agent_name: string;
    total_tagihan: number;
    total_terbayar: number;
    total_pengeluaran?: number;
    uang_bayar?: number;
    kurang: number;
}

export default function Invoices({
    invoices,
    summary,
    individualSummary,
    filters,
    auth,
    errors,
}: PageProps<{
    invoices: {
        data: InvoiceItem[];
        links: any[];
        current_page: number;
        per_page: number;
    };
    summary: AgentSummary[];
    individualSummary: {
        total_tagihan: number;
        total_terbayar: number;
        total_pengeluaran?: number;
        uang_bayar?: number;
        kurang: number;
    } | null;
    filters: any;
}>) {
    const userRole = auth?.user?.role || 'user';
    const [search, setSearch] = useState(filters?.search || '');
    const [activeTab, setActiveTab] = useState<'summary' | 'details'>(
        userRole === 'agen' ? 'details' : 'summary',
    );
    const [showImportModal, setShowImportModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(
        null,
    );

    const {
        data: importData,
        setData: setImportData,
        post: postImport,
        processing: importing,
        reset: resetImport,
    } = useForm({
        file: null as File | null,
    });

    const handleSearchChange = (val: string) => {
        setSearch(val);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/invoices', { search }, { preserveState: true });
    };

    const handleReset = () => {
        setSearch('');
        router.get('/admin/invoices', {}, { preserveState: true });
    };

    const handleImportSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postImport('/admin/invoices/import', {
            onSuccess: () => {
                setShowImportModal(false);
                resetImport();
            },
        });
    };

    // Calculate aggregated statistics for admin or agent
    const stats = individualSummary
        ? {
              total_tagihan: individualSummary.total_tagihan,
              total_terbayar: individualSummary.total_terbayar,
              total_pengeluaran: individualSummary.total_pengeluaran || 0,
              uang_bayar:
                  individualSummary.uang_bayar ??
                  individualSummary.total_terbayar -
                      (individualSummary.total_pengeluaran || 0),
              kurang: individualSummary.kurang,
          }
        : {
              total_tagihan: summary.reduce(
                  (acc, curr) => acc + curr.total_tagihan,
                  0,
              ),
              total_terbayar: summary.reduce(
                  (acc, curr) => acc + curr.total_terbayar,
                  0,
              ),
              total_pengeluaran: summary.reduce(
                  (acc, curr) => acc + (curr.total_pengeluaran || 0),
                  0,
              ),
              uang_bayar: summary.reduce(
                  (acc, curr) =>
                      acc +
                      (curr.uang_bayar ??
                          curr.total_terbayar - (curr.total_pengeluaran || 0)),
                  0,
              ),
              kurang: summary.reduce((acc, curr) => acc + curr.kurang, 0),
          };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="mx-auto min-h-screen w-full max-w-full bg-slate-50 p-6 font-sans md:p-8">
            <Head title="Tagihan & Invoice Keagenan" />

            {/* Header section */}
            <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-800">
                        <FileText className="text-emerald-600" size={28} />
                        {userRole === 'agen'
                            ? 'Informasi Tagihan Saya'
                            : 'Tagihan & Invoice Keagenan'}
                    </h1>
                    <p className="mt-1 text-sm font-bold text-slate-500">
                        {userRole === 'agen'
                            ? 'Lihat rincian tagihan paket dan status pembayaran Anda.'
                            : 'Kelola data tagihan/invoice dan pantau pelunasan dari masing-masing agen.'}
                    </p>
                </div>
                {['admin', 'pusat'].includes(userRole) && (
                    <Button
                        onClick={() => setShowImportModal(true)}
                        className="flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-extrabold text-white shadow-md transition-all hover:bg-emerald-800"
                    >
                        <Upload size={16} />
                        Import Tagihan Excel
                    </Button>
                )}
            </div>

            {/* Statistics Row */}
            <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {/* Tagihan Tetap */}
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div>
                        <span className="block text-xs font-bold tracking-wider text-slate-400 uppercase">
                            Tagihan Tetap (Rp)
                        </span>
                        <div className="mt-2 text-2xl font-black text-slate-800">
                            {formatCurrency(stats.total_tagihan)}
                        </div>
                        <p className="mt-1 text-xs font-bold text-slate-400">
                            Jumlah keseluruhan tagihan tetap terdata.
                        </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm">
                        <DollarSign size={24} />
                    </div>
                </div>

                {/* Uang Masuk */}
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div>
                        <span className="block text-xs font-bold tracking-wider text-slate-400 uppercase">
                            Uang Masuk (Rp)
                        </span>
                        <div className="mt-2 text-2xl font-black text-emerald-700">
                            {formatCurrency(stats.total_terbayar)}
                        </div>
                        <p className="mt-1 text-xs font-bold text-slate-400">
                            Diambil dari data pemasukan keuangan.
                        </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm">
                        <TrendingUp size={24} />
                    </div>
                </div>

                {/* Pengeluaran */}
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div>
                        <span className="block text-xs font-bold tracking-wider text-slate-400 uppercase">
                            Pengeluaran (Rp)
                        </span>
                        <div className="mt-2 text-2xl font-black text-rose-700">
                            {formatCurrency(stats.total_pengeluaran)}
                        </div>
                        <p className="mt-1 text-xs font-bold text-slate-400">
                            Diambil dari data pengeluaran keuangan.
                        </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 shadow-sm">
                        <TrendingDown size={24} />
                    </div>
                </div>

                {/* Uang Bayar */}
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div>
                        <span className="block text-xs font-bold tracking-wider text-slate-400 uppercase">
                            Uang Bayar (Rp)
                        </span>
                        <div className="mt-2 text-2xl font-black text-blue-700">
                            {formatCurrency(stats.uang_bayar)}
                        </div>
                        <p className="mt-1 text-xs font-bold text-slate-400">
                            Uang masuk dikurangi pengeluaran.
                        </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm">
                        <DollarSign size={24} />
                    </div>
                </div>

                {/* Tagihan Akhir */}
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div>
                        <span className="block text-xs font-bold tracking-wider text-slate-400 uppercase">
                            Tagihan Akhir (Rp)
                        </span>
                        <div className="mt-2 text-2xl font-black text-amber-600">
                            {formatCurrency(stats.kurang)}
                        </div>
                        <p className="mt-1 text-xs font-bold text-slate-400">
                            Kekurangan tagihan akhir yang harus dilunasi.
                        </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shadow-sm">
                        <TrendingDown size={24} />
                    </div>
                </div>
            </div>

            {/* Tabs for Admin / Pusat */}
            {['admin', 'pusat'].includes(userRole) && (
                <div className="mb-6 flex border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('summary')}
                        className={`border-b-2 px-5 py-3 text-sm font-bold transition-all ${
                            activeTab === 'summary'
                                ? 'border-emerald-600 text-emerald-700'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        Ringkasan Keagenan
                    </button>
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`border-b-2 px-5 py-3 text-sm font-bold transition-all ${
                            activeTab === 'details'
                                ? 'border-emerald-600 text-emerald-700'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        Detail Invoice
                    </button>
                </div>
            )}

            {/* TAB CONTENT: Summary per Agent */}
            {['admin', 'pusat'].includes(userRole) &&
                activeTab === 'summary' && (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs whitespace-nowrap">
                                <thead className="divide-x divide-slate-800 bg-slate-900 text-[10px] font-extrabold tracking-wider text-slate-200 uppercase">
                                    <tr>
                                        <th className="w-16 px-5 py-3.5 text-center">
                                            No
                                        </th>
                                        <th className="px-5 py-3.5">
                                            Nama Agen
                                        </th>
                                        <th className="px-5 py-3.5 text-right">
                                            Tagihan Tetap (Rp)
                                        </th>
                                        <th className="px-5 py-3.5 text-right">
                                            Uang Masuk (Rp)
                                        </th>
                                        <th className="px-5 py-3.5 text-right">
                                            Pengeluaran (Rp)
                                        </th>
                                        <th className="px-5 py-3.5 text-right">
                                            Uang Bayar (Rp)
                                        </th>
                                        <th className="px-5 py-3.5 text-right">
                                            Tagihan Akhir (Rp)
                                        </th>
                                        <th className="px-5 py-3.5 text-center">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {summary.map((s, index) => {
                                        const isPaidOff = s.kurang <= 0;
                                        const uangBayar =
                                            s.uang_bayar ??
                                            s.total_terbayar -
                                                (s.total_pengeluaran || 0);
                                        return (
                                            <tr
                                                key={index}
                                                className="divide-x divide-slate-100 font-semibold text-slate-700 transition-colors hover:bg-slate-50/50"
                                            >
                                                <td className="px-5 py-4 text-center font-extrabold text-slate-400">
                                                    {index + 1}
                                                </td>
                                                <td className="px-5 py-4 font-bold text-slate-900">
                                                    {s.agent_name}
                                                </td>
                                                <td className="px-5 py-4 text-right font-extrabold">
                                                    {formatCurrency(
                                                        s.total_tagihan,
                                                    )}
                                                </td>
                                                <td className="bg-emerald-50/10 px-5 py-4 text-right font-extrabold text-emerald-700">
                                                    {formatCurrency(
                                                        s.total_terbayar,
                                                    )}
                                                </td>
                                                <td className="bg-rose-50/10 px-5 py-4 text-right font-extrabold text-rose-700">
                                                    {formatCurrency(
                                                        s.total_pengeluaran ||
                                                            0,
                                                    )}
                                                </td>
                                                <td className="bg-blue-50/10 px-5 py-4 text-right font-extrabold text-blue-700">
                                                    {formatCurrency(uangBayar)}
                                                </td>
                                                <td
                                                    className={`px-5 py-4 text-right font-extrabold ${isPaidOff ? 'text-emerald-600' : 'bg-amber-50/10 text-amber-600'}`}
                                                >
                                                    {formatCurrency(s.kurang)}
                                                </td>
                                                <td className="px-5 py-4 text-center">
                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-[10px] font-black tracking-wider uppercase ${
                                                            isPaidOff
                                                                ? 'border border-emerald-200 bg-emerald-100 text-emerald-800'
                                                                : 'border border-amber-200 bg-amber-100 text-amber-800'
                                                        }`}
                                                    >
                                                        {isPaidOff
                                                            ? 'Lunas'
                                                            : 'Belum Lunas'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {summary.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={8}
                                                className="p-12 text-center text-sm font-extrabold text-slate-500"
                                            >
                                                Tidak ada data ringkasan
                                                keagenan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            {/* TAB CONTENT: Details Invoice List */}
            {activeTab === 'details' && (
                <div className="space-y-4">
                    {/* Search & Filter Form for Admin */}
                    {['admin', 'pusat'].includes(userRole) && (
                        <form
                            onSubmit={handleSearchSubmit}
                            className="flex flex-col items-end gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row"
                        >
                            <div className="w-full flex-1">
                                <Label className="mb-1.5 block text-xs font-bold text-slate-700">
                                    Cari Invoice / Agen / ID Order
                                </Label>
                                <div className="relative">
                                    <Search
                                        className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                                        size={18}
                                    />
                                    <Input
                                        value={search}
                                        onChange={(e) =>
                                            handleSearchChange(e.target.value)
                                        }
                                        placeholder="Cari kode invoice, nama agen, atau keterangan order..."
                                        className="animate-all w-full rounded-xl border-slate-300 bg-white pl-9 font-bold text-slate-700 shadow-sm"
                                    />
                                </div>
                            </div>
                            <div className="flex w-full gap-2 md:w-auto">
                                <Button
                                    type="submit"
                                    className="bg-emerald-650 h-10 flex-1 rounded-xl px-6 font-bold shadow-md hover:bg-emerald-700 md:flex-initial"
                                >
                                    Cari
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleReset}
                                    className="h-10 flex-1 rounded-xl border-slate-300 px-4 font-bold md:flex-initial"
                                >
                                    Reset
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* Table View */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs whitespace-nowrap">
                                <thead className="divide-x divide-slate-800 bg-slate-900 text-[10px] font-extrabold tracking-wider text-slate-200 uppercase">
                                    <tr>
                                        <th className="w-16 px-5 py-3.5 text-center">
                                            No
                                        </th>
                                        <th className="px-5 py-3.5">
                                            ID Tagihan
                                        </th>
                                        <th className="px-5 py-3.5">
                                            Agen Asal
                                        </th>
                                        <th className="px-5 py-3.5">
                                            Paket / Keberangkatan
                                        </th>
                                        <th className="px-5 py-3.5">
                                            ID Order / Keterangan
                                        </th>
                                        <th className="px-5 py-3.5 text-right">
                                            Grand Total (Rp)
                                        </th>
                                        <th className="px-5 py-3.5">
                                            Keterangan
                                        </th>
                                        <th className="px-5 py-3.5 text-center">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {invoices.data.map((inv, index) => {
                                        const agentName =
                                            inv.agent?.name ||
                                            inv.raw_agent_name ||
                                            'Pusat / Mandiri';
                                        const packageName = inv.package
                                            ? `${inv.package.name} (${inv.package.code})`
                                            : inv.raw_departure_date_package ||
                                              '-';
                                        return (
                                            <tr
                                                key={inv.id}
                                                className="divide-x divide-slate-100 font-semibold text-slate-700 transition-colors hover:bg-slate-50/50"
                                            >
                                                <td className="px-5 py-4 text-center font-extrabold text-slate-400">
                                                    {(invoices.current_page -
                                                        1) *
                                                        invoices.per_page +
                                                        index +
                                                        1}
                                                </td>
                                                <td className="px-5 py-4 text-sm font-extrabold text-slate-900">
                                                    {inv.invoice_code || '-'}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`rounded px-2 py-0.5 text-[10px] font-black tracking-wider uppercase ${
                                                            inv.agent_id
                                                                ? 'border border-indigo-100 bg-indigo-50 text-indigo-800'
                                                                : 'border border-slate-200 bg-slate-100 text-slate-600'
                                                        }`}
                                                    >
                                                        {agentName}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`rounded px-2 py-0.5 text-[10px] font-black tracking-wider uppercase ${
                                                            inv.package_id
                                                                ? 'border border-emerald-100 bg-emerald-50 text-emerald-800'
                                                                : 'border border-amber-100 bg-amber-50 text-amber-800'
                                                        }`}
                                                    >
                                                        {packageName}
                                                    </span>
                                                </td>
                                                <td
                                                    className="block max-w-xs truncate px-5 py-4 font-bold text-slate-800"
                                                    title={inv.order_text || ''}
                                                >
                                                    {inv.order_text || '-'}
                                                </td>
                                                <td className="px-5 py-4 text-right font-extrabold text-slate-900">
                                                    {formatCurrency(
                                                        inv.grand_total,
                                                    )}
                                                </td>
                                                <td
                                                    className="max-w-xs truncate px-5 py-4 text-slate-500"
                                                    title={inv.keterangan || ''}
                                                >
                                                    {inv.keterangan || '-'}
                                                </td>
                                                <td className="px-5 py-4 text-center">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            setSelectedInvoice(
                                                                inv,
                                                            )
                                                        }
                                                        className="mx-auto flex items-center gap-1 rounded-lg border-emerald-200 bg-emerald-50 px-2.5 py-1.5 font-extrabold text-emerald-700 hover:bg-emerald-100"
                                                    >
                                                        <Eye size={13} /> Detail
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {invoices.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="p-12 text-center text-sm font-extrabold text-slate-500"
                                            >
                                                Tidak ada data invoice tagihan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Pagination links={invoices.links} />
                </div>
            )}

            {/* IMPORT MODAL */}
            {showImportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
                    <div className="flex w-full max-w-md animate-in flex-col overflow-hidden rounded-3xl bg-white p-0 shadow-2xl duration-200 zoom-in-95">
                        <div className="relative flex items-center justify-between bg-emerald-900 p-6 text-white">
                            <div>
                                <h2 className="flex items-center gap-2 text-xl font-bold">
                                    <Upload
                                        size={20}
                                        className="text-amber-450"
                                    />
                                    Import Tagihan
                                </h2>
                                <p className="text-emerald-250 mt-0.5 text-[11px] font-semibold">
                                    Pilih file spreadsheet Excel/CSV
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowImportModal(false);
                                    resetImport();
                                }}
                                className="text-emerald-300 transition-colors hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleImportSubmit}
                            className="space-y-4 p-6"
                        >
                            {errors.message && (
                                <div className="text-red-650 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold">
                                    {errors.message}
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-700">
                                    Pilih File *
                                </Label>
                                <Input
                                    type="file"
                                    required
                                    accept=".xlsx,.xls,.csv"
                                    onChange={(e) =>
                                        setImportData(
                                            'file',
                                            e.target.files?.[0] || null,
                                        )
                                    }
                                    className="cursor-pointer border-slate-300 bg-slate-50 font-bold focus:ring-emerald-500"
                                />
                                <p className="mt-1 text-[10px] font-semibold text-slate-400">
                                    Format file Excel harus memiliki header
                                    seperti{' '}
                                    <code className="rounded bg-slate-100 px-1 py-0.5 font-extrabold text-rose-600">
                                        Nama Agen
                                    </code>
                                    ,{' '}
                                    <code className="rounded bg-slate-100 px-1 py-0.5 font-extrabold text-rose-600">
                                        Tanggal Keberangkatan
                                    </code>
                                    ,{' '}
                                    <code className="rounded bg-slate-100 px-1 py-0.5 font-extrabold text-rose-600">
                                        GRAND_TOTAL
                                    </code>
                                    .
                                </p>
                            </div>

                            <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                                <Info
                                    className="mt-0.5 shrink-0 text-amber-600"
                                    size={16}
                                />
                                <div className="text-[10px] leading-normal font-bold text-amber-800">
                                    PENTING: Mengimpor tagihan baru akan
                                    menghapus / menimpa semua data tagihan yang
                                    diimpor sebelumnya. Pastikan file excel
                                    berisi seluruh data tagihan terbaru.
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowImportModal(false);
                                        resetImport();
                                    }}
                                    className="rounded-xl font-bold"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={importing}
                                    className="rounded-xl bg-emerald-600 font-extrabold text-white shadow-md hover:bg-emerald-700"
                                >
                                    {importing
                                        ? 'Mengimpor...'
                                        : 'Mulai Import'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DETAILED RECEIPT MODAL */}
            {selectedInvoice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
                    <div className="flex max-h-[90vh] w-full max-w-lg animate-in flex-col overflow-hidden rounded-3xl bg-white p-0 shadow-2xl duration-200 zoom-in-95">
                        <div className="relative flex items-center justify-between bg-slate-900 p-6 text-white">
                            <div>
                                <h2 className="text-lg font-bold">
                                    Rincian Invoice
                                </h2>
                                <p className="mt-0.5 text-[11px] font-semibold text-slate-400">
                                    No: {selectedInvoice.invoice_code || '-'}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedInvoice(null)}
                                className="text-slate-400 transition-colors hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 space-y-6 overflow-y-auto p-6 font-sans">
                            {/* Invoice Meta */}
                            <div className="border-slate-150 grid grid-cols-3 gap-4 border-b pb-4 text-xs font-semibold text-slate-500">
                                <div>
                                    <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase">
                                        Agen Asal
                                    </span>
                                    <p className="mt-1 font-bold text-slate-800">
                                        {selectedInvoice.agent?.name ||
                                            selectedInvoice.raw_agent_name ||
                                            'Pusat / Mandiri'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase">
                                        Paket / Keberangkatan
                                    </span>
                                    <p className="mt-1 font-bold text-slate-800">
                                        {selectedInvoice.package
                                            ? `${selectedInvoice.package.name} (${selectedInvoice.package.code})`
                                            : selectedInvoice.raw_departure_date_package ||
                                              '-'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase">
                                        Keterangan Order
                                    </span>
                                    <p className="mt-1 font-bold text-slate-800">
                                        {selectedInvoice.order_text || '-'}
                                    </p>
                                </div>
                            </div>

                            {/* Items Breakdown Table */}
                            {selectedInvoice.items &&
                            selectedInvoice.items.length > 0 ? (
                                <div className="space-y-3">
                                    <span className="block text-[10px] font-black tracking-wider text-slate-400 uppercase">
                                        Rincian Item
                                    </span>
                                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                                        <table className="w-full min-w-[500px] text-left text-xs font-semibold text-slate-700">
                                            <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-black text-slate-400 uppercase">
                                                <tr>
                                                    <th className="px-4 py-2">
                                                        Item Deskripsi
                                                    </th>
                                                    <th className="w-16 px-4 py-2 text-center">
                                                        Vol
                                                    </th>
                                                    <th className="w-28 px-4 py-2 text-right">
                                                        Harga (Rp)
                                                    </th>
                                                    <th className="w-28 px-4 py-2 text-right">
                                                        Total (Rp)
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-slate-150 divide-y">
                                                {selectedInvoice.items.map(
                                                    (it, idx) => (
                                                        <tr key={idx}>
                                                            <td className="px-4 py-2.5 font-bold text-slate-800">
                                                                {it.desc}
                                                            </td>
                                                            <td className="px-4 py-2.5 text-center">
                                                                {it.vol}
                                                            </td>
                                                            <td className="px-4 py-2.5 text-right">
                                                                {formatCurrency(
                                                                    it.harga,
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-2.5 text-right font-extrabold text-slate-900">
                                                                {formatCurrency(
                                                                    it.sub,
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ),
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <div className="border-slate-150 rounded-2xl border bg-slate-50 p-6 text-center">
                                    <span className="text-xs font-bold text-slate-400 italic">
                                        Tidak ada rincian breakdown item.
                                    </span>
                                </div>
                            )}

                            {/* Discounts breakdown */}
                            {selectedInvoice.discounts &&
                                selectedInvoice.discounts.length > 0 && (
                                    <div className="space-y-2">
                                        <span className="block text-[10px] font-black tracking-wider text-slate-400 uppercase">
                                            Diskon / Potongan
                                        </span>
                                        <div className="space-y-1.5 rounded-xl border border-rose-100 bg-rose-50/50 p-3 text-xs">
                                            {selectedInvoice.discounts.map(
                                                (dc, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex justify-between font-bold text-rose-800"
                                                    >
                                                        <span>{dc.desc}</span>
                                                        <span>
                                                            -
                                                            {formatCurrency(
                                                                dc.nominal,
                                                            )}
                                                        </span>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}

                            {/* Total and Notes */}
                            <div className="border-slate-150 space-y-4 border-t pt-4">
                                <div className="flex items-center justify-between rounded-2xl bg-slate-900 p-4 text-white">
                                    <span className="text-sm font-black tracking-wider uppercase">
                                        Grand Total
                                    </span>
                                    <span className="text-xl font-black">
                                        {formatCurrency(
                                            selectedInvoice.grand_total,
                                        )}
                                    </span>
                                </div>

                                {selectedInvoice.keterangan && (
                                    <div className="border-slate-150 rounded-2xl border bg-slate-50 p-4 text-xs">
                                        <span className="mb-1 block text-[10px] font-black tracking-wider text-slate-400 uppercase">
                                            Catatan Tambahan
                                        </span>
                                        <p className="leading-relaxed font-semibold text-slate-600">
                                            {selectedInvoice.keterangan}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end border-t border-slate-100 p-6">
                            <Button
                                onClick={() => setSelectedInvoice(null)}
                                className="rounded-xl bg-slate-900 font-extrabold text-white hover:bg-slate-800"
                            >
                                Tutup
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

Invoices.layout = {
    breadcrumbs: [{ title: 'Tagihan Keagenan', href: '/admin/invoices' }],
};
