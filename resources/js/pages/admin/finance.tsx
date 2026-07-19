import { Head, useForm, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    Search,
    Plus,
    Upload,
    Edit3,
    Trash2,
    ExternalLink,
    TrendingUp,
    TrendingDown,
    DollarSign,
    X,
    FileText,
    AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import Pagination from '@/components/pagination';

interface FinanceRecordItem {
    id: number;
    agent_id: number | null;
    package_id: number | null;
    transaction_date: string;
    category_bank: string;
    amount: number;
    type: 'PEMASUKAN' | 'PENGELUARAN';
    proof_link: string | null;
    raw_agent_name: string | null;
    raw_departure_date_package: string | null;
    agent?: { id: number; name: string };
    package?: {
        id: number;
        name: string;
        code: string | null;
        departure_date: string;
    };
    created_at: string;
}

export default function Finance({
    records,
    agents,
    packages,
    filterAgents,
    filterPackages,
    banks,
    stats,
    filters,
    errors,
}: PageProps<{
    records: { data: FinanceRecordItem[]; links: any[] };
    agents: any[];
    packages: any[];
    filterAgents: any[];
    filterPackages: any[];
    banks: string[];
    stats: {
        total_income: number;
        total_expense: number;
        balance: number;
        filtered_income: number;
        filtered_expense: number;
        filtered_net: number;
    };
    filters: any;
}>) {
    const [search, setSearch] = useState(filters?.search || '');
    const [typeFilter, setTypeFilter] = useState(filters?.type || '');
    const [agentFilter, setAgentFilter] = useState(filters?.agent_id || '');
    const [packageFilter, setPackageFilter] = useState(
        filters?.package_id || '',
    );
    const [bankFilter, setBankFilter] = useState(filters?.bank || '');
    const [startDate, setStartDate] = useState(filters?.start_date || '');
    const [endDate, setEndDate] = useState(filters?.end_date || '');

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [editingRecord, setEditingRecord] =
        useState<FinanceRecordItem | null>(null);

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        reset,
    } = useForm({
        agent_id: '',
        package_id: '',
        transaction_date: new Date().toISOString().split('T')[0],
        category_bank: 'CASH',
        amount: '',
        type: 'PEMASUKAN',
        proof_link: '',
    });

    const {
        data: importData,
        setData: setImportData,
        post: postImport,
        processing: importing,
        reset: resetImport,
    } = useForm({
        file: null as File | null,
    });

    const handleFilterChange = (key: string, value: string) => {
        const nextFilters = {
            search,
            type: typeFilter,
            agent_id: agentFilter,
            package_id: packageFilter,
            bank: bankFilter,
            start_date: startDate,
            end_date: endDate,
            [key]: value,
        };
        router.get('/admin/finance', nextFilters, {
            preserveState: true,
            replace: true,
        });
    };

    const applyFilters = () => {
        router.get(
            '/admin/finance',
            {
                search,
                type: typeFilter,
                agent_id: agentFilter,
                package_id: packageFilter,
                bank: bankFilter,
                start_date: startDate,
                end_date: endDate,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleResetFilter = () => {
        setSearch('');
        setTypeFilter('');
        setAgentFilter('');
        setPackageFilter('');
        setBankFilter('');
        setStartDate('');
        setEndDate('');
        router.get('/admin/finance', {}, { replace: true });
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            applyFilters();
        }
    };

    const openCreate = () => {
        reset();
        setData({
            agent_id: '',
            package_id: '',
            transaction_date: new Date().toISOString().split('T')[0],
            category_bank: 'CASH',
            amount: '',
            type: 'PEMASUKAN',
            proof_link: '',
        });
        setShowCreateModal(true);
    };

    const openEdit = (record: FinanceRecordItem) => {
        setEditingRecord(record);
        setData({
            agent_id: record.agent_id?.toString() || '',
            package_id: record.package_id?.toString() || '',
            transaction_date: record.transaction_date,
            category_bank: record.category_bank,
            amount: record.amount.toString(),
            type: record.type,
            proof_link: record.proof_link || '',
        });
    };

    const openImport = () => {
        resetImport();
        setShowImportModal(true);
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/finance', {
            onSuccess: () => {
                setShowCreateModal(false);
                reset();
            },
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRecord) return;
        put(`/admin/finance/${editingRecord.id}`, {
            onSuccess: () => {
                setEditingRecord(null);
                reset();
            },
        });
    };

    const submitImport = (e: React.FormEvent) => {
        e.preventDefault();
        if (!importData.file) return;
        postImport('/admin/finance/import', {
            forceFormData: true,
            onSuccess: () => {
                setShowImportModal(false);
                resetImport();
            },
        });
    };

    const handleDelete = (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus transaksi ini?'))
            return;
        destroy(`/admin/finance/${id}`, {
            preserveScroll: true,
        });
    };

    return (
        <div className="mx-auto min-h-screen w-full max-w-7xl bg-slate-50 p-6 font-sans md:p-8">
            <Head title="Manajemen Keuangan" />

            {/* Header Banner */}
            <div className="relative mb-8 flex flex-col items-start justify-between overflow-hidden rounded-[2rem] border border-emerald-800 bg-emerald-900 p-8 text-white shadow-2xl shadow-emerald-900/10 md:flex-row md:items-center md:p-10">
                <div className="absolute top-0 right-0 h-96 w-96 translate-x-1/3 -translate-y-1/2 rounded-full bg-amber-500 opacity-20 blur-3xl"></div>
                <div className="relative z-10">
                    <span className="mb-4 inline-block rounded-full bg-amber-400 px-3 py-1 text-[10px] font-bold tracking-widest text-emerald-950 uppercase shadow-sm shadow-amber-400/20">
                        Admin Keuangan
                    </span>
                    <h2 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight md:text-4xl">
                        <TrendingUp className="text-amber-400" size={36} />
                        Manajemen Keuangan
                    </h2>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-emerald-100/80 md:text-base">
                        Pantau pemasukan dan pengeluaran agen secara terpusat,
                        unggah bukti transaksi, dan import data keuangan dari
                        file Excel/CSV.
                    </p>
                </div>
                <div className="relative z-10 mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row md:mt-0">
                    <Button
                        onClick={openImport}
                        className="gap-2 rounded-xl bg-amber-500 px-5 py-6 font-bold text-amber-950 shadow-lg shadow-amber-500/10 transition-all hover:scale-[1.02] hover:bg-amber-600"
                    >
                        <Upload size={18} /> IMPORT EXCEL / CSV
                    </Button>
                    <Button
                        onClick={openCreate}
                        className="gap-2 rounded-xl border border-emerald-500/30 bg-emerald-600 px-5 py-6 font-bold text-white shadow-lg shadow-emerald-600/10 transition-all hover:scale-[1.02] hover:bg-emerald-700"
                    >
                        <Plus size={18} /> TAMBAH TRANSAKSI
                    </Button>
                </div>
            </div>

            {/* Error Message */}
            {errors?.message && (
                <div className="mb-8 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600 shadow-sm">
                    <AlertTriangle className="text-red-500" size={20} />
                    <span>{errors.message}</span>
                </div>
            )}

            {/* Summary Statistics Cards */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Total Income */}
                <div className="group relative flex items-center gap-5 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600 transition-transform group-hover:scale-110">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <span className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                            TOTAL PEMASUKAN
                        </span>
                        <span className="text-2xl font-black tracking-tight text-emerald-600">
                            Rp {stats.total_income.toLocaleString('id-ID')}
                        </span>
                    </div>
                </div>

                {/* Total Expense */}
                <div className="group relative flex items-center gap-5 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-100 bg-rose-50 text-rose-600 transition-transform group-hover:scale-110">
                        <TrendingDown size={24} />
                    </div>
                    <div>
                        <span className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                            TOTAL PENGELUARAN
                        </span>
                        <span className="text-2xl font-black tracking-tight text-rose-600">
                            Rp {stats.total_expense.toLocaleString('id-ID')}
                        </span>
                    </div>
                </div>

                {/* Balance */}
                <div className="group relative flex items-center gap-5 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                    <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 ${stats.balance >= 0 ? 'border border-amber-100 bg-amber-50 text-amber-600' : 'border border-red-100 bg-red-50 text-red-600'}`}
                    >
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <span className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                            SALDO AKHIR (NET CASHFLOW)
                        </span>
                        <span
                            className={`text-2xl font-black tracking-tight ${stats.balance >= 0 ? 'text-amber-600' : 'text-red-600'}`}
                        >
                            Rp {stats.balance.toLocaleString('id-ID')}
                        </span>
                    </div>
                </div>
            </div>

            {/* Filter Panel */}
            <div className="mb-6 space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-slate-800">
                        Filter Pencarian
                    </h3>
                    <button
                        onClick={handleResetFilter}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                    >
                        Reset Filter
                    </button>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                    {/* Search Input */}
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-slate-500">
                            Cari Kata Kunci
                        </Label>
                        <div className="relative">
                            <Search
                                className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                                size={16}
                            />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                placeholder="Nama, Bank, Kategori..."
                                className="h-10 border-slate-200 pl-9 text-xs"
                            />
                        </div>
                    </div>

                    {/* Jenis Transaksi */}
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-slate-500">
                            Jenis Transaksi
                        </Label>
                        <select
                            value={typeFilter}
                            onChange={(e) => {
                                setTypeFilter(e.target.value);
                                handleFilterChange('type', e.target.value);
                            }}
                            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 focus:border-emerald-500 focus:ring-emerald-500"
                        >
                            <option value="">Semua Jenis</option>
                            <option value="PEMASUKAN">PEMASUKAN</option>
                            <option value="PENGELUARAN">PENGELUARAN</option>
                        </select>
                    </div>

                    {/* Filter Agen */}
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-slate-500">
                            Filter Agen
                        </Label>
                        <select
                            value={agentFilter}
                            onChange={(e) => {
                                setAgentFilter(e.target.value);
                                handleFilterChange('agent_id', e.target.value);
                            }}
                            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 focus:border-emerald-500 focus:ring-emerald-500"
                        >
                            <option value="">Semua Agen</option>
                            {filterAgents.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filter Paket */}
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-slate-500">
                            Filter Paket Keberangkatan
                        </Label>
                        <select
                            value={packageFilter}
                            onChange={(e) => {
                                setPackageFilter(e.target.value);
                                handleFilterChange(
                                    'package_id',
                                    e.target.value,
                                );
                            }}
                            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 focus:border-emerald-500 focus:ring-emerald-500"
                        >
                            <option value="">Semua Paket</option>
                            {filterPackages.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name} {p.code ? `(${p.code})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-3">
                    {/* Filter Bank */}
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-slate-500">
                            Kategori/Bank
                        </Label>
                        <select
                            value={bankFilter}
                            onChange={(e) => {
                                setBankFilter(e.target.value);
                                handleFilterChange('bank', e.target.value);
                            }}
                            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 focus:border-emerald-500 focus:ring-emerald-500"
                        >
                            <option value="">Semua Kategori/Bank</option>
                            {banks.map((b) => (
                                <option key={b} value={b}>
                                    {b}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Start Date */}
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-slate-500">
                            Tanggal Mulai
                        </Label>
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="h-10 border-slate-200 text-xs"
                        />
                    </div>

                    {/* End Date */}
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-slate-500">
                            Tanggal Selesai
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="h-10 flex-1 border-slate-200 text-xs"
                            />
                            <Button
                                onClick={applyFilters}
                                className="h-10 rounded-xl bg-emerald-600 px-4 font-bold text-white hover:bg-emerald-700"
                            >
                                Terapkan
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Financial Records Table */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold tracking-wider uppercase">
                                    Tanggal Transaksi
                                </th>
                                <th className="px-6 py-4 text-[10px] font-bold tracking-wider uppercase">
                                    Jenis
                                </th>
                                <th className="px-6 py-4 text-[10px] font-bold tracking-wider uppercase">
                                    Nominal
                                </th>
                                <th className="px-6 py-4 text-[10px] font-bold tracking-wider uppercase">
                                    Kategori/Bank
                                </th>
                                <th className="px-6 py-4 text-[10px] font-bold tracking-wider uppercase">
                                    Agen
                                </th>
                                <th className="px-6 py-4 text-[10px] font-bold tracking-wider uppercase">
                                    Paket
                                </th>
                                <th className="px-6 py-4 text-center text-[10px] font-bold tracking-wider uppercase">
                                    Bukti
                                </th>
                                <th className="px-6 py-4 text-right text-[10px] font-bold tracking-wider uppercase">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {records.data.map((record) => {
                                return (
                                    <tr
                                        key={record.id}
                                        className="transition-colors hover:bg-slate-50/50"
                                    >
                                        {/* Transaction Date */}
                                        <td className="px-6 py-4 font-semibold text-slate-700">
                                            {new Date(
                                                record.transaction_date,
                                            ).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </td>

                                        {/* Type Badge */}
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                                    record.type === 'PEMASUKAN'
                                                        ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                                                        : 'border border-rose-200 bg-rose-50 text-rose-700'
                                                }`}
                                            >
                                                {record.type}
                                            </span>
                                        </td>

                                        {/* Amount */}
                                        <td className="px-6 py-4 font-bold text-slate-800">
                                            Rp{' '}
                                            {Number(
                                                record.amount,
                                            ).toLocaleString('id-ID')}
                                        </td>

                                        {/* Category/Bank */}
                                        <td className="px-6 py-4 font-medium text-slate-600">
                                            {record.category_bank}
                                        </td>

                                        {/* Agent Mapping */}
                                        <td className="px-6 py-4">
                                            {record.agent ? (
                                                <span className="font-bold text-slate-700">
                                                    {record.agent.name}
                                                </span>
                                            ) : record.raw_agent_name ? (
                                                <div className="flex flex-col gap-1">
                                                    <span className="w-max rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-extrabold text-amber-800">
                                                        ⚠️ Unmapped
                                                    </span>
                                                    <span className="text-xs font-semibold text-slate-400 italic">
                                                        "{record.raw_agent_name}
                                                        "
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400">
                                                    -
                                                </span>
                                            )}
                                        </td>

                                        {/* Package Mapping */}
                                        <td className="px-6 py-4">
                                            {record.package ? (
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-700">
                                                        {record.package.name}
                                                    </span>
                                                    {record.package.code && (
                                                        <span className="text-[10px] font-bold text-slate-400">
                                                            Kode:{' '}
                                                            {
                                                                record.package
                                                                    .code
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            ) : record.raw_departure_date_package ? (
                                                <div className="flex flex-col gap-1">
                                                    <span className="w-max rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-extrabold text-amber-800">
                                                        ⚠️ Unmapped
                                                    </span>
                                                    <span className="text-xs font-semibold text-slate-400 italic">
                                                        "
                                                        {
                                                            record.raw_departure_date_package
                                                        }
                                                        "
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400">
                                                    -
                                                </span>
                                            )}
                                        </td>

                                        {/* Proof Link */}
                                        <td className="px-6 py-4 text-center">
                                            {record.proof_link ? (
                                                <a
                                                    href={record.proof_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
                                                    title="Buka Link Bukti"
                                                >
                                                    <ExternalLink size={14} />
                                                </a>
                                            ) : (
                                                <span className="text-slate-400">
                                                    -
                                                </span>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        openEdit(record)
                                                    }
                                                    className="rounded-lg border-blue-200 bg-blue-50 font-bold text-blue-600 shadow-sm hover:bg-blue-100 hover:text-blue-800"
                                                    title="Edit Transaksi"
                                                >
                                                    <Edit3 size={14} />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDelete(record.id)
                                                    }
                                                    className="rounded-lg border-red-200 bg-red-50 font-bold text-red-600 shadow-sm hover:bg-red-100 hover:text-red-800"
                                                    title="Hapus Transaksi"
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        {records.data.length > 0 && (
                            <tfoot className="border-t border-slate-200 bg-slate-50 font-bold text-slate-800">
                                <tr>
                                    <td
                                        colSpan={2}
                                        className="px-6 py-4 text-left text-xs tracking-wider text-slate-500 uppercase"
                                    >
                                        Total Terfilter
                                    </td>
                                    <td className="px-6 py-4" colSpan={6}>
                                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
                                            <span className="text-emerald-700">
                                                Total Pemasukan: Rp{' '}
                                                {stats.filtered_income.toLocaleString(
                                                    'id-ID',
                                                )}
                                            </span>
                                            <span className="text-rose-700">
                                                Total Pengeluaran: Rp{' '}
                                                {stats.filtered_expense.toLocaleString(
                                                    'id-ID',
                                                )}
                                            </span>
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 ${stats.filtered_net >= 0 ? 'border border-emerald-200 bg-emerald-50 text-emerald-800' : 'border border-red-200 bg-red-50 text-red-800'}`}
                                            >
                                                Net Cashflow: Rp{' '}
                                                {stats.filtered_net.toLocaleString(
                                                    'id-ID',
                                                )}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>

                {records.data.length === 0 && (
                    <div className="bg-slate-50 p-12 text-center text-sm font-medium text-slate-500">
                        Belum ada data transaksi keuangan.
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="mt-4">
                <Pagination links={records.links} />
            </div>

            {/* Create & Edit Modal */}
            {(showCreateModal || editingRecord) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                    <div className="flex w-full max-w-lg animate-in flex-col overflow-hidden rounded-3xl bg-white p-0 shadow-2xl duration-200 zoom-in-95">
                        <div className="relative flex items-center justify-between overflow-hidden bg-emerald-900 p-6 text-white">
                            <div className="absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500 opacity-20 blur-2xl"></div>
                            <h2 className="relative z-10 flex items-center gap-2 text-xl font-bold">
                                {editingRecord ? (
                                    <Edit3
                                        size={20}
                                        className="text-amber-400"
                                    />
                                ) : (
                                    <Plus
                                        size={20}
                                        className="text-amber-400"
                                    />
                                )}
                                {editingRecord
                                    ? 'Edit Transaksi Keuangan'
                                    : 'Tambah Transaksi Keuangan'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setEditingRecord(null);
                                }}
                                className="relative z-10 text-emerald-300 transition-colors hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form
                            onSubmit={editingRecord ? submitEdit : submitCreate}
                            className="max-h-[75vh] space-y-5 overflow-y-auto p-6 md:p-8"
                        >
                            {/* Warning Badge for Unresolved Items during Edit */}
                            {editingRecord &&
                                (editingRecord.raw_agent_name ||
                                    editingRecord.raw_departure_date_package) && (
                                    <div className="space-y-1 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold text-amber-900">
                                        <div className="mb-1 flex items-center gap-1.5 text-[13px] font-bold text-amber-800">
                                            <AlertTriangle size={16} />
                                            Data Import Belum Terpetakan
                                        </div>
                                        {editingRecord.raw_agent_name && (
                                            <div>
                                                • Nama Agen asli Excel:{' '}
                                                <span className="rounded border bg-white px-1.5 py-0.5 font-mono">
                                                    {
                                                        editingRecord.raw_agent_name
                                                    }
                                                </span>
                                            </div>
                                        )}
                                        {editingRecord.raw_departure_date_package && (
                                            <div>
                                                • Paket keberangkatan asli
                                                Excel:{' '}
                                                <span className="rounded border bg-white px-1.5 py-0.5 font-mono">
                                                    {
                                                        editingRecord.raw_departure_date_package
                                                    }
                                                </span>
                                            </div>
                                        )}
                                        <div className="mt-2 text-[11px] font-medium text-amber-700/80">
                                            Hubungkan ke database dengan memilih
                                            pilihan Agen / Paket di bawah.
                                        </div>
                                    </div>
                                )}

                            <div className="grid grid-cols-2 gap-4">
                                {/* Transaction Date */}
                                <div className="col-span-2 space-y-1.5 sm:col-span-1">
                                    <Label className="font-bold text-slate-700">
                                        Tanggal Transaksi *
                                    </Label>
                                    <Input
                                        type="date"
                                        required
                                        value={data.transaction_date}
                                        onChange={(e) =>
                                            setData(
                                                'transaction_date',
                                                e.target.value,
                                            )
                                        }
                                        className="rounded-xl border-slate-300"
                                    />
                                </div>

                                {/* Transaction Type */}
                                <div className="col-span-2 space-y-1.5 sm:col-span-1">
                                    <Label className="font-bold text-slate-700">
                                        Jenis Transaksi *
                                    </Label>
                                    <select
                                        required
                                        value={data.type}
                                        onChange={(e) =>
                                            setData(
                                                'type',
                                                e.target.value as any,
                                            )
                                        }
                                        className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold focus:border-emerald-500 focus:ring-emerald-500"
                                    >
                                        <option value="PEMASUKAN">
                                            PEMASUKAN
                                        </option>
                                        <option value="PENGELUARAN">
                                            PENGELUARAN
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Amount */}
                                <div className="col-span-2 space-y-1.5 sm:col-span-1">
                                    <Label className="font-bold text-slate-700">
                                        Nominal (Rp) *
                                    </Label>
                                    <Input
                                        type="number"
                                        required
                                        min="0"
                                        placeholder="Contoh: 15000000"
                                        value={data.amount}
                                        onChange={(e) =>
                                            setData('amount', e.target.value)
                                        }
                                        className="rounded-xl border-slate-300 font-bold"
                                    />
                                </div>

                                {/* Bank / Category */}
                                <div className="col-span-2 space-y-1.5 sm:col-span-1">
                                    <Label className="font-bold text-slate-700">
                                        Kategori / Bank *
                                    </Label>
                                    <Input
                                        required
                                        placeholder="Contoh: BCA, BRI, BNI, CASH"
                                        value={data.category_bank}
                                        onChange={(e) =>
                                            setData(
                                                'category_bank',
                                                e.target.value,
                                            )
                                        }
                                        className="rounded-xl border-slate-300"
                                    />
                                </div>
                            </div>

                            {/* Agent Selection */}
                            <div className="space-y-1.5">
                                <Label className="font-bold text-slate-700">
                                    Nama Agen (Hubungkan ke Database)
                                </Label>
                                <select
                                    value={data.agent_id}
                                    onChange={(e) =>
                                        setData('agent_id', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                >
                                    <option value="">
                                        -- Hubungkan dengan Agen (Opsional) --
                                    </option>
                                    {agents.map((a) => (
                                        <option key={a.id} value={a.id}>
                                            {a.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Package Selection */}
                            <div className="space-y-1.5">
                                <Label className="font-bold text-slate-700">
                                    Paket Keberangkatan (Hubungkan ke Database)
                                </Label>
                                <select
                                    value={data.package_id}
                                    onChange={(e) =>
                                        setData('package_id', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                >
                                    <option value="">
                                        -- Hubungkan dengan Paket (Opsional) --
                                    </option>
                                    {packages.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}{' '}
                                            {p.code ? `(${p.code})` : ''} -
                                            Berangkat:{' '}
                                            {new Date(
                                                p.departure_date,
                                            ).toLocaleDateString('id-ID')}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Proof Link */}
                            <div className="space-y-1.5">
                                <Label className="font-bold text-slate-700">
                                    Link Bukti Transaksi (Google Drive, dll)
                                </Label>
                                <Input
                                    placeholder="Contoh: https://drive.google.com/..."
                                    value={data.proof_link}
                                    onChange={(e) =>
                                        setData('proof_link', e.target.value)
                                    }
                                    className="rounded-xl border-slate-300"
                                />
                            </div>

                            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setEditingRecord(null);
                                    }}
                                    className="rounded-xl border-slate-300 px-6 font-bold text-slate-600 hover:bg-slate-50"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-amber-500 px-8 font-bold text-amber-950 shadow-md shadow-amber-500/20 hover:bg-amber-600"
                                >
                                    {editingRecord
                                        ? 'Simpan Perubahan'
                                        : 'Tambah Transaksi'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Import Excel/CSV Modal */}
            {showImportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                    <div className="flex w-full max-w-lg animate-in flex-col overflow-hidden rounded-3xl bg-white p-0 shadow-2xl duration-200 zoom-in-95">
                        <div className="relative flex items-center justify-between overflow-hidden bg-emerald-900 p-6 text-white">
                            <div className="absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500 opacity-20 blur-2xl"></div>
                            <h2 className="relative z-10 flex items-center gap-2 text-xl font-bold">
                                <Upload size={20} className="text-amber-400" />{' '}
                                Import Data Keuangan
                            </h2>
                            <button
                                onClick={() => setShowImportModal(false)}
                                className="relative z-10 text-emerald-300 transition-colors hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form
                            onSubmit={submitImport}
                            className="space-y-6 p-6 md:p-8"
                        >
                            <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                                <h4 className="flex items-center gap-1.5 font-bold text-slate-800">
                                    <FileText
                                        size={14}
                                        className="text-emerald-600"
                                    />{' '}
                                    Ketentuan Format File Excel / CSV:
                                </h4>
                                <p>
                                    Pastikan baris header file Anda mengandung
                                    kolom-kolom berikut:
                                </p>
                                <ul className="list-inside list-disc space-y-1 pl-2 font-semibold text-slate-700">
                                    <li>Nama Agen</li>
                                    <li>
                                        Tanggal Berangkat{' '}
                                        <span className="font-normal text-slate-500">
                                            (Contoh: 2026-06-22, 12HR G1)
                                        </span>
                                    </li>
                                    <li>
                                        Tanggal Transaksi{' '}
                                        <span className="font-normal text-slate-500">
                                            (Format: YYYY-MM-DD)
                                        </span>
                                    </li>
                                    <li>Kategori/Bank</li>
                                    <li>Nominal</li>
                                    <li>
                                        Jenis Transaksi{' '}
                                        <span className="font-normal text-slate-500">
                                            (PEMASUKAN / PENGELUARAN)
                                        </span>
                                    </li>
                                    <li>Link Bukti</li>
                                </ul>
                                <p className="text-[10px] font-medium text-slate-400">
                                    * Sistem akan otomatis mencocokkan Nama Agen
                                    dan Paket Keberangkatan. Data yang tidak
                                    tercocokkan akan tetap masuk sebagai draft
                                    yang belum terpetakan (unmapped).
                                </p>
                            </div>

                            {/* File Input */}
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">
                                    Pilih File (.xlsx, .xls, .csv)
                                </Label>
                                <div className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 transition-colors hover:border-emerald-500">
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
                                        size={32}
                                        className="mb-3 text-slate-400 transition-colors group-hover:text-emerald-600"
                                    />
                                    {importData.file ? (
                                        <div className="text-center">
                                            <p className="text-sm font-bold text-emerald-600">
                                                {importData.file.name}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-400">
                                                Size:{' '}
                                                {(
                                                    importData.file.size / 1024
                                                ).toFixed(1)}{' '}
                                                KB
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <p className="text-sm font-bold text-slate-700">
                                                Klik atau seret file ke sini
                                            </p>
                                            <p className="mt-1 text-xs text-slate-400">
                                                Mendukung format Excel dan CSV
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowImportModal(false)}
                                    className="rounded-xl border-slate-300 px-6 font-bold text-slate-600 hover:bg-slate-50"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={importing}
                                    className="rounded-xl bg-emerald-600 px-6 font-bold text-white shadow-md hover:bg-emerald-700"
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
        </div>
    );
}

Finance.layout = {
    breadcrumbs: [{ title: 'Kelola Keuangan', href: '/admin/finance' }],
};
