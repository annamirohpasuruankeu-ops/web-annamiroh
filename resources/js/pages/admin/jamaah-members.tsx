import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    FileUp,
    CheckCircle2,
    Clock,
    Users,
    Plus,
    X,
    UserCircle2,
    ArrowLeft,
} from 'lucide-react';
import { PageProps } from '@/types';
import { FormEventHandler, useRef, useState } from 'react';

export default function JamaahMembers({ jamaah }: PageProps<{ jamaah: any }>) {
    const members = jamaah?.jamaah_members || [];

    // For document upload
    const [uploadingDoc, setUploadingDoc] = useState<{
        memberId: number;
        type: string;
    } | null>(null);
    const [showAddMember, setShowAddMember] = useState(false);

    const {
        data: uploadData,
        setData: setUploadData,
        post: postUpload,
        processing: uploading,
    } = useForm({
        document_type: '',
        file: null as File | null,
    });

    const {
        data: memberData,
        setData: setMemberData,
        post: postMember,
        processing: savingMember,
        reset: resetMember,
    } = useForm({
        name: '',
        nik: '',
        jenis_kelamin: '',
        hubungan_keluarga: members.length === 0 ? 'Diri Sendiri' : '',
        tempat_lahir: '',
        tgl_lahir: '',
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = (memberId: number, type: string) => {
        setUploadingDoc({ memberId, type });
        setUploadData('document_type', type);
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && uploadingDoc) {
            setUploadData('file', e.target.files[0]);
            setTimeout(() => {
                const submitButton =
                    document.getElementById('hidden-submit-btn');
                submitButton?.click();
            }, 100);
        }
    };

    const submitUpload: FormEventHandler = (e) => {
        e.preventDefault();
        if (!uploadingDoc) return;

        postUpload(`/admin/members/${uploadingDoc.memberId}/documents`, {
            preserveScroll: true,
            onSuccess: () => {
                setUploadingDoc(null);
                setUploadData('file', null);
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
        });
    };

    const submitMember: FormEventHandler = (e) => {
        e.preventDefault();
        postMember(`/admin/jamaah/${jamaah.id}/members`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowAddMember(false);
                resetMember();
            },
        });
    };

    const docItems = [
        { id: 'ktp', title: 'Kartu Tanda Penduduk (KTP)', field: 'ktp_file' },
        { id: 'kk', title: 'Kartu Keluarga (KK)', field: 'kk_file' },
        { id: 'paspor', title: 'Paspor (Opsional)', field: 'paspor_file' },
        {
            id: 'paspor_second',
            title: 'Paspor Lembar Kedua (Opsional)',
            field: 'paspor_second_file',
        },
        { id: 'vaksin', title: 'Sertifikat Vaksin', field: 'vaksin_file' },
    ];

    return (
        <div className="mx-auto w-full max-w-7xl p-6">
            <Head title={`Kelola Rombongan: ${jamaah.name}`} />

            <div className="mb-6">
                <Link
                    href="/admin/jamaah"
                    className="mb-4 inline-flex items-center text-sm font-medium text-slate-500 transition-colors hover:text-emerald-600"
                >
                    <ArrowLeft size={16} className="mr-1" /> Kembali ke Data
                    Jamaah
                </Link>

                <div className="relative flex flex-col justify-between gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
                    <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-amber-500 opacity-10 blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-800">
                                Rombongan: {jamaah.name}
                            </h1>
                            <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-emerald-800 uppercase">
                                Akun Utama
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                            WA: {jamaah.profile?.no_wa} • Email: {jamaah.email}
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowAddMember(true)}
                        className="relative z-10 bg-emerald-600 shadow-md hover:bg-emerald-700"
                    >
                        <Plus size={18} className="mr-2" /> Tambah Anggota
                        Rombongan
                    </Button>
                </div>
            </div>

            <div className="grid items-start gap-6 md:grid-cols-3">
                <div className="space-y-6 md:col-span-2">
                    {members.length === 0 ? (
                        <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                                <UserCircle2 size={32} />
                            </div>
                            <h4 className="text-lg font-bold text-slate-800">
                                Belum Ada Rombongan
                            </h4>
                            <p className="mx-auto mt-2 mb-6 max-w-md text-slate-500">
                                Klik tombol di bawah ini untuk menambahkan data
                                pendaftar utama atau anggota keluarganya.
                            </p>
                            <Button
                                onClick={() => setShowAddMember(true)}
                                className="bg-emerald-600 hover:bg-emerald-700"
                            >
                                <Plus size={18} className="mr-2" /> Tambah
                                Anggota Pertama
                            </Button>
                        </div>
                    ) : (
                        members.map((member: any) => (
                            <div
                                key={member.id}
                                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                            >
                                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                                                {member.name}
                                                <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-800 uppercase">
                                                    {member.hubungan_keluarga}
                                                </span>
                                            </h4>
                                            <p className="text-xs font-medium text-slate-500">
                                                {member.jenis_kelamin} • NIK:{' '}
                                                {member.nik || '-'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-4 p-4 sm:grid-cols-2">
                                    {docItems.map((doc) => {
                                        const isUploaded = !!member[doc.field];
                                        const isCurrentUploading =
                                            uploadingDoc?.memberId ===
                                                member.id &&
                                            uploadingDoc?.type === doc.id &&
                                            uploading;

                                        return (
                                            <div
                                                key={doc.id}
                                                className={`flex flex-col rounded-xl border p-3 ${isUploaded ? 'border-emerald-100 bg-emerald-50/30' : 'border-slate-200 bg-slate-50'}`}
                                            >
                                                <div className="mb-2 flex items-start justify-between">
                                                    <span className="text-sm font-semibold text-slate-700">
                                                        {doc.title}
                                                    </span>
                                                    {isUploaded ? (
                                                        <CheckCircle2
                                                            size={16}
                                                            className="text-emerald-500"
                                                        />
                                                    ) : (
                                                        <FileUp
                                                            size={16}
                                                            className="text-slate-400"
                                                        />
                                                    )}
                                                </div>

                                                <div className="mt-auto flex items-center justify-between pt-2">
                                                    {isUploaded ? (
                                                        <a
                                                            href={`/storage-file/${member[doc.field]}`}
                                                            target="_blank"
                                                            className="rounded bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-600 hover:underline"
                                                        >
                                                            Lihat Dokumen
                                                        </a>
                                                    ) : (
                                                        <span className="text-[10px] font-medium text-slate-400 italic">
                                                            Belum diunggah
                                                        </span>
                                                    )}

                                                    <Button
                                                        variant={
                                                            isUploaded
                                                                ? 'ghost'
                                                                : 'default'
                                                        }
                                                        size="sm"
                                                        className={`h-7 px-3 text-[11px] ${!isUploaded ? 'bg-slate-800 text-white hover:bg-slate-900' : 'text-slate-600 hover:bg-slate-200'}`}
                                                        onClick={() =>
                                                            handleUploadClick(
                                                                member.id,
                                                                doc.id,
                                                            )
                                                        }
                                                        disabled={uploading}
                                                    >
                                                        {isCurrentUploading
                                                            ? 'Loading...'
                                                            : isUploaded
                                                              ? 'Ganti'
                                                              : 'Upload Admin'}
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    )}

                    <form onSubmit={submitUpload} className="hidden">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".jpg,.jpeg,.png,.pdf"
                        />
                        <button id="hidden-submit-btn" type="submit">
                            Upload
                        </button>
                    </form>
                </div>

                <div className="space-y-4 md:sticky md:top-6">
                    <h3 className="text-lg font-bold text-slate-800">
                        Paket Keberangkatan
                    </h3>
                    {jamaah?.bookings && jamaah.bookings.length > 0 ? (
                        <div className="relative overflow-hidden rounded-2xl bg-slate-800 p-6 text-white shadow-lg shadow-slate-900/20">
                            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-amber-400/20 blur-2xl"></div>
                            {jamaah.bookings.map((booking: any) => (
                                <div
                                    key={booking.id}
                                    className="relative z-10 mb-4 border-b border-slate-700/50 pb-4 last:mb-0 last:border-0 last:pb-0"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="rounded bg-amber-400 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-900 uppercase">
                                            Status: {booking.status_pembayaran}
                                        </span>
                                        {booking.is_seat_reduced ? (
                                            <span className="text-[10px] font-bold text-emerald-400">
                                                Seat Berkurang
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-bold text-slate-400">
                                                Seat Belum Berkurang
                                            </span>
                                        )}
                                    </div>
                                    <h4 className="mt-2.5 text-base leading-tight font-bold">
                                        {booking.package?.name}
                                    </h4>
                                    <p className="mt-2 text-xs font-medium text-slate-300">
                                        Nama:{' '}
                                        <span className="font-bold text-white">
                                            {booking.jamaah_member?.name ||
                                                jamaah.name}
                                        </span>
                                        {booking.jamaah_member
                                            ?.hubungan_keluarga && (
                                            <span className="ml-1.5 rounded bg-amber-400/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-300 uppercase">
                                                {
                                                    booking.jamaah_member
                                                        .hubungan_keluarga
                                                }
                                            </span>
                                        )}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-100 p-6 text-center">
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-slate-400">
                                <Clock size={24} />
                            </div>
                            <h4 className="text-sm font-semibold text-slate-700">
                                Belum Ada Paket
                            </h4>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Tambah Anggota */}
            {showAddMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                    <div className="flex max-h-[90vh] w-full max-w-2xl animate-in flex-col overflow-hidden rounded-3xl bg-white p-0 shadow-2xl duration-200 zoom-in-95">
                        <div className="relative flex items-center justify-between overflow-hidden bg-emerald-900 p-6 text-white">
                            <div className="absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500 opacity-20 blur-2xl"></div>
                            <h2 className="relative z-10 flex items-center gap-2 text-xl font-bold">
                                <Users size={20} className="text-amber-400" />
                                Form Tambah Anggota Rombongan
                            </h2>
                            <button
                                onClick={() => setShowAddMember(false)}
                                className="relative z-10 text-emerald-300 transition-colors hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form
                            onSubmit={submitMember}
                            className="flex-1 overflow-y-auto p-6 md:p-8"
                        >
                            <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
                                <div>
                                    <Label>
                                        Nama Lengkap (Sesuai KTP/Paspor) *
                                    </Label>
                                    <Input
                                        required
                                        value={memberData.name}
                                        onChange={(e) =>
                                            setMemberData(
                                                'name',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1.5"
                                    />
                                </div>
                                <div>
                                    <Label>NIK (16 Digit) *</Label>
                                    <Input
                                        required
                                        value={memberData.nik}
                                        onChange={(e) =>
                                            setMemberData('nik', e.target.value)
                                        }
                                        className="mt-1.5"
                                    />
                                </div>

                                <div>
                                    <Label>Jenis Kelamin *</Label>
                                    <select
                                        required
                                        value={memberData.jenis_kelamin}
                                        onChange={(e) =>
                                            setMemberData(
                                                'jenis_kelamin',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    >
                                        <option value="">Pilih...</option>
                                        <option value="Laki-laki">
                                            Laki-laki
                                        </option>
                                        <option value="Perempuan">
                                            Perempuan
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <Label>Hubungan Keluarga *</Label>
                                    <select
                                        required
                                        value={memberData.hubungan_keluarga}
                                        onChange={(e) =>
                                            setMemberData(
                                                'hubungan_keluarga',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    >
                                        <option value="">Pilih...</option>
                                        <option value="Diri Sendiri">
                                            Diri Sendiri
                                        </option>
                                        <option value="Kepala Keluarga">
                                            Kepala Keluarga
                                        </option>
                                        <option value="Istri">Istri</option>
                                        <option value="Suami">Suami</option>
                                        <option value="Anak">Anak</option>
                                        <option value="Orang Tua">
                                            Orang Tua
                                        </option>
                                        <option value="Saudara">Saudara</option>
                                    </select>
                                </div>

                                <div>
                                    <Label>Tempat Lahir *</Label>
                                    <Input
                                        required
                                        value={memberData.tempat_lahir}
                                        onChange={(e) =>
                                            setMemberData(
                                                'tempat_lahir',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1.5"
                                    />
                                </div>
                                <div>
                                    <Label>Tanggal Lahir *</Label>
                                    <Input
                                        type="date"
                                        required
                                        value={memberData.tgl_lahir}
                                        onChange={(e) =>
                                            setMemberData(
                                                'tgl_lahir',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1.5"
                                    />
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowAddMember(false)}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={savingMember}
                                    className="bg-emerald-600 hover:bg-emerald-700"
                                >
                                    Simpan Anggota
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

JamaahMembers.layout = {
    breadcrumbs: [{ title: 'Kelola Rombongan', href: '/admin/jamaah' }],
};
