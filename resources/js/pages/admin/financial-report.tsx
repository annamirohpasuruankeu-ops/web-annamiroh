import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    TrendingUp,
    DollarSign,
    Briefcase,
    Download,
    Search,
    FileText,
    CheckCircle2,
    Clock,
    AlertCircle,
    TrendingDown,
    Wallet,
    Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Pagination from '@/components/pagination';
import { useState } from 'react';

export default function FinancialReport({
    bookings,
    allPackages,
    stats,
    packageSummary,
    filters,
}: PageProps<{
    bookings: any;
    allPackages: any[];
    stats: {
        total_income: number;
        total_potential: number;
        total_receivables: number;
        status_lunas_count: number;
        status_dp_count: number;
        status_pending_count: number;
        total_bookings_count: number;
    };
    packageSummary: any[];
    filters?: any;
}>) {
    const [search, setSearch] = useState(filters?.search || '');
    const [packageId, setPackageId] = useState(filters?.package_id || '');
    const [paymentStatus, setPaymentStatus] = useState(
        filters?.payment_status || '',
    );
    const [activeTab, setActiveTab] = useState<'packages' | 'transactions'>(
        'packages',
    );

    const handleSearch = () => {
        router.get(
            '/admin/reports/financial',
            {
                search,
                package_id: packageId,
                payment_status: paymentStatus,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleClearFilters = () => {
        setSearch('');
        setPackageId('');
        setPaymentStatus('');
        router.get('/admin/reports/financial', {}, { replace: true });
    };

    const handleExportPackages = () => {
        const table = document.querySelector('table');
        if (!table) return;

        const html = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
                <!--[if gte mso 9]>
                <xml>
                    <x:ExcelWorkbook>
                        <x:ExcelWorksheets>
                            <x:ExcelWorksheet>
                                <x:Name>Ringkasan Paket</x:Name>
                                <x:WorksheetOptions>
                                    <x:DisplayGridlines/>
                                </x:WorksheetOptions>
                            </x:ExcelWorksheet>
                        </x:ExcelWorksheets>
                    </x:ExcelWorkbook>
                </xml>
                <![endif]-->
                <style>
                    table { border-collapse: collapse; }
                    th, td { border: 1px solid #000; padding: 8px; font-family: sans-serif; }
                    th { background-color: #10b981; color: #ffffff; font-weight: bold; }
                </style>
            </head>
            <body>
                <h2>LAPORAN KEUANGAN PER PAKET - ANNAMIRAH TRAVEL</h2>
                <p>Tanggal Unduh: ${new Date().toLocaleString('id-ID')}</p>
                <br/>
                ${table.outerHTML}
            </body>
            </html>
        `;

        const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `laporan_keuangan_paket_${new Date().toISOString().slice(0, 10)}.xls`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportTransactions = () => {
        const params = new URLSearchParams({
            search,
            package_id: packageId,
            payment_status: paymentStatus,
        });
        window.location.href = `/admin/reports/financial/export?${params.toString()}`;
    };

    return (
        <div className="mx-auto min-h-screen w-full max-w-7xl bg-slate-50 p-6 font-sans md:p-8 print:bg-white print:p-0">
            <Head title="Laporan Keuangan" />

            {/* Print Header (Visible only when printing) */}
            <div className="mb-8 hidden border-b-2 border-slate-800 pb-4 text-center print:block">
                <h1 className="text-3xl font-extrabold text-slate-900">
                    ANNAMIRAH TRAVEL
                </h1>
                <p className="mt-1 text-sm font-medium text-slate-500">
                    Laporan Keuangan & Realisasi Penjualan Paket Keberangkatan
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                    Dicetak pada:{' '}
                    {new Date().toLocaleString('id-ID', {
                        dateStyle: 'long',
                        timeStyle: 'short',
                    })}
                </p>
            </div>

            {/* Page Header (Hidden when printing) */}
            <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center print:hidden">
                <div>
                    <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight text-slate-800">
                        <TrendingUp className="text-emerald-600" size={32} />
                        Laporan Keuangan
                    </h1>
                    <p className="mt-2 text-sm font-medium text-slate-500">
                        Pantau omset, pembayaran masuk, sisa piutang, dan
                        kinerja finansial paket.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        onClick={handleExportPackages}
                        className="flex items-center gap-2 rounded-xl bg-emerald-600 font-bold text-white shadow-md hover:bg-emerald-700"
                    >
                        <Download size={18} />
                        Export Excel Paket
                    </Button>
                    <Button
                        onClick={handleExportTransactions}
                        className="flex items-center gap-2 rounded-xl bg-amber-500 font-bold text-white shadow-md hover:bg-amber-600"
                    >
                        <Download size={18} />
                        Export Excel Transaksi
                    </Button>
                </div>
            </div>

            {/* Cards Overview Stats */}
            <div className="mb-8 grid gap-6 md:grid-cols-3">
                {/* Uang Masuk */}
                <div className="relative flex min-h-[140px] flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm print:border-slate-300">
                    <div className="absolute top-0 right-0 h-24 w-24 translate-x-1/3 -translate-y-1/3 rounded-full bg-emerald-500 opacity-10 blur-3xl"></div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                            Total Uang Masuk
                        </span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                            <Wallet size={20} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="text-2xl font-extrabold text-slate-800">
                            Rp {stats.total_income.toLocaleString('id-ID')}
                        </span>
                        <span className="mt-1 block text-[10px] font-medium text-slate-400">
                            Total pembayaran tunai yang telah diterima
                        </span>
                    </div>
                </div>

                {/* Sisa Piutang */}
                <div className="relative flex min-h-[140px] flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm print:border-slate-300">
                    <div className="absolute top-0 right-0 h-24 w-24 translate-x-1/3 -translate-y-1/3 rounded-full bg-amber-500 opacity-10 blur-3xl"></div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                            Sisa Piutang (Kekurangan)
                        </span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                            <TrendingDown size={20} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="text-2xl font-extrabold text-amber-600">
                            Rp {stats.total_receivables.toLocaleString('id-ID')}
                        </span>
                        <span className="mt-1 block text-[10px] font-medium text-slate-400">
                            Total kekurangan pembayaran dari jamaah terdaftar
                        </span>
                    </div>
                </div>

                {/* Potensi Omset */}
                <div className="relative flex min-h-[140px] flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm print:border-slate-300">
                    <div className="absolute top-0 right-0 h-24 w-24 translate-x-1/3 -translate-y-1/3 rounded-full bg-blue-500 opacity-10 blur-3xl"></div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                            Potensi Pendapatan
                        </span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="text-2xl font-extrabold text-slate-800">
                            Rp {stats.total_potential.toLocaleString('id-ID')}
                        </span>
                        <span className="mt-1 block text-[10px] font-medium text-slate-400">
                            Total estimasi omset kotor dari seluruh booking
                        </span>
                    </div>
                </div>
            </div>

            {/* Quick Status Count */}
            <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border border-slate-200/60 bg-slate-100/80 p-4 print:border-slate-300 print:bg-slate-50">
                <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                    Status Pemesanan:
                </span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <FileText size={14} className="text-slate-400" /> Total
                    Booking:{' '}
                    <span className="font-bold">
                        {stats.total_bookings_count}
                    </span>
                </span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 size={14} className="text-emerald-500" />{' '}
                    Lunas:{' '}
                    <span className="font-bold">
                        {stats.status_lunas_count}
                    </span>
                </span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                    <Clock size={14} className="text-amber-500" /> Down Payment
                    (DP):{' '}
                    <span className="font-bold">{stats.status_dp_count}</span>
                </span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-700">
                    <AlertCircle size={14} className="text-rose-500" /> Pending:{' '}
                    <span className="font-bold">
                        {stats.status_pending_count}
                    </span>
                </span>
            </div>

            {/* Tab Navigation (Hidden when printing) */}
            <div className="mb-6 flex border-b border-slate-200 print:hidden">
                <button
                    onClick={() => setActiveTab('packages')}
                    className={`cursor-pointer border-b-2 px-6 py-3 text-sm font-bold transition-all ${activeTab === 'packages' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                    Ringkasan Finansial Paket
                </button>
                <button
                    onClick={() => setActiveTab('transactions')}
                    className={`cursor-pointer border-b-2 px-6 py-3 text-sm font-bold transition-all ${activeTab === 'transactions' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                    Arus Kas / Transaksi Jamaah
                </button>
            </div>

            {/* Print Layout: Force both to print sequentially */}
            <div className="space-y-12">
                {/* 1. Ringkasan Finansial Paket */}
                <div
                    className={`${activeTab === 'packages' ? 'block' : 'hidden'} print:block`}
                >
                    <h2 className="mb-4 flex hidden items-center gap-2 text-xl font-bold text-slate-800 print:block">
                        <Briefcase size={20} className="text-slate-600" /> 1.
                        Ringkasan Finansial per Paket Keberangkatan
                    </h2>
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print:border-slate-300">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 print:bg-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-bold tracking-wider uppercase">
                                            Nama Paket
                                        </th>
                                        <th className="px-6 py-4 text-[10px] font-bold tracking-wider uppercase">
                                            Harga per Pax
                                        </th>
                                        <th className="px-6 py-4 text-center text-[10px] font-bold tracking-wider uppercase">
                                            Seat Terjual
                                        </th>
                                        <th className="px-6 py-4 text-right text-[10px] font-bold tracking-wider uppercase">
                                            Target Omset
                                        </th>
                                        <th className="px-6 py-4 text-right text-[10px] font-bold tracking-wider uppercase">
                                            Uang Masuk
                                        </th>
                                        <th className="px-6 py-4 text-right text-[10px] font-bold tracking-wider uppercase">
                                            Piutang
                                        </th>
                                        <th className="px-6 py-4 text-center text-[10px] font-bold tracking-wider uppercase print:hidden">
                                            Realisasi (%)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {packageSummary.map((pkg) => {
                                        const percent =
                                            pkg.target_revenue > 0
                                                ? Math.min(
                                                      100,
                                                      Math.round(
                                                          (pkg.real_revenue /
                                                              pkg.target_revenue) *
                                                              100,
                                                      ),
                                                  )
                                                : 0;
                                        return (
                                            <tr
                                                key={pkg.id}
                                                className="transition-colors hover:bg-slate-50/50"
                                            >
                                                <td className="px-6 py-4 font-bold text-slate-800">
                                                    <div className="text-sm">
                                                        {pkg.name}
                                                    </div>
                                                    <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                                                        <Calendar size={10} />{' '}
                                                        Keberangkatan:{' '}
                                                        {pkg.departure_date
                                                            ? new Date(
                                                                  pkg.departure_date,
                                                              ).toLocaleDateString(
                                                                  'id-ID',
                                                                  {
                                                                      day: 'numeric',
                                                                      month: 'short',
                                                                      year: 'numeric',
                                                                  },
                                                              )
                                                            : '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-slate-700">
                                                    Rp{' '}
                                                    {Number(
                                                        pkg.price,
                                                    ).toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 text-center font-bold text-slate-800">
                                                    {pkg.bookings_count} Seat
                                                </td>
                                                <td className="px-6 py-4 text-right font-semibold text-slate-700">
                                                    Rp{' '}
                                                    {pkg.target_revenue.toLocaleString(
                                                        'id-ID',
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right font-extrabold text-emerald-700">
                                                    Rp{' '}
                                                    {pkg.real_revenue.toLocaleString(
                                                        'id-ID',
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold text-amber-600">
                                                    Rp{' '}
                                                    {pkg.receivables.toLocaleString(
                                                        'id-ID',
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 print:hidden">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                                                            <div
                                                                className="h-1.5 rounded-full bg-emerald-600"
                                                                style={{
                                                                    width: `${percent}%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-xs font-extrabold text-emerald-800">
                                                            {percent}%
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {packageSummary.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="px-6 py-8 text-center text-slate-400"
                                            >
                                                Belum ada data paket
                                                keberangkatan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* 2. Arus Kas / Transaksi Jamaah */}
                <div
                    className={`${activeTab === 'transactions' ? 'block' : 'hidden'} print:block`}
                >
                    <h2 className="mb-4 flex hidden items-center gap-2 text-xl font-bold text-slate-800 print:block">
                        <Wallet size={20} className="text-slate-600" /> 2.
                        Rincian Arus Kas / Transaksi Pembayaran Jamaah
                    </h2>

                    {/* Filter Bar (Hidden when printing) */}
                    <div className="mb-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm print:hidden">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <Label className="text-xs font-bold text-slate-500 uppercase">
                                    Cari Nama Jamaah
                                </Label>
                                <div className="relative mt-1">
                                    <Search
                                        className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                                        size={16}
                                    />
                                    <Input
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Ketik nama jamaah..."
                                        className="h-10 rounded-xl border-slate-200 pl-9 text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs font-bold text-slate-500 uppercase">
                                    Filter Paket Keberangkatan
                                </Label>
                                <select
                                    value={packageId}
                                    onChange={(e) =>
                                        setPackageId(e.target.value)
                                    }
                                    className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                >
                                    <option value="">Semua Paket</option>
                                    {allPackages.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <Label className="text-xs font-bold text-slate-500 uppercase">
                                    Filter Status Bayar
                                </Label>
                                <select
                                    value={paymentStatus}
                                    onChange={(e) =>
                                        setPaymentStatus(e.target.value)
                                    }
                                    className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="lunas">Lunas</option>
                                    <option value="dp">
                                        DP (Down Payment)
                                    </option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 border-t border-slate-100 pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleClearFilters}
                                className="h-9 rounded-xl border-slate-200 font-bold text-slate-600"
                            >
                                Reset Filter
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleSearch}
                                className="h-9 rounded-xl bg-emerald-600 font-bold text-white hover:bg-emerald-700"
                            >
                                Terapkan Filter
                            </Button>
                        </div>
                    </div>

                    {/* Transactions Table */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print:border-slate-300">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 print:bg-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-bold tracking-wider uppercase">
                                            Jamaah / Akun
                                        </th>
                                        <th className="px-6 py-4 text-[10px] font-bold tracking-wider uppercase">
                                            Paket Tujuan
                                        </th>
                                        <th className="px-6 py-4 text-right text-[10px] font-bold tracking-wider uppercase">
                                            Harga Paket
                                        </th>
                                        <th className="px-6 py-4 text-right text-[10px] font-bold tracking-wider uppercase">
                                            Uang Masuk
                                        </th>
                                        <th className="px-6 py-4 text-right text-[10px] font-bold tracking-wider uppercase">
                                            Sisa Piutang
                                        </th>
                                        <th className="px-6 py-4 text-center text-[10px] font-bold tracking-wider uppercase">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {bookings.data.map((b: any) => {
                                        const totalPaid = Number(
                                            b.amount_paid || 0,
                                        );
                                        const pkgPrice = Number(
                                            b.package?.price || 0,
                                        );
                                        const due = Math.max(
                                            0,
                                            pkgPrice - totalPaid,
                                        );

                                        return (
                                            <tr
                                                key={b.id}
                                                className="transition-colors hover:bg-slate-50/50"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-extrabold text-slate-800">
                                                        {b.jamaah_member
                                                            ?.name ||
                                                            b.user?.name}
                                                    </div>
                                                    <div className="mt-1 text-[10px] font-semibold text-slate-400">
                                                        {b.jamaah_member
                                                            ? `Hubungan: ${b.jamaah_member.hubungan_keluarga}`
                                                            : `Email: ${b.user?.email}`}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-slate-700">
                                                    {b.package?.name}
                                                </td>
                                                <td className="px-6 py-4 text-right font-semibold text-slate-700">
                                                    Rp{' '}
                                                    {pkgPrice.toLocaleString(
                                                        'id-ID',
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold text-emerald-700">
                                                    Rp{' '}
                                                    {totalPaid.toLocaleString(
                                                        'id-ID',
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold text-amber-600">
                                                    Rp{' '}
                                                    {due.toLocaleString(
                                                        'id-ID',
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span
                                                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-extrabold tracking-wider uppercase ${
                                                            b.status_pembayaran ===
                                                            'lunas'
                                                                ? 'border border-emerald-200 bg-emerald-100 text-emerald-800'
                                                                : b.status_pembayaran ===
                                                                    'dp'
                                                                  ? 'border border-amber-200 bg-amber-100 text-amber-800'
                                                                  : 'border border-slate-200 bg-slate-100 text-slate-700'
                                                        }`}
                                                    >
                                                        {b.status_pembayaran}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {bookings.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-6 py-8 text-center text-slate-400"
                                            >
                                                Belum ada transaksi pembayaran.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination (Hidden when printing) */}
                    <div className="mt-4 print:hidden">
                        <Pagination links={bookings.links} />
                    </div>
                </div>
            </div>

            {/* Print CSS Override */}
            <style>{`
                @media print {
                    body {
                        color: #000 !important;
                        background: #fff !important;
                    }
                    /* Hide Sidebar and Shell layout items */
                    aside, [collapsible="icon"], header, .print\\:hidden {
                        display: none !important;
                    }
                    /* Reset container dimensions for standard A4 printing */
                    main, .max-w-7xl, .p-6 {
                        padding: 0 !important;
                        margin: 0 !important;
                        max-width: 100% !important;
                        width: 100% !important;
                    }
                    /* Ensure tables look neat on page borders */
                    table {
                        border: 1px solid #cbd5e1 !important;
                    }
                    thead {
                        border-bottom: 2px solid #94a3b8 !important;
                    }
                    th, td {
                        padding: 10px 14px !important;
                        border-bottom: 1px solid #e2e8f0 !important;
                    }
                }
            `}</style>
        </div>
    );
}

FinancialReport.layout = {
    breadcrumbs: [
        { title: 'Laporan Keuangan', href: '/admin/reports/financial' },
    ],
};
