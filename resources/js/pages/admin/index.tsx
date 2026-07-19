import { Head, router, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    Users,
    Briefcase,
    ShieldCheck,
    CheckCircle2,
    PackageCheck,
    Search,
    ClipboardList,
    FolderGit2,
    Calendar,
    Plane,
    Clock,
    Tag,
    AlertCircle,
    UserCheck,
    Award,
} from 'lucide-react';
import Pagination from '@/components/pagination';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Summary {
    total_active: number;
    total_seats: number;
    booked_seats: number;
    available_seats: number;
    total_jamaah: number;
    total_agents: number;
}

interface FilterProps {
    search: string | null;
    status: string | null;
    sort_by: string;
}

interface Package {
    id: number;
    name: string;
    code: string | null;
    program_days: number;
    departure_date: string;
    airline: string;
    price: number;
    total_seats: number;
    available_seats: number;
    image: string | null;
    bookings_count: number;
}

export default function AdminDashboard({
    packages,
    summary,
    filters,
    userRole,
}: PageProps<{
    packages: { data: Package[]; links: any[] };
    summary: Summary;
    filters: FilterProps;
    userRole: string;
}>) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [sortBy, setSortBy] = useState(
        filters.sort_by || 'departure_date_asc',
    );

    const triggerSearch = (
        searchVal = search,
        statusVal = status,
        sortByVal = sortBy,
    ) => {
        router.get(
            '/admin',
            {
                search: searchVal || undefined,
                status: statusVal !== 'all' ? statusVal : undefined,
                sort_by: sortByVal,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            triggerSearch(search, status, sortBy);
        }
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setStatus(val);
        triggerSearch(search, val, sortBy);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setSortBy(val);
        triggerSearch(search, status, val);
    };

    const handleReset = () => {
        setSearch('');
        setStatus('all');
        setSortBy('departure_date_asc');
        router.get('/admin', {}, { replace: true });
    };

    const isAdmin = userRole === 'admin';

    return (
        <div className="mx-auto min-h-screen w-full max-w-7xl bg-slate-50 p-6 font-sans md:p-8">
            <Head title="Monitoring Kuota Paket" />

            {/* Header Title Section */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-800">
                        <ShieldCheck className="text-emerald-600" size={26} />
                        Dashboard Utama
                    </h1>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                        Ikhtisar metrik kuota paket keberangkatan aktif, basis
                        data jamaah, dan kemitraan agen secara real-time.
                    </p>
                </div>
            </div>

            {/* Summary Statistics Cards */}
            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Total Paket Aktif */}
                <div className="group flex items-center gap-4 rounded-2xl border border-emerald-100/80 bg-emerald-50/50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20 transition-transform group-hover:scale-110">
                        <Briefcase size={22} />
                    </div>
                    <div>
                        <span className="block text-xs font-bold tracking-wider text-emerald-800/70 uppercase">
                            Paket Aktif
                        </span>
                        <span className="text-2xl font-black tracking-tight text-emerald-950">
                            {summary.total_active}
                        </span>
                        <span className="mt-0.5 block text-[10px] font-semibold text-emerald-700/80">
                            Tampil di Publik
                        </span>
                    </div>
                </div>

                {/* Total Kuota Kursi */}
                <div className="group flex items-center gap-4 rounded-2xl border border-blue-100/80 bg-blue-50/50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20 transition-transform group-hover:scale-110">
                        <Users size={22} />
                    </div>
                    <div>
                        <span className="block text-xs font-bold tracking-wider text-blue-800/70 uppercase">
                            Total Kuota
                        </span>
                        <span className="text-2xl font-black tracking-tight text-blue-950">
                            {summary.total_seats}
                        </span>
                        <span className="mt-0.5 block text-[10px] font-semibold text-blue-700/80">
                            Akumulasi Seat
                        </span>
                    </div>
                </div>

                {/* Kursi Terisi */}
                <div className="group flex items-center gap-4 rounded-2xl border border-amber-100/80 bg-amber-50/50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20 transition-transform group-hover:scale-110">
                        <PackageCheck size={22} />
                    </div>
                    <div>
                        <span className="block text-xs font-bold tracking-wider text-amber-800/70 uppercase">
                            Seat Terisi
                        </span>
                        <span className="text-2xl font-black tracking-tight text-amber-950">
                            {summary.booked_seats}
                        </span>
                        <span className="mt-0.5 block text-[10px] font-bold text-amber-700/90">
                            {summary.total_seats > 0
                                ? Math.round(
                                      (summary.booked_seats /
                                          summary.total_seats) *
                                          100,
                                  )
                                : 0}
                            % Terisi
                        </span>
                    </div>
                </div>

                {/* Sisa Kursi Tersedia */}
                <div className="group flex items-center gap-4 rounded-2xl border border-teal-100/80 bg-teal-50/50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md shadow-teal-600/20 transition-transform group-hover:scale-110">
                        <CheckCircle2 size={22} />
                    </div>
                    <div>
                        <span className="block text-xs font-bold tracking-wider text-teal-800/70 uppercase">
                            Sisa Seat
                        </span>
                        <span className="text-2xl font-black tracking-tight text-teal-950">
                            {summary.available_seats}
                        </span>
                        <span className="mt-0.5 block text-[10px] font-semibold text-teal-700/80">
                            Siap di-Booking
                        </span>
                    </div>
                </div>

                {/* Total Jamaah */}
                <div className="group flex items-center gap-4 rounded-2xl border border-indigo-100/80 bg-indigo-50/50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20 transition-transform group-hover:scale-110">
                        <UserCheck size={22} />
                    </div>
                    <div>
                        <span className="block text-xs font-bold tracking-wider text-indigo-800/70 uppercase">
                            Total Jamaah
                        </span>
                        <span className="text-2xl font-black tracking-tight text-indigo-950">
                            {summary.total_jamaah}
                        </span>
                        <span className="mt-0.5 block text-[10px] font-semibold text-indigo-700/80">
                            Basis Data Jamaah
                        </span>
                    </div>
                </div>

                {/* Total Agen */}
                <div className="group flex items-center gap-4 rounded-2xl border border-rose-100/80 bg-rose-50/50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white shadow-md shadow-rose-600/20 transition-transform group-hover:scale-110">
                        <Award size={22} />
                    </div>
                    <div>
                        <span className="block text-xs font-bold tracking-wider text-rose-800/70 uppercase">
                            Total Agen
                        </span>
                        <span className="text-2xl font-black tracking-tight text-rose-950">
                            {summary.total_agents}
                        </span>
                        <span className="mt-0.5 block text-[10px] font-semibold text-rose-700/80">
                            Mitra Kemitraan
                        </span>
                    </div>
                </div>
            </div>

            {/* Filters Panel */}
            <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row">
                <div className="relative w-full max-w-md md:flex-1">
                    <Search
                        className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400"
                        size={18}
                    />
                    <Input
                        value={search}
                        onChange={handleSearchChange}
                        onKeyDown={handleSearchKeyDown}
                        placeholder="Cari nama atau kode paket... (Tekan Enter)"
                        className="h-11 rounded-xl border-slate-200 pl-10 focus-visible:border-emerald-500 focus-visible:ring-emerald-500"
                    />
                </div>

                <div className="flex w-full flex-wrap items-center gap-3 md:w-auto">
                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                        <span className="hidden text-xs font-bold tracking-wider text-slate-500 uppercase lg:inline">
                            Status:
                        </span>
                        <select
                            value={status}
                            onChange={handleStatusChange}
                            className="block h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                        >
                            <option value="all">Semua Status Kuota</option>
                            <option value="available">Tersedia (&gt; 5)</option>
                            <option value="warning">Sisa Sedikit (1-5)</option>
                            <option value="full">Penuh (0)</option>
                        </select>
                    </div>

                    {/* Sorting */}
                    <div className="flex items-center gap-2">
                        <span className="hidden text-xs font-bold tracking-wider text-slate-500 uppercase lg:inline">
                            Urutkan:
                        </span>
                        <select
                            value={sortBy}
                            onChange={handleSortChange}
                            className="block h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                        >
                            <option value="departure_date_asc">
                                Keberangkatan Terdekat
                            </option>
                            <option value="departure_date_desc">
                                Keberangkatan Terjauh
                            </option>
                            <option value="available_seats_asc">
                                Sisa Seat: Sedikit &rarr; Banyak
                            </option>
                            <option value="available_seats_desc">
                                Sisa Seat: Banyak &rarr; Sedikit
                            </option>
                            <option value="percentage_desc">
                                Keterisian: Tertinggi (%)
                            </option>
                            <option value="percentage_asc">
                                Keterisian: Terendah (%)
                            </option>
                        </select>
                    </div>

                    {/* Reset Button */}
                    {(search ||
                        status !== 'all' ||
                        sortBy !== 'departure_date_asc') && (
                        <Button
                            onClick={handleReset}
                            variant="outline"
                            className="h-11 rounded-xl border-slate-200 px-4 font-bold text-slate-600 hover:bg-slate-50"
                        >
                            Reset
                        </Button>
                    )}
                </div>
            </div>

            {/* Packages Quota List */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                            <tr>
                                <th className="px-6 py-5 text-[10px] font-bold tracking-wider uppercase">
                                    Detail Paket
                                </th>
                                <th className="px-6 py-5 text-[10px] font-bold tracking-wider uppercase">
                                    Tanggal Keberangkatan
                                </th>
                                <th className="w-48 px-6 py-5 text-[10px] font-bold tracking-wider uppercase">
                                    Kapasitas Kursi
                                </th>
                                <th className="px-6 py-5 text-center text-[10px] font-bold tracking-wider uppercase">
                                    Sisa Seat
                                </th>
                                <th className="px-6 py-5 text-center text-[10px] font-bold tracking-wider uppercase">
                                    Status
                                </th>
                                <th className="px-6 py-5 text-[10px] font-bold tracking-wider uppercase">
                                    Harga
                                </th>
                                <th className="px-6 py-5 text-right text-[10px] font-bold tracking-wider uppercase">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {packages.data.map((p) => {
                                const booked =
                                    p.total_seats - p.available_seats;
                                const fillPercentage =
                                    p.total_seats > 0
                                        ? Math.round(
                                              (booked / p.total_seats) * 100,
                                          )
                                        : 0;

                                // Color Scheme based on seat availability
                                let progressColor = 'bg-emerald-500';
                                let badgeStyle =
                                    'bg-emerald-50 text-emerald-700 border-emerald-200';
                                let statusText = 'Tersedia';

                                if (p.available_seats === 0) {
                                    progressColor = 'bg-red-500';
                                    badgeStyle =
                                        'bg-red-50 text-red-700 border-red-200';
                                    statusText = 'Penuh';
                                } else if (p.available_seats <= 5) {
                                    progressColor = 'bg-amber-500';
                                    badgeStyle =
                                        'bg-amber-50 text-amber-700 border-amber-200';
                                    statusText = 'Sisa Sedikit';
                                }

                                return (
                                    <tr
                                        key={p.id}
                                        className="group transition-colors hover:bg-slate-50/40"
                                    >
                                        {/* Detail Paket */}
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                {p.image ? (
                                                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                                                        <img
                                                            src={`/storage-file/${p.image}`}
                                                            alt={p.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-amber-100 bg-amber-50 text-amber-500">
                                                        <Briefcase size={20} />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="flex items-center gap-2 text-[15px] leading-snug font-extrabold text-slate-800">
                                                        {p.name}
                                                    </div>
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        {p.code && (
                                                            <span className="rounded-md border border-slate-200/80 bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                                                                {p.code}
                                                            </span>
                                                        )}
                                                        <span className="flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                                            <Clock size={11} />{' '}
                                                            {p.program_days}{' '}
                                                            Hari
                                                        </span>
                                                        <span className="flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                                                            <Plane size={11} />{' '}
                                                            {p.airline}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Tanggal Keberangkatan */}
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                                                <Calendar
                                                    size={14}
                                                    className="text-slate-400"
                                                />
                                                {new Date(
                                                    p.departure_date,
                                                ).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                            </div>
                                        </td>

                                        {/* Kapasitas Kursi (Progress Bar) */}
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="text-slate-5050 flex justify-between text-xs font-bold">
                                                    <span className="text-slate-600">
                                                        {fillPercentage}% Terisi
                                                    </span>
                                                    <span className="text-slate-500">
                                                        {booked}/{p.total_seats}{' '}
                                                        Seat
                                                    </span>
                                                </div>
                                                <div className="h-2.5 w-full overflow-hidden rounded-full border border-slate-200/50 bg-slate-100">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                                                        style={{
                                                            width: `${fillPercentage}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Sisa Seat */}
                                        <td className="px-6 py-5 text-center">
                                            <span
                                                className={`text-lg font-black tracking-tight ${p.available_seats === 0 ? 'text-red-500' : p.available_seats <= 5 ? 'text-amber-500' : 'text-slate-800'}`}
                                            >
                                                {p.available_seats}
                                            </span>
                                            <span className="ml-0.5 text-xs font-bold text-slate-400">
                                                / {p.total_seats}
                                            </span>
                                        </td>

                                        {/* Status Badge */}
                                        <td className="px-6 py-5 text-center">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${badgeStyle}`}
                                            >
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${p.available_seats === 0 ? 'bg-red-500' : p.available_seats <= 5 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                                ></span>
                                                {statusText}
                                            </span>
                                        </td>

                                        {/* Harga */}
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-1 text-[15px] font-black text-slate-800">
                                                <Tag
                                                    size={13}
                                                    className="text-emerald-600"
                                                />
                                                Rp{' '}
                                                {Number(p.price).toLocaleString(
                                                    'id-ID',
                                                )}
                                            </div>
                                        </td>

                                        {/* Aksi */}
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/admin/bookings?package_id=${p.id}`}
                                                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-bold text-slate-600 shadow-sm transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                                                    title="Lihat transaksi / jamaah terdaftar"
                                                >
                                                    <ClipboardList size={14} />{' '}
                                                    Detail Transaksi
                                                </Link>
                                                {isAdmin && (
                                                    <Link
                                                        href={`/admin/packages?search=${encodeURIComponent(p.name)}`}
                                                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-bold text-slate-600 shadow-sm transition-all hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                                                        title="Kelola data paket"
                                                    >
                                                        <FolderGit2 size={14} />{' '}
                                                        Kelola Paket
                                                    </Link>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {packages.data.length === 0 && (
                    <div className="bg-slate-50/50 p-16 text-center text-slate-500">
                        <AlertCircle
                            size={36}
                            className="mx-auto mb-3 text-slate-400"
                        />
                        <p className="text-base font-extrabold text-slate-700">
                            Tidak ada paket ditemukan
                        </p>
                        <p className="mx-auto mt-1 max-w-md text-xs text-slate-400">
                            Silakan ubah filter pencarian Anda atau tambahkan
                            paket baru melalui menu Kelola Paket.
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <Pagination links={packages.links} />
        </div>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [{ title: 'Admin Dashboard', href: '/admin' }],
};
