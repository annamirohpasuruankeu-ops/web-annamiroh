import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    CreditCard,
    FileCheck,
    Search,
    Edit3,
    X,
    CheckCircle2,
    Briefcase,
    Printer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import Pagination from '@/components/pagination';
import { router } from '@inertiajs/react';

export default function Bookings({
    bookings,
    activePackages,
    filters,
    auth,
}: PageProps<{ bookings: any; activePackages: any[]; filters?: any }>) {
    const [search, setSearch] = useState(filters?.search || '');
    const [editingBooking, setEditingBooking] = useState<any>(null);

    const {
        data,
        setData,
        post: postForm,
        processing,
        reset,
    } = useForm({
        amount_paid: 0,
        bukti_pembayaran: null as File | null,
        _method: 'put',
    });

    const toggleSeat = (id: number) => {
        router.patch(
            `/admin/bookings/${id}/toggle-seat`,
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const openEdit = (b: any) => {
        setEditingBooking(b);
        setData({
            amount_paid: Number(b.amount_paid || 0),
            bukti_pembayaran: null,
            _method: 'put',
        });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBooking) return;
        postForm(`/admin/bookings/${editingBooking.id}`, {
            forceFormData: true,
            onSuccess: () => {
                setEditingBooking(null);
                reset();
            },
        });
    };
    return (
        <div className="mx-auto min-h-screen w-full max-w-7xl bg-slate-50 p-6 font-sans md:p-8">
            <Head title="Data Booking" />

            <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight text-slate-800">
                        <CreditCard className="text-amber-500" size={32} />
                        Transaksi Booking
                    </h1>
                    <p className="mt-2 text-sm font-medium text-slate-500">
                        Lacak status pembayaran dan pemberkasan dari setiap
                        pemesanan kursi jamaah.
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
                                        '/admin/bookings',
                                        {
                                            search,
                                            package_id: filters?.package_id,
                                        },
                                        { preserveState: true, replace: true },
                                    );
                                }
                            }}
                            placeholder="Cari transaksi..."
                            className="border-slate-200 pl-9"
                        />
                    </div>
                </div>
            </div>

            {/* Filter Cards */}
            {activePackages && activePackages.length > 0 && (
                <div className="scrollbar-hide -mx-6 mb-6 overflow-x-auto px-6 pb-2 md:mx-0 md:px-0">
                    <div className="flex min-w-max gap-4">
                        <div
                            onClick={() =>
                                router.get(
                                    '/admin/bookings',
                                    { search },
                                    { preserveState: true },
                                )
                            }
                            className={`min-w-[160px] cursor-pointer rounded-xl border p-4 transition-all ${!filters?.package_id ? 'border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'border-slate-200 bg-white hover:border-emerald-300'}`}
                        >
                            <div className="flex items-center gap-2">
                                <Briefcase
                                    size={16}
                                    className={
                                        !filters?.package_id
                                            ? 'text-emerald-200'
                                            : 'text-slate-400'
                                    }
                                />
                                <div
                                    className={`text-sm font-bold ${!filters?.package_id ? 'text-white' : 'text-slate-600'}`}
                                >
                                    Semua Paket
                                </div>
                            </div>
                            <div
                                className={`mt-2 text-2xl font-extrabold ${!filters?.package_id ? 'text-white' : 'text-slate-800'}`}
                            >
                                {activePackages.reduce(
                                    (acc, curr) => acc + curr.bookings_count,
                                    0,
                                )}{' '}
                                <span
                                    className={`text-xs font-medium ${!filters?.package_id ? 'text-emerald-100' : 'text-slate-400'}`}
                                >
                                    Transaksi
                                </span>
                            </div>
                        </div>
                        {activePackages.map((p: any) => (
                            <div
                                key={p.id}
                                onClick={() =>
                                    router.get(
                                        '/admin/bookings',
                                        { search, package_id: p.id },
                                        { preserveState: true },
                                    )
                                }
                                className={`max-w-[240px] min-w-[200px] cursor-pointer rounded-xl border p-4 transition-all ${filters?.package_id == p.id ? 'border-amber-500 bg-amber-500 text-amber-950 shadow-md shadow-amber-500/20' : 'border-slate-200 bg-white hover:border-amber-300'}`}
                            >
                                <div
                                    className={`truncate text-sm font-bold ${filters?.package_id == p.id ? 'text-amber-900' : 'text-slate-600'}`}
                                    title={p.name}
                                >
                                    {p.name}
                                </div>
                                <div className="mt-2 flex items-end gap-1.5">
                                    <div
                                        className={`text-2xl font-extrabold ${filters?.package_id == p.id ? 'text-amber-950' : 'text-slate-800'}`}
                                    >
                                        {p.total_seats - p.available_seats}
                                    </div>
                                    <div
                                        className={`pb-1 text-xs font-medium ${filters?.package_id == p.id ? 'text-amber-800' : 'text-slate-400'}`}
                                    >
                                        Seat Terisi
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-bold tracking-wider uppercase">
                                Identitas Jamaah
                            </th>
                            <th className="px-6 py-4 text-[10px] font-bold tracking-wider uppercase">
                                Paket Tujuan
                            </th>
                            <th className="px-6 py-4 text-[10px] font-bold tracking-wider uppercase">
                                Status Bayar
                            </th>
                            <th className="px-6 py-4 text-[10px] font-bold tracking-wider uppercase">
                                Status Dokumen
                            </th>
                            <th className="px-6 py-4 text-[10px] font-bold tracking-wider uppercase">
                                Status Seat
                            </th>
                            <th className="px-6 py-4 text-right text-[10px] font-bold tracking-wider uppercase">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {bookings.data.map((b: any) => (
                            <tr
                                key={b.id}
                                className="transition-colors hover:bg-slate-50/50"
                            >
                                <td className="px-6 py-5">
                                    <div className="text-base font-extrabold text-slate-800">
                                        {b.jamaah_member?.name || b.user?.name}
                                    </div>
                                    <div className="mt-0.5 text-xs text-slate-500">
                                        {b.jamaah_member ? (
                                            <span className="inline-flex items-center gap-1">
                                                Akun:{' '}
                                                <span className="font-semibold text-slate-700">
                                                    {b.user?.name}
                                                </span>{' '}
                                                •{' '}
                                                {
                                                    b.jamaah_member
                                                        .hubungan_keluarga
                                                }
                                            </span>
                                        ) : (
                                            b.user?.email
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="inline-block rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-900">
                                        {b.package?.name}
                                    </div>
                                    <div className="mt-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                        Booking ID: #
                                        {b.id.toString().padStart(5, '0')}
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span
                                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase ${b.status_pembayaran === 'lunas' ? 'border border-emerald-200 bg-emerald-100 text-emerald-700' : 'border border-amber-200 bg-amber-100 text-amber-700'}`}
                                    >
                                        <div
                                            className={`h-1.5 w-1.5 rounded-full ${b.status_pembayaran === 'lunas' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                        ></div>
                                        {b.status_pembayaran}
                                    </span>
                                    <div className="mt-2 text-[10px] font-bold text-slate-500">
                                        Dibayar:{' '}
                                        <span className="font-extrabold text-slate-700">
                                            Rp{' '}
                                            {Number(
                                                b.amount_paid || 0,
                                            ).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    {b.package && (
                                        <div className="text-[10px] font-bold text-slate-400">
                                            Sisa: Rp{' '}
                                            {Math.max(
                                                0,
                                                b.package.price -
                                                    Number(b.amount_paid || 0),
                                            ).toLocaleString('id-ID')}
                                        </div>
                                    )}
                                    {b.bukti_pembayaran && (
                                        <div className="mt-2">
                                            <a
                                                href={`/storage-file/${b.bukti_pembayaran}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="border-emerald-150 inline-flex items-center gap-1 rounded-md border bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 transition-colors hover:text-emerald-800"
                                            >
                                                Lihat Bukti Bayar
                                            </a>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-5">
                                    <span
                                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase ${b.status_dokumen === 'lengkap' ? 'border border-emerald-200 bg-emerald-100 text-emerald-700' : 'border border-slate-200 bg-slate-100 text-slate-600'}`}
                                    >
                                        <FileCheck
                                            size={12}
                                            className={
                                                b.status_dokumen === 'lengkap'
                                                    ? 'text-emerald-500'
                                                    : 'text-slate-400'
                                            }
                                        />
                                        {b.status_dokumen.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    {['admin', 'pusat'].includes(
                                        auth?.user?.role,
                                    ) ? (
                                        <button
                                            onClick={() => toggleSeat(b.id)}
                                            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase transition-all hover:shadow-md active:scale-95 ${
                                                b.is_seat_reduced
                                                    ? 'border border-emerald-200 bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                                    : 'border border-amber-200 bg-amber-100 text-amber-700 hover:bg-amber-200'
                                            }`}
                                            title={
                                                b.is_seat_reduced
                                                    ? 'Klik untuk kembalikan seat'
                                                    : 'Klik untuk kurangi seat'
                                            }
                                        >
                                            <div
                                                className={`h-1.5 w-1.5 rounded-full ${b.is_seat_reduced ? 'animate-pulse bg-emerald-500' : 'bg-amber-500'}`}
                                            ></div>
                                            {b.is_seat_reduced
                                                ? 'Berkurang (-1)'
                                                : 'Belum Berkurang'}
                                        </button>
                                    ) : (
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase ${b.is_seat_reduced ? 'border border-emerald-200 bg-emerald-100 text-emerald-700' : 'border border-slate-200 bg-slate-100 text-slate-600'}`}
                                        >
                                            <div
                                                className={`h-1.5 w-1.5 rounded-full ${b.is_seat_reduced ? 'bg-emerald-500' : 'bg-slate-400'}`}
                                            ></div>
                                            {b.is_seat_reduced
                                                ? 'Berkurang (-1)'
                                                : 'Belum Berkurang'}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {['pending', 'dp'].includes(
                                            b.status_pembayaran,
                                        ) && (
                                            <a
                                                href={`/admin/bookings/${b.id}/invoice`}
                                                target="_blank"
                                                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-emerald-600 active:scale-95"
                                            >
                                                <Printer size={14} /> Invoice
                                            </a>
                                        )}
                                        {['admin', 'pusat'].includes(
                                            auth?.user?.role,
                                        ) && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openEdit(b)}
                                                className="rounded-lg border-emerald-200 bg-emerald-50 font-bold text-emerald-700 shadow-sm hover:bg-emerald-100 hover:text-emerald-800"
                                            >
                                                <Edit3
                                                    size={14}
                                                    className="mr-1.5"
                                                />{' '}
                                                Kelola
                                            </Button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {bookings.data.length === 0 && (
                    <div className="bg-slate-50 p-12 text-center text-sm font-medium text-slate-500">
                        Belum ada transaksi booking.
                    </div>
                )}
            </div>

            <Pagination links={bookings.links} />

            {editingBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                    <div className="flex w-full max-w-md animate-in flex-col overflow-hidden rounded-3xl bg-white p-0 shadow-2xl duration-200 zoom-in-95">
                        <div className="relative flex items-center justify-between overflow-hidden bg-emerald-900 p-6 text-white">
                            <div className="absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500 opacity-20 blur-2xl"></div>
                            <h2 className="relative z-10 flex items-center gap-2 text-xl font-bold">
                                <CreditCard
                                    size={20}
                                    className="text-amber-400"
                                />{' '}
                                Kelola Transaksi
                            </h2>
                            <button
                                onClick={() => setEditingBooking(null)}
                                className="relative z-10 text-emerald-300 transition-colors hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="border-b border-slate-100 bg-slate-50 p-6">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                                    Jamaah
                                </span>
                                <strong className="text-lg text-slate-800">
                                    {editingBooking.user?.name}
                                </strong>
                                <span className="text-sm text-slate-600">
                                    {editingBooking.package?.name}
                                </span>
                            </div>
                        </div>

                        <form onSubmit={submit} className="p-6 md:p-8">
                            <div className="space-y-6">
                                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-xs font-bold tracking-wider text-emerald-800 uppercase">
                                            Total Harga Paket
                                        </span>
                                        <span className="text-sm font-extrabold text-emerald-900">
                                            Rp{' '}
                                            {Number(
                                                editingBooking.package?.price ||
                                                    0,
                                            ).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-emerald-200/50 pt-2">
                                        <span className="text-xs font-bold tracking-wider text-emerald-800/70 uppercase">
                                            Sisa Kekurangan
                                        </span>
                                        <span
                                            className={`text-sm font-extrabold ${Math.max(0, editingBooking.package?.price - data.amount_paid) === 0 ? 'text-emerald-600' : 'text-amber-600'}`}
                                        >
                                            Rp{' '}
                                            {Math.max(
                                                0,
                                                editingBooking.package?.price -
                                                    data.amount_paid,
                                            ).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">
                                        Nominal Telah Dibayar (Rp)
                                    </Label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        value={data.amount_paid}
                                        onChange={(e) =>
                                            setData(
                                                'amount_paid',
                                                Number(e.target.value),
                                            )
                                        }
                                    />
                                    <p className="mt-1 text-[10px] font-medium text-slate-500">
                                        Masukkan total uang yang diserahkan.
                                        Sistem akan otomatis mengatur status
                                        Lunas/DP/Pending.
                                    </p>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <Label className="font-bold text-slate-700">
                                        Upload Bukti Pembayaran
                                    </Label>
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white p-1 text-sm text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100"
                                        onChange={(e) => {
                                            const file =
                                                e.target.files?.[0] || null;
                                            setData('bukti_pembayaran', file);
                                        }}
                                    />
                                    <p className="mt-1 text-[10px] font-medium text-slate-500">
                                        Format: JPG, PNG, PDF. Maksimal 2MB.
                                    </p>
                                    {editingBooking.bukti_pembayaran && (
                                        <div className="mt-2 text-xs">
                                            <span className="text-slate-500">
                                                Bukti saat ini:{' '}
                                            </span>
                                            <a
                                                href={`/storage-file/${editingBooking.bukti_pembayaran}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-bold text-emerald-600 hover:underline"
                                            >
                                                Lihat Bukti Pembayaran
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditingBooking(null)}
                                    className="rounded-xl border-slate-300 px-6 font-bold text-slate-600 hover:bg-slate-50"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-amber-500 px-6 font-bold text-amber-950 shadow-md shadow-amber-500/20 hover:bg-amber-600"
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

Bookings.layout = {
    breadcrumbs: [{ title: 'Data Booking', href: '/admin/bookings' }],
};
