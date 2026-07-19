import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Briefcase, PackagePlus, Edit3, X, Search } from 'lucide-react';
import Pagination from '@/components/pagination';
import { router } from '@inertiajs/react';

const formatRupiah = (value: string | number) => {
    if (value === null || value === undefined || value === '') return '';
    let str = value.toString().trim();
    
    // Check if it's a raw database decimal string ending with ".00"
    if (str.endsWith('.00') && (str.match(/\./g) || []).length === 1) {
        str = str.slice(0, -3);
    }
    
    const numericValue = str.replace(/[^0-9]/g, '');
    if (!numericValue) return '';
    return new Intl.NumberFormat('id-ID').format(parseInt(numericValue, 10));
};

export default function Packages({
    packages,
    filters,
    userRole,
}: PageProps<{ packages: any; filters?: any; userRole: string }>) {
    const [search, setSearch] = useState(filters?.search || '');
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const isAgent = userRole === 'agen';

    const { data, setData, post, reset, processing, transform } = useForm({
        name: '',
        program_days: '',
        departure_date: '',
        airline: '',
        airline_route: '',
        price: '',
        harga_agen: '',
        hotel_makkah: '',
        hotel_madinah: '',
        total_seats: '',
        free_items: '',
        includes: '',
        excludes: '',
        image: null as File | null,
        is_active: true,
        _method: 'post',
        code: '',
        is_best_seller: false,
    });

    const openAdd = () => {
        setEditingId(null);
        reset();
        setData('_method', 'post');
        setShowModal(true);
    };

    const openEdit = (p: any) => {
        setEditingId(p.id);
        const formattedDate = p.departure_date
            ? p.departure_date.split('T')[0].split(' ')[0]
            : '';
        setData({
            name: p.name,
            program_days: p.program_days,
            departure_date: formattedDate,
            airline: p.airline,
            airline_route: p.airline_route || '',
            price: p.price ? formatRupiah(Math.floor(parseFloat(p.price))) : '',
            harga_agen: p.harga_agen ? formatRupiah(Math.floor(parseFloat(p.harga_agen))) : '',
            hotel_makkah: p.hotel_makkah,
            hotel_madinah: p.hotel_madinah,
            total_seats: p.total_seats,
            free_items: p.free_items || '',
            includes: p.includes || '',
            excludes: p.excludes || '',
            image: null,
            is_active: p.is_active !== undefined ? Boolean(p.is_active) : true,
            _method: 'put',
            code: p.code || '',
            is_best_seller:
                p.is_best_seller !== undefined
                    ? Boolean(p.is_best_seller)
                    : false,
        });
        setShowModal(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        transform((data) => ({
            ...data,
            price: data.price
                ? data.price.toString().replace(/[^0-9]/g, '')
                : '',
            harga_agen: data.harga_agen
                ? data.harga_agen.toString().replace(/[^0-9]/g, '')
                : '',
        }));

        const url = editingId
            ? `/admin/packages/${editingId}`
            : `/admin/packages`;
        post(url, {
            forceFormData: true,
            onSuccess: () => setShowModal(false),
        });
    };

    return (
        <div className="mx-auto min-h-screen w-full max-w-7xl bg-slate-50 p-6 font-sans md:p-8">
            <Head title="Kelola Paket" />

            <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight text-slate-800">
                        <Briefcase className="text-amber-500" size={32} />
                        Manajemen Paket
                    </h1>
                    <p className="mt-2 text-sm font-medium text-slate-500">
                        Buat dan atur penawaran paket umroh beserta kuota
                        kursinya.
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
                                        '/admin/packages',
                                        { search },
                                        { preserveState: true, replace: true },
                                    );
                                }
                            }}
                            placeholder="Cari paket..."
                            className="border-slate-200 pl-9"
                        />
                    </div>
                    {!isAgent && (
                        <Button
                            onClick={openAdd}
                            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 font-bold text-white shadow-lg shadow-emerald-600/20 transition-transform hover:scale-105 hover:bg-emerald-700 active:scale-95 md:w-auto"
                        >
                            <PackagePlus size={18} /> Tambah Paket
                        </Button>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                    <div className="flex max-h-[90vh] w-full max-w-3xl animate-in flex-col overflow-hidden rounded-3xl bg-white p-0 shadow-2xl duration-200 zoom-in-95">
                        <div className="relative flex items-center justify-between overflow-hidden bg-emerald-900 p-6 text-white">
                            <div className="absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500 opacity-20 blur-2xl"></div>
                            <h2 className="relative z-10 flex items-center gap-2 text-xl font-bold">
                                {isAgent ? (
                                    <Search
                                        size={20}
                                        className="text-amber-400"
                                    />
                                ) : editingId ? (
                                    <Edit3
                                        size={20}
                                        className="text-amber-400"
                                    />
                                ) : (
                                    <PackagePlus
                                        size={20}
                                        className="text-amber-400"
                                    />
                                )}
                                {isAgent
                                    ? 'Detail Data Paket'
                                    : editingId
                                      ? 'Edit Data Paket'
                                      : 'Buat Paket Baru'}
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
                            <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
                                <div className="space-y-1.5 md:col-span-1">
                                    <Label className="font-bold text-slate-700">
                                        Kode Paket
                                    </Label>
                                    <Input
                                        disabled={isAgent}
                                        value={data.code}
                                        onChange={(e) =>
                                            setData('code', e.target.value)
                                        }
                                        placeholder="Contoh: UMROH_VIP_2026"
                                        className="rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </div>
                                <div className="space-y-1.5 md:col-span-1">
                                    <Label className="font-bold text-slate-700">
                                        Nama Paket *
                                    </Label>
                                    <Input
                                        disabled={isAgent}
                                        required
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="Contoh: Paket Umroh VIP Ramadhan"
                                        className="rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700">
                                        Lama Program (Hari) *
                                    </Label>
                                    <Input
                                        disabled={isAgent}
                                        type="number"
                                        required
                                        value={data.program_days}
                                        onChange={(e) =>
                                            setData(
                                                'program_days',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Misal: 9"
                                        className="rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700">
                                        Tanggal Keberangkatan *
                                    </Label>
                                    <Input
                                        disabled={isAgent}
                                        type="date"
                                        required
                                        value={data.departure_date}
                                        onChange={(e) =>
                                            setData(
                                                'departure_date',
                                                e.target.value,
                                            )
                                        }
                                        className="rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700">
                                        Maskapai Penerbangan *
                                    </Label>
                                    <Input
                                        disabled={isAgent}
                                        required
                                        value={data.airline}
                                        onChange={(e) =>
                                            setData('airline', e.target.value)
                                        }
                                        placeholder="Contoh: Saudia Airlines"
                                        className="rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700">
                                        Rute Penerbangan
                                    </Label>
                                    <Input
                                        disabled={isAgent}
                                        value={data.airline_route}
                                        onChange={(e) =>
                                            setData('airline_route', e.target.value)
                                        }
                                        placeholder="Contoh: Surabaya (SUB) - Jeddah (JED)"
                                        className="rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700">
                                        Total Seat Keseluruhan *
                                    </Label>
                                    <Input
                                        disabled={isAgent}
                                        type="number"
                                        required
                                        value={data.total_seats}
                                        onChange={(e) =>
                                            setData(
                                                'total_seats',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Kapasitas awal"
                                        className="rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700">
                                        Hotel Makkah *
                                    </Label>
                                    <Input
                                        disabled={isAgent}
                                        required
                                        value={data.hotel_makkah}
                                        onChange={(e) =>
                                            setData(
                                                'hotel_makkah',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Nama hotel di Makkah"
                                        className="rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700">
                                        Hotel Madinah *
                                    </Label>
                                    <Input
                                        disabled={isAgent}
                                        required
                                        value={data.hotel_madinah}
                                        onChange={(e) =>
                                            setData(
                                                'hotel_madinah',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Nama hotel di Madinah"
                                        className="rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </div>
                                <div className="space-y-1.5 md:col-span-1">
                                    <Label className="font-bold text-slate-700">
                                        Harga Paket (Rp) *
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute top-1/2 left-4 -translate-y-1/2 font-bold text-slate-500">
                                            Rp
                                        </span>
                                        <Input
                                            disabled={isAgent}
                                            type="text"
                                            required
                                            value={data.price}
                                            onChange={(e) =>
                                                setData(
                                                    'price',
                                                    formatRupiah(
                                                        e.target.value,
                                                    ),
                                                )
                                            }
                                            placeholder="25.000.000"
                                            className="rounded-xl border-slate-300 pl-12 font-bold focus:border-emerald-500 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5 md:col-span-1">
                                    <Label className="font-bold text-slate-700">
                                        Harga Agen (Rp) *
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute top-1/2 left-4 -translate-y-1/2 font-bold text-slate-500">
                                            Rp
                                        </span>
                                        <Input
                                            disabled={isAgent}
                                            type="text"
                                            required
                                            value={data.harga_agen}
                                            onChange={(e) =>
                                                setData(
                                                    'harga_agen',
                                                    formatRupiah(
                                                        e.target.value,
                                                    ),
                                                )
                                            }
                                            placeholder="23.000.000"
                                            className="rounded-xl border-slate-300 pl-12 font-bold text-emerald-700 focus:border-emerald-500 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <Label className="font-bold text-slate-700">
                                        Bonus/Free Items
                                    </Label>
                                    <textarea
                                        disabled={isAgent}
                                        value={data.free_items}
                                        onChange={(e) =>
                                            setData(
                                                'free_items',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Misal: Pigura 12R, Album kenangan, Sertifikat umroh"
                                        className="min-h-[60px] w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <Label className="font-bold text-slate-700">
                                        Harga Sudah Termasuk
                                    </Label>
                                    <textarea
                                        disabled={isAgent}
                                        value={data.includes}
                                        onChange={(e) =>
                                            setData('includes', e.target.value)
                                        }
                                        placeholder="Tiket pesawat PP, Akomodasi dan visa..."
                                        className="min-h-[80px] w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <Label className="font-bold text-slate-700">
                                        Harga Belum Termasuk
                                    </Label>
                                    <textarea
                                        disabled={isAgent}
                                        value={data.excludes}
                                        onChange={(e) =>
                                            setData('excludes', e.target.value)
                                        }
                                        placeholder="Paspor, Vaksin meningitis..."
                                        className="min-h-[80px] w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700">
                                        Poster/Gambar Paket (Opsional)
                                    </Label>
                                    <Input
                                        disabled={isAgent}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            setData(
                                                'image',
                                                e.target.files
                                                    ? e.target.files[0]
                                                    : null,
                                            )
                                        }
                                        className="rounded-xl border-slate-300 bg-white focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </div>
                                <div className="flex flex-col justify-center space-y-1.5">
                                    <Label className="font-bold text-slate-700">
                                        Status Paket
                                    </Label>
                                    <label className="mt-2 flex cursor-pointer items-center">
                                        <div className="relative">
                                            <input
                                                disabled={isAgent}
                                                type="checkbox"
                                                className="sr-only"
                                                checked={data.is_active}
                                                onChange={(e) =>
                                                    setData(
                                                        'is_active',
                                                        e.target.checked,
                                                    )
                                                }
                                            />
                                            <div
                                                className={`block h-8 w-14 rounded-full transition-colors ${data.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                            ></div>
                                            <div
                                                className={`dot absolute top-1 left-1 h-6 w-6 rounded-full bg-white transition-transform ${data.is_active ? 'translate-x-6 transform' : ''}`}
                                            ></div>
                                        </div>
                                        <div className="ml-3 text-sm font-bold text-slate-700">
                                            {data.is_active
                                                ? 'Aktif (Tampil)'
                                                : 'Nonaktif (Disembunyikan)'}
                                        </div>
                                    </label>
                                </div>
                                <div className="flex flex-col justify-center space-y-1.5">
                                    <Label className="font-bold text-slate-700">
                                        Paket Unggulan (Best Seller)
                                    </Label>
                                    <label className="mt-2 flex cursor-pointer items-center">
                                        <div className="relative">
                                            <input
                                                disabled={isAgent}
                                                type="checkbox"
                                                className="sr-only"
                                                checked={data.is_best_seller}
                                                onChange={(e) =>
                                                    setData(
                                                        'is_best_seller',
                                                        e.target.checked,
                                                    )
                                                }
                                            />
                                            <div
                                                className={`block h-8 w-14 rounded-full transition-colors ${data.is_best_seller ? 'bg-amber-500' : 'bg-slate-300'}`}
                                            ></div>
                                            <div
                                                className={`dot absolute top-1 left-1 h-6 w-6 rounded-full bg-white transition-transform ${data.is_best_seller ? 'translate-x-6 transform' : ''}`}
                                            ></div>
                                        </div>
                                        <div className="ml-3 text-sm font-bold text-slate-700">
                                            {data.is_best_seller
                                                ? 'Best Seller (Rekomendasi)'
                                                : 'Bukan Best Seller'}
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="mt-10 flex justify-end gap-3 border-t border-slate-100 pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowModal(false)}
                                    className="rounded-xl border-slate-300 px-6 font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                >
                                    {isAgent ? 'Tutup' : 'Batal'}
                                </Button>
                                {!isAgent && (
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-xl bg-amber-500 px-8 font-bold text-amber-950 shadow-md shadow-amber-500/20 hover:bg-amber-600"
                                    >
                                        {editingId
                                            ? 'Simpan Perubahan'
                                            : 'Buat Paket'}
                                    </Button>
                                )}
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
                                    Detail Paket
                                </th>
                                <th className="px-6 py-4 text-[10px] font-bold tracking-wider uppercase">
                                    Ketersediaan Seat
                                </th>
                                <th className="px-6 py-4 text-[10px] font-bold tracking-wider uppercase">
                                    Harga
                                </th>
                                <th className="px-6 py-4 text-right text-[10px] font-bold tracking-wider uppercase">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {packages.data.map((p: any) => (
                                <tr
                                    key={p.id}
                                    className="group transition-colors hover:bg-slate-50/50"
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            {p.image ? (
                                                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                                                    <img
                                                        src={`/storage-file/${p.image}`}
                                                        alt={p.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-amber-100 bg-amber-50 text-amber-500">
                                                    <Briefcase size={20} />
                                                </div>
                                            )}
                                            <div>
                                                <div className="flex items-center gap-2 text-base font-extrabold text-slate-800">
                                                    {p.name}
                                                    {p.code && (
                                                        <span className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                                                            {p.code}
                                                        </span>
                                                    )}
                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${p.is_active ? 'border border-emerald-200 bg-emerald-100 text-emerald-700' : 'border border-slate-200 bg-slate-100 text-slate-500'}`}
                                                    >
                                                        {p.is_active
                                                            ? 'Aktif'
                                                            : 'Draft'}
                                                    </span>
                                                    {p.is_best_seller && (
                                                        <span className="rounded-full border border-amber-200 bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-800 uppercase">
                                                            Best Seller
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mt-1.5 flex gap-2">
                                                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                                        {p.program_days} Hari
                                                    </span>
                                                    <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                                                        {p.airline} {p.airline_route ? `(${p.airline_route})` : ''}
                                                    </span>
                                                </div>
                                                <div className="mt-2 flex items-center gap-1 text-xs font-medium text-slate-500">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>{' '}
                                                    Berangkat:{' '}
                                                    {new Date(
                                                        p.departure_date,
                                                    ).toLocaleDateString(
                                                        'id-ID',
                                                        {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric',
                                                        },
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 max-w-[120px] flex-1 overflow-hidden rounded-full bg-slate-100">
                                                <div
                                                    className={`h-full rounded-full ${p.available_seats <= 5 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                                    style={{
                                                        width: `${((p.total_seats - p.available_seats) / p.total_seats) * 100}%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="w-12 text-right text-xs font-bold text-slate-700">
                                                {p.available_seats} sisa
                                            </span>
                                        </div>
                                        <div className="mt-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                            Dari {p.total_seats} Total
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        {isAgent ? (
                                            <>
                                                <div className="text-base font-extrabold text-emerald-600">
                                                    Rp{' '}
                                                    {Number(
                                                        p.harga_agen || p.price,
                                                    ).toLocaleString('id-ID')}
                                                </div>
                                                <div className="mt-1 flex items-center gap-1 text-xs font-bold text-slate-500">
                                                    <span className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider uppercase">
                                                        Normal
                                                    </span>
                                                    Rp{' '}
                                                    {Number(
                                                        p.price,
                                                    ).toLocaleString('id-ID')}
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="text-base font-extrabold text-slate-800">
                                                    Rp{' '}
                                                    {Number(
                                                        p.price,
                                                    ).toLocaleString('id-ID')}
                                                </div>
                                                {p.harga_agen && (
                                                    <div className="mt-1 flex items-center gap-1 text-xs font-bold text-emerald-600">
                                                        <span className="rounded border border-emerald-100 bg-emerald-50 px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider uppercase">
                                                            Agen
                                                        </span>
                                                        Rp{' '}
                                                        {Number(
                                                            p.harga_agen,
                                                        ).toLocaleString(
                                                            'id-ID',
                                                        )}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        {isAgent ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openEdit(p)}
                                                className="rounded-lg border-blue-200 bg-blue-50 font-bold text-blue-700 shadow-sm hover:bg-blue-100 hover:text-blue-800"
                                            >
                                                <Search
                                                    size={14}
                                                    className="mr-1.5"
                                                />{' '}
                                                Detail
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openEdit(p)}
                                                className="rounded-lg border-emerald-200 bg-emerald-50 font-bold text-emerald-700 shadow-sm hover:bg-emerald-100 hover:text-emerald-800"
                                            >
                                                <Edit3
                                                    size={14}
                                                    className="mr-1.5"
                                                />{' '}
                                                Edit
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {packages.data.length === 0 && (
                        <div className="bg-slate-50 p-12 text-center text-sm font-medium text-slate-500">
                            Belum ada paket yang dibuat.
                        </div>
                    )}
                </div>
            </div>

            <Pagination links={packages.links} />
        </div>
    );
}

Packages.layout = {
    breadcrumbs: [{ title: 'Kelola Paket', href: '/admin/packages' }],
};
