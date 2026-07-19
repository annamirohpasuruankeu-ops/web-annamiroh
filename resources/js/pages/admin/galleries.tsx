import { Head, useForm, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import {
    Image as ImageIcon,
    Plus,
    Edit3,
    X,
    Eye,
    EyeOff,
    Trash2,
    ArrowUpDown,
} from 'lucide-react';

interface GalleryItem {
    id: number;
    title: string | null;
    image: string;
    is_active: boolean;
    order: number;
    created_at: string;
}

export default function Galleries({
    galleries,
}: PageProps<{ galleries: GalleryItem[] }>) {
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, reset, processing } = useForm({
        title: '',
        image: null as File | null,
        order: 0,
        is_active: true,
        _method: 'post',
    });

    const openAdd = () => {
        setEditingId(null);
        reset();
        setData('_method', 'post');
        setShowModal(true);
    };

    const openEdit = (item: GalleryItem) => {
        setEditingId(item.id);
        setData({
            title: item.title || '',
            image: null,
            order: item.order,
            is_active: item.is_active,
            _method: 'put',
        });
        setShowModal(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingId
            ? `/admin/galleries/${editingId}`
            : '/admin/galleries';
        post(url, {
            forceFormData: true,
            onSuccess: () => setShowModal(false),
        });
    };

    const toggleActive = (id: number) => {
        router.patch(
            `/admin/galleries/${id}/toggle`,
            {},
            { preserveScroll: true },
        );
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus foto galeri ini?')) {
            router.delete(`/admin/galleries/${id}`, { preserveScroll: true });
        }
    };

    return (
        <div className="mx-auto min-h-screen w-full max-w-7xl bg-slate-50 p-6 font-sans md:p-8">
            <Head title="Kelola Galeri Perjalanan" />

            {/* Header */}
            <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight text-slate-800">
                        <ImageIcon className="text-amber-500" size={32} />
                        Galeri Perjalanan
                    </h1>
                    <p className="mt-2 text-sm font-medium text-slate-500">
                        Kelola foto dokumentasi perjalanan haji & umrah yang
                        tampil di halaman depan.
                    </p>
                </div>
                <Button
                    onClick={openAdd}
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 font-bold text-white shadow-lg shadow-emerald-600/20 transition-transform hover:scale-105 hover:bg-emerald-700 active:scale-95 md:w-auto"
                >
                    <Plus size={18} /> Tambah Foto
                </Button>
            </div>

            {/* Modal Form */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                    <div className="flex max-h-[90vh] w-full max-w-lg animate-in flex-col overflow-hidden rounded-3xl bg-white p-0 shadow-2xl duration-200 zoom-in-95">
                        <div className="relative flex items-center justify-between overflow-hidden bg-emerald-900 p-6 text-white">
                            <div className="absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500 opacity-20 blur-2xl"></div>
                            <h2 className="relative z-10 flex items-center gap-2 text-xl font-bold">
                                {editingId ? (
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
                                {editingId
                                    ? 'Edit Foto Galeri'
                                    : 'Tambah Foto Galeri Baru'}
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
                            <div className="space-y-6">
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700">
                                        Judul / Deskripsi Singkat
                                    </Label>
                                    <Input
                                        value={data.title}
                                        onChange={(e) =>
                                            setData('title', e.target.value)
                                        }
                                        placeholder="Contoh: Manasik Umroh Akbar atau Keberangkatan Jamaah"
                                        className="rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700">
                                        Foto *
                                    </Label>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        required={!editingId}
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
                                    <p className="mt-1 text-xs text-slate-400">
                                        Format: JPG, PNG, WEBP. Maks: 3MB.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="font-bold text-slate-700">
                                            Urutan Tampilan
                                        </Label>
                                        <Input
                                            type="number"
                                            value={data.order}
                                            onChange={(e) =>
                                                setData(
                                                    'order',
                                                    parseInt(e.target.value) ||
                                                        0,
                                                )
                                            }
                                            placeholder="0"
                                            className="rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                                        />
                                        <p className="mt-1 text-xs text-slate-400">
                                            Angka lebih kecil tampil di awal.
                                        </p>
                                    </div>

                                    <div className="flex flex-col justify-end space-y-1.5 pb-2">
                                        <Label className="mb-2 font-bold text-slate-700">
                                            Status
                                        </Label>
                                        <label className="flex cursor-pointer items-center">
                                            <div className="relative">
                                                <input
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
                                                    ? 'Aktif'
                                                    : 'Sembunyikan'}
                                            </div>
                                        </label>
                                    </div>
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
                                    {editingId ? 'Simpan' : 'Tambah'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Grid display for galleries */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {galleries.map((item) => (
                    <div
                        key={item.id}
                        className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                    >
                        {/* Image preview container */}
                        <div className="relative aspect-[4/3] flex-shrink-0 overflow-hidden bg-slate-100">
                            <img
                                src={`/storage-file/${item.image}`}
                                alt={item.title || 'Galeri'}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {/* Order overlay */}
                            <div className="absolute top-2 left-2 flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                                <ArrowUpDown size={10} />
                                Urutan: {item.order}
                            </div>
                        </div>

                        {/* Card body */}
                        <div className="flex flex-1 flex-col justify-between p-4">
                            <div>
                                <h3 className="line-clamp-2 min-h-[40px] text-sm font-bold text-slate-800">
                                    {item.title || (
                                        <span className="font-medium text-slate-400 italic">
                                            Tanpa judul
                                        </span>
                                    )}
                                </h3>
                                <p className="mt-1 text-[10px] text-slate-400">
                                    Dibuat:{' '}
                                    {new Date(
                                        item.created_at,
                                    ).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>

                            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                                {/* Toggle Active Button */}
                                <button
                                    onClick={() => toggleActive(item.id)}
                                    className="cursor-pointer"
                                    title={
                                        item.is_active
                                            ? 'Klik untuk sembunyikan'
                                            : 'Klik untuk tampilkan'
                                    }
                                >
                                    {item.is_active ? (
                                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                                            <Eye size={12} />
                                            Tampil
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
                                            <EyeOff size={12} />
                                            Sembunyi
                                        </span>
                                    )}
                                </button>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => openEdit(item)}
                                        className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                                        title="Edit"
                                    >
                                        <Edit3 size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                                        title="Hapus"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {galleries.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-sm">
                    <ImageIcon
                        className="mx-auto mb-4 animate-pulse text-slate-300"
                        size={56}
                    />
                    <p className="text-sm font-medium text-slate-500">
                        Belum ada foto galeri perjalanan. Klik "Tambah Foto"
                        untuk menambahkan.
                    </p>
                </div>
            )}
        </div>
    );
}

Galleries.layout = {
    breadcrumbs: [{ title: 'Galeri Perjalanan', href: '/admin/galleries' }],
};
