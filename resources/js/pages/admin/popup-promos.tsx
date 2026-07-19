import { Head, useForm, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import {
    Megaphone,
    Plus,
    Edit3,
    X,
    Eye,
    EyeOff,
    Image as ImageIcon,
    ExternalLink,
} from 'lucide-react';

interface PopupPromo {
    id: number;
    title: string;
    description: string | null;
    image: string | null;
    button_text: string | null;
    button_link: string | null;
    is_active: boolean;
    created_at: string;
}

export default function PopupPromos({
    popupPromos,
}: PageProps<{ popupPromos: PopupPromo[] }>) {
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, reset, processing } = useForm({
        title: '',
        description: '',
        image: null as File | null,
        button_text: '',
        button_link: '',
        is_active: false,
        _method: 'post',
    });

    const openAdd = () => {
        setEditingId(null);
        reset();
        setData('_method', 'post');
        setShowModal(true);
    };

    const openEdit = (p: PopupPromo) => {
        setEditingId(p.id);
        setData({
            title: p.title,
            description: p.description || '',
            image: null,
            button_text: p.button_text || '',
            button_link: p.button_link || '',
            is_active: p.is_active,
            _method: 'put',
        });
        setShowModal(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingId
            ? `/admin/popup-promos/${editingId}`
            : '/admin/popup-promos';
        post(url, {
            forceFormData: true,
            onSuccess: () => setShowModal(false),
        });
    };

    const toggleActive = (id: number) => {
        router.patch(
            `/admin/popup-promos/${id}/toggle`,
            {},
            { preserveScroll: true },
        );
    };

    return (
        <div className="mx-auto min-h-screen w-full max-w-7xl bg-slate-50 p-6 font-sans md:p-8">
            <Head title="Kelola Popup Promo" />

            {/* Header */}
            <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight text-slate-800">
                        <Megaphone className="text-amber-500" size={32} />
                        Popup Promo
                    </h1>
                    <p className="mt-2 text-sm font-medium text-slate-500">
                        Kelola popup promo yang tampil saat pengunjung pertama
                        kali membuka website.
                    </p>
                </div>
                <Button
                    onClick={openAdd}
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 font-bold text-white shadow-lg shadow-emerald-600/20 transition-transform hover:scale-105 hover:bg-emerald-700 active:scale-95 md:w-auto"
                >
                    <Plus size={18} /> Tambah Popup
                </Button>
            </div>

            {/* Info Banner */}
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-amber-400"></div>
                <p className="text-sm font-medium text-amber-800">
                    Hanya <strong>satu popup</strong> yang dapat aktif pada satu
                    waktu. Mengaktifkan popup baru akan otomatis menonaktifkan
                    popup lainnya.
                </p>
            </div>

            {/* Modal Form */}
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
                                    <Plus
                                        size={20}
                                        className="text-amber-400"
                                    />
                                )}
                                {editingId
                                    ? 'Edit Popup Promo'
                                    : 'Buat Popup Promo Baru'}
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
                                        Judul Popup *
                                    </Label>
                                    <Input
                                        required
                                        value={data.title}
                                        onChange={(e) =>
                                            setData('title', e.target.value)
                                        }
                                        placeholder="Contoh: Promo Umroh Ramadhan 2027"
                                        className="rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700">
                                        Deskripsi
                                    </Label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Deskripsi singkat promo (opsional)"
                                        className="min-h-[80px] w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700">
                                        Gambar/Poster Promo
                                    </Label>
                                    <Input
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
                                    <p className="mt-1 text-xs text-slate-400">
                                        Format: JPG, PNG. Maks: 2MB. Ukuran
                                        rekomendasi: 800×600px
                                    </p>
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <Label className="font-bold text-slate-700">
                                            Teks Tombol CTA
                                        </Label>
                                        <Input
                                            value={data.button_text}
                                            onChange={(e) =>
                                                setData(
                                                    'button_text',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Contoh: Daftar Sekarang"
                                            className="rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="font-bold text-slate-700">
                                            Link Tombol CTA
                                        </Label>
                                        <Input
                                            value={data.button_link}
                                            onChange={(e) =>
                                                setData(
                                                    'button_link',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Contoh: /register atau https://wa.me/..."
                                            className="rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700">
                                        Status
                                    </Label>
                                    <label className="mt-2 flex cursor-pointer items-center">
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
                                                ? 'Aktif (Tampil di Homepage)'
                                                : 'Nonaktif (Disembunyikan)'}
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
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-amber-500 px-8 font-bold text-amber-950 shadow-md shadow-amber-500/20 hover:bg-amber-600"
                                >
                                    {editingId
                                        ? 'Simpan Perubahan'
                                        : 'Buat Popup'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-bold tracking-wider uppercase">
                                Preview & Detail
                            </th>
                            <th className="px-6 py-4 text-[10px] font-bold tracking-wider uppercase">
                                Tombol CTA
                            </th>
                            <th className="px-6 py-4 text-center text-[10px] font-bold tracking-wider uppercase">
                                Status
                            </th>
                            <th className="px-6 py-4 text-right text-[10px] font-bold tracking-wider uppercase">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {popupPromos.map((promo) => (
                            <tr
                                key={promo.id}
                                className="group transition-colors hover:bg-slate-50/50"
                            >
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-4">
                                        {promo.image ? (
                                            <div className="h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                                                <img
                                                    src={`/storage-file/${promo.image}`}
                                                    alt={promo.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex h-12 w-16 flex-shrink-0 items-center justify-center rounded-lg border border-amber-100 bg-amber-50 text-amber-500">
                                                <ImageIcon size={20} />
                                            </div>
                                        )}
                                        <div>
                                            <div className="text-base font-extrabold text-slate-800">
                                                {promo.title}
                                            </div>
                                            {promo.description && (
                                                <div className="mt-1 line-clamp-2 max-w-sm text-xs font-medium text-slate-500">
                                                    {promo.description}
                                                </div>
                                            )}
                                            <div className="mt-1.5 text-[10px] font-medium text-slate-400">
                                                Dibuat:{' '}
                                                {new Date(
                                                    promo.created_at,
                                                ).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    {promo.button_text ? (
                                        <div className="flex flex-col gap-1">
                                            <span className="inline-flex w-max items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                                                <ExternalLink size={12} />
                                                {promo.button_text}
                                            </span>
                                            {promo.button_link && (
                                                <span className="block max-w-[200px] truncate text-[10px] text-slate-400">
                                                    → {promo.button_link}
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-400 italic">
                                            Tanpa tombol
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <button
                                        onClick={() => toggleActive(promo.id)}
                                        className="group/toggle inline-flex cursor-pointer items-center gap-1.5"
                                        title={
                                            promo.is_active
                                                ? 'Klik untuk menonaktifkan'
                                                : 'Klik untuk mengaktifkan'
                                        }
                                    >
                                        {promo.is_active ? (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700 transition-colors group-hover/toggle:bg-emerald-100">
                                                <Eye size={14} />
                                                <span className="relative flex h-2 w-2">
                                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                                                </span>
                                                AKTIF
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-[10px] font-bold text-slate-500 transition-colors group-hover/toggle:bg-slate-200">
                                                <EyeOff size={14} />
                                                NONAKTIF
                                            </span>
                                        )}
                                    </button>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openEdit(promo)}
                                        className="rounded-lg border-emerald-200 bg-emerald-50 font-bold text-emerald-700 shadow-sm hover:bg-emerald-100 hover:text-emerald-800"
                                    >
                                        <Edit3 size={14} className="mr-1.5" />{' '}
                                        Edit
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {popupPromos.length === 0 && (
                    <div className="p-16 text-center">
                        <Megaphone
                            className="mx-auto mb-4 text-slate-300"
                            size={48}
                        />
                        <p className="text-sm font-medium text-slate-500">
                            Belum ada popup promo. Klik "Tambah Popup" untuk
                            membuat yang pertama.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

PopupPromos.layout = {
    breadcrumbs: [{ title: 'Popup Promo', href: '/admin/popup-promos' }],
};
