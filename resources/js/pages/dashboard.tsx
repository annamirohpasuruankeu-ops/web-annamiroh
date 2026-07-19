import { Head, useForm, router } from '@inertiajs/react';
import { dashboard } from '@/routes';
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
    Package,
    Pencil,
} from 'lucide-react';
import { PageProps } from '@/types';
import { FormEventHandler, useRef, useState, useEffect } from 'react';

export default function Dashboard({
    userData,
    bookPackage,
    availablePackages = [],
}: PageProps<{ userData: any; bookPackage?: any; availablePackages?: any[] }>) {
    const members = userData?.jamaah_members || [];

    // For document upload
    const [uploadingDoc, setUploadingDoc] = useState<{
        memberId: number;
        type: string;
    } | null>(null);
    const [showAddMember, setShowAddMember] = useState(false);
    const [editingMember, setEditingMember] = useState<any | null>(null);

    const [selectedBookPackage, setSelectedBookPackage] = useState<any>(
        bookPackage || null,
    );
    const [showBookModal, setShowBookModal] = useState(!!bookPackage);

    const {
        data: bookingData,
        setData: setBookingData,
        post: postBooking,
        processing: bookingInProgress,
    } = useForm({
        package_id: bookPackage?.id || '',
        jamaah_member_ids: [] as number[],
    });

    useEffect(() => {
        if (bookPackage) {
            setSelectedBookPackage(bookPackage);
            setBookingData('package_id', bookPackage.id);
            setShowBookModal(true);
        }
    }, [bookPackage]);

    const handleCancelBooking = () => {
        setShowBookModal(false);
        setSelectedBookPackage(null);
        setBookingData('package_id', '');
        setBookingData('jamaah_member_ids', []);
        router.visit('/dashboard');
    };

    const handleSelectPackageToBook = (pkg: any) => {
        setSelectedBookPackage(pkg);
        setBookingData('package_id', pkg.id);
        setBookingData('jamaah_member_ids', []);
        setShowBookModal(true);
    };

    const handleMemberCheck = (memberId: number, checked: boolean) => {
        if (checked) {
            setBookingData('jamaah_member_ids', [
                ...bookingData.jamaah_member_ids,
                memberId,
            ]);
        } else {
            setBookingData(
                'jamaah_member_ids',
                bookingData.jamaah_member_ids.filter((id) => id !== memberId),
            );
        }
    };

    const isMemberBooked = (memberId: number) => {
        return userData?.bookings?.some(
            (b: any) => b.jamaah_member_id === memberId,
        );
    };

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
        put: putMember,
        processing: savingMember,
        reset: resetMember,
    } = useForm({
        name: '',
        nik: '',
        jenis_kelamin: '',
        hubungan_keluarga: members.length === 0 ? 'Diri Sendiri' : '',
        tempat_lahir: '',
        tgl_lahir: '',
        email: '',
        nohp: '',
        nomor_paspor: '',
        paspor_office: '',
        paspor_issued: '',
        paspor_expiry: '',
        pp: '-',
        vm: '-',
        vp: '-',
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

        postUpload(`/dashboard/members/${uploadingDoc.memberId}/documents`, {
            preserveScroll: true,
            onSuccess: () => {
                setUploadingDoc(null);
                setUploadData('file', null);
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
        });
    };

    const handleAddMemberClick = () => {
        setEditingMember(null);
        resetMember();
        setMemberData({
            name: '',
            nik: '',
            jenis_kelamin: '',
            hubungan_keluarga: members.length === 0 ? 'Diri Sendiri' : '',
            tempat_lahir: '',
            tgl_lahir: '',
            email: '',
            nohp: '',
            nomor_paspor: '',
            paspor_office: '',
            paspor_issued: '',
            paspor_expiry: '',
            pp: '-',
            vm: '-',
            vp: '-',
        });
        setShowAddMember(true);
    };

    const handleEditMember = (member: any) => {
        setEditingMember(member);
        setMemberData({
            name: member.name || '',
            nik: member.nik || '',
            jenis_kelamin: member.jenis_kelamin || '',
            hubungan_keluarga: member.hubungan_keluarga || '',
            tempat_lahir: member.tempat_lahir || '',
            tgl_lahir: member.tgl_lahir || '',
            email: member.email || '',
            nohp: member.nohp || '',
            nomor_paspor: member.nomor_paspor || '',
            paspor_office: member.paspor_office || '',
            paspor_issued: member.paspor_issued || '',
            paspor_expiry: member.paspor_expiry || '',
            pp: member.pp || '-',
            vm: member.vm || '-',
            vp: member.vp || '-',
        });
        setShowAddMember(true);
    };

    const handleCloseAddMember = () => {
        setShowAddMember(false);
        setEditingMember(null);
        resetMember();
    };

    const submitMember: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingMember) {
            putMember(`/dashboard/members/${editingMember.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowAddMember(false);
                    setEditingMember(null);
                    resetMember();
                },
            });
        } else {
            postMember('/dashboard/members', {
                preserveScroll: true,
                onSuccess: () => {
                    setShowAddMember(false);
                    resetMember();
                },
            });
        }
    };

    const docItems = [
        { id: 'ktp', title: 'Kartu Tanda Penduduk (KTP)', field: 'ktp_file' },
        { id: 'kk', title: 'Kartu Keluarga (KK)', field: 'kk_file' },
        { id: 'paspor', title: 'Paspor (Opsional)', field: 'paspor_file' },
        { id: 'vaksin', title: 'Sertifikat Vaksin', field: 'vaksin_file' },
    ];

    return (
        <>
            <Head title="Dashboard Jamaah" />
            <div className="mx-auto flex h-full w-full max-w-6xl flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header Profile */}
                <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:flex-row md:items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">
                            Assalamu'alaikum, {userData?.name}!
                        </h2>
                        <p className="mt-1 text-slate-500">
                            Kelola data rombongan keluarga dan kelengkapan
                            dokumen keberangkatan Anda.
                        </p>
                    </div>
                    <Button
                        onClick={handleAddMemberClick}
                        className="bg-emerald-600 shadow-md hover:bg-emerald-700"
                    >
                        <Plus size={18} className="mr-2" /> Tambah Anggota
                    </Button>
                </div>

                <div className="grid items-start gap-6 md:grid-cols-3">
                    {/* Daftar Anggota Keluarga & Dokumen */}
                    <div className="space-y-6 md:col-span-2">
                        <div className="mb-2 flex items-center gap-2">
                            <Users className="text-emerald-600" size={24} />
                            <h3 className="text-xl font-bold text-slate-800">
                                Daftar Anggota Keluarga ({members.length})
                            </h3>
                        </div>

                        {members.length === 0 ? (
                            <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                                    <UserCircle2 size={32} />
                                </div>
                                <h4 className="text-lg font-bold text-slate-800">
                                    Belum Ada Anggota Keluarga
                                </h4>
                                <p className="mx-auto mt-2 mb-6 max-w-md text-slate-500">
                                    Silakan klik tombol di bawah ini untuk
                                    menambahkan data Anda sendiri (sebagai
                                    Kepala Keluarga) atau anggota keluarga
                                    lainnya.
                                </p>
                                <Button
                                    onClick={handleAddMemberClick}
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
                                                        {
                                                            member.hubungan_keluarga
                                                        }
                                                    </span>
                                                </h4>
                                                <p className="text-xs font-medium text-slate-500">
                                                    {member.jenis_kelamin} •
                                                    NIK: {member.nik || '-'}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handleEditMember(member)
                                            }
                                            className="flex shrink-0 items-center gap-1 rounded-xl border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                                        >
                                            <Pencil size={12} /> Edit Data
                                        </Button>
                                    </div>

                                    <div className="grid gap-4 p-4 sm:grid-cols-2">
                                        {docItems.map((doc) => {
                                            const isUploaded =
                                                !!member[doc.field];
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
                                                                  : 'Upload'}
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

                    {/* Informasi Paket */}
                    <div className="space-y-4 md:sticky md:top-6">
                        <h3 className="text-lg font-bold text-slate-800">
                            Paket Keberangkatan
                        </h3>

                        {userData?.bookings && userData.bookings.length > 0 ? (
                            <div className="space-y-4">
                                <div className="relative overflow-hidden rounded-2xl bg-slate-800 p-6 text-white shadow-lg shadow-slate-900/20">
                                    <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-amber-400/20 blur-2xl"></div>

                                    {userData.bookings.map((booking: any) => (
                                        <div
                                            key={booking.id}
                                            className="relative z-10 mb-4 last:mb-0"
                                        >
                                            <span className="rounded bg-amber-400 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-900 uppercase">
                                                Status:{' '}
                                                {booking.status_pembayaran}
                                            </span>
                                            <h4 className="mt-3 text-xl leading-tight font-bold">
                                                {booking.package?.name}
                                            </h4>

                                            <div className="mt-4 space-y-2">
                                                <div className="flex items-center justify-between border-b border-slate-700 pb-2 text-xs">
                                                    <span className="text-slate-400">
                                                        Keberangkatan
                                                    </span>
                                                    <span className="font-medium text-amber-200">
                                                        {booking.package
                                                            ?.departure_date ||
                                                            '-'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between border-b border-slate-700 pb-2 text-xs">
                                                    <span className="text-slate-400">
                                                        Maskapai
                                                    </span>
                                                    <span className="font-medium">
                                                        {booking.package
                                                            ?.airline || '-'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between pb-2 text-xs">
                                                    <span className="text-slate-400">
                                                        Dokumen
                                                    </span>
                                                    <span className="font-medium capitalize">
                                                        {booking.status_dokumen.replace(
                                                            '_',
                                                            ' ',
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {availablePackages.length > 0 && (
                                    <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                        <Label className="text-xs font-bold text-slate-700">
                                            Daftar Paket Keberangkatan Lain:
                                        </Label>
                                        <select
                                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-semibold shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                            onChange={(e) => {
                                                const pkgId = e.target.value;
                                                const pkg =
                                                    availablePackages.find(
                                                        (p) =>
                                                            p.id ===
                                                            parseInt(pkgId),
                                                    );
                                                if (pkg) {
                                                    handleSelectPackageToBook(
                                                        pkg,
                                                    );
                                                    e.target.value = ''; // reset
                                                }
                                            }}
                                            defaultValue=""
                                        >
                                            <option value="" disabled>
                                                -- Pilih Paket Baru --
                                            </option>
                                            {availablePackages.map((pkg) => (
                                                <option
                                                    key={pkg.id}
                                                    value={pkg.id}
                                                >
                                                    {pkg.name} (Sisa:{' '}
                                                    {pkg.available_seats} seat)
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="py-2 text-center">
                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                        <Clock size={24} />
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-800">
                                        Belum Ada Paket Keberangkatan
                                    </h4>
                                    <p className="mt-2 text-xs leading-relaxed text-slate-500">
                                        Silakan pilih salah satu paket
                                        keberangkatan yang tersedia di bawah ini
                                        untuk mendaftarkan diri Anda atau
                                        anggota keluarga.
                                    </p>
                                </div>

                                {availablePackages.length > 0 ? (
                                    <div className="space-y-2 border-t border-slate-100 pt-2">
                                        <Label className="text-xs font-bold text-slate-700">
                                            Pilih Paket Keberangkatan:
                                        </Label>
                                        <select
                                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-semibold shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                            onChange={(e) => {
                                                const pkgId = e.target.value;
                                                const pkg =
                                                    availablePackages.find(
                                                        (p) =>
                                                            p.id ===
                                                            parseInt(pkgId),
                                                    );
                                                if (pkg) {
                                                    handleSelectPackageToBook(
                                                        pkg,
                                                    );
                                                    e.target.value = ''; // reset
                                                }
                                            }}
                                            defaultValue=""
                                        >
                                            <option value="" disabled>
                                                -- Pilih Paket --
                                            </option>
                                            {availablePackages.map((pkg) => (
                                                <option
                                                    key={pkg.id}
                                                    value={pkg.id}
                                                >
                                                    {pkg.name} (Sisa:{' '}
                                                    {pkg.available_seats} seat)
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    <p className="text-center text-xs font-medium text-rose-500">
                                        Maaf, saat ini belum ada paket yang
                                        tersedia untuk dipesan.
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-4">
                            <h4 className="mb-1 text-sm font-bold text-amber-900">
                                Informasi Penting
                            </h4>
                            <p className="text-xs leading-relaxed text-amber-700/80">
                                Pastikan format dokumen berupa JPG, PNG, atau
                                PDF dengan ukuran maksimal 2MB per file.
                            </p>
                        </div>
                    </div>
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
                                {editingMember
                                    ? 'Form Edit Data Anggota Keluarga'
                                    : 'Form Tambah Anggota Keluarga'}
                            </h2>
                            <button
                                onClick={handleCloseAddMember}
                                className="relative z-10 cursor-pointer text-emerald-300 transition-colors hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form
                            onSubmit={submitMember}
                            className="flex-1 space-y-6 overflow-y-auto p-6 md:p-8"
                        >
                            {/* Section 1: Data Diri */}
                            <div>
                                <div className="border-slate-150 mb-4 border-b pb-2">
                                    <h4 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-emerald-800 uppercase">
                                        <span className="h-3 w-1.5 rounded-full bg-emerald-600"></span>
                                        1. Data Diri
                                    </h4>
                                </div>
                                <div className="grid gap-x-6 gap-y-4 md:grid-cols-2">
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
                                                setMemberData(
                                                    'nik',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1.5"
                                            maxLength={50}
                                            placeholder="Contoh: 3578..."
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
                                            <option value="Saudara">
                                                Saudara
                                            </option>
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
                            </div>

                            {/* Section 2: Data Kontak */}
                            <div>
                                <div className="border-slate-150 mb-4 border-b pb-2">
                                    <h4 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-emerald-800 uppercase">
                                        <span className="h-3 w-1.5 rounded-full bg-emerald-600"></span>
                                        2. Kontak & Komunikasi (Opsional)
                                    </h4>
                                </div>
                                <div className="grid gap-x-6 gap-y-4 md:grid-cols-2">
                                    <div>
                                        <Label>Nomor WhatsApp / HP</Label>
                                        <Input
                                            value={memberData.nohp}
                                            onChange={(e) =>
                                                setMemberData(
                                                    'nohp',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1.5"
                                            placeholder="Contoh: 08123456789"
                                        />
                                    </div>
                                    <div>
                                        <Label>Email</Label>
                                        <Input
                                            type="email"
                                            value={memberData.email}
                                            onChange={(e) =>
                                                setMemberData(
                                                    'email',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1.5"
                                            placeholder="Contoh: jamaah@email.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Data Paspor */}
                            <div>
                                <div className="border-slate-150 mb-4 border-b pb-2">
                                    <h4 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-emerald-800 uppercase">
                                        <span className="h-3 w-1.5 rounded-full bg-emerald-600"></span>
                                        3. Data Paspor (Opsional)
                                    </h4>
                                </div>
                                <div className="grid gap-x-6 gap-y-4 md:grid-cols-2">
                                    <div>
                                        <Label>Nomor Paspor</Label>
                                        <Input
                                            value={memberData.nomor_paspor}
                                            onChange={(e) =>
                                                setMemberData(
                                                    'nomor_paspor',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1.5"
                                            placeholder="Contoh: A1234567"
                                        />
                                    </div>
                                    <div>
                                        <Label>Kantor Imigrasi Penerbit</Label>
                                        <Input
                                            value={memberData.paspor_office}
                                            onChange={(e) =>
                                                setMemberData(
                                                    'paspor_office',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1.5"
                                            placeholder="Contoh: Kanim Surabaya"
                                        />
                                    </div>
                                    <div>
                                        <Label>Tanggal Dikeluarkan</Label>
                                        <Input
                                            type="date"
                                            value={memberData.paspor_issued}
                                            onChange={(e) =>
                                                setMemberData(
                                                    'paspor_issued',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1.5"
                                        />
                                    </div>
                                    <div>
                                        <Label>Tanggal Habis Berlaku</Label>
                                        <Input
                                            type="date"
                                            value={memberData.paspor_expiry}
                                            onChange={(e) =>
                                                setMemberData(
                                                    'paspor_expiry',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1.5"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: Status Dokumen Keberangkatan */}
                            <div>
                                <div className="border-slate-150 mb-4 border-b pb-2">
                                    <h4 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-emerald-800 uppercase">
                                        <span className="h-3 w-1.5 rounded-full bg-emerald-600"></span>
                                        4. Status Dokumen Keberangkatan
                                        (Opsional)
                                    </h4>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <Label>PP (Paspor Fisik)</Label>
                                        <select
                                            value={memberData.pp}
                                            onChange={(e) =>
                                                setMemberData(
                                                    'pp',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        >
                                            <option value="-">-</option>
                                            <option value="Pusat">Pusat</option>
                                            <option value="Pasuruan">
                                                Pasuruan
                                            </option>
                                            <option value="Mandiri">
                                                Mandiri
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label>VM (Vaksin Meningitis)</Label>
                                        <select
                                            value={memberData.vm}
                                            onChange={(e) =>
                                                setMemberData(
                                                    'vm',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        >
                                            <option value="-">-</option>
                                            <option value="Pusat">Pusat</option>
                                            <option value="Pasuruan">
                                                Pasuruan
                                            </option>
                                            <option value="Mandiri">
                                                Mandiri
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label>VP (Vaksin Polio)</Label>
                                        <select
                                            value={memberData.vp}
                                            onChange={(e) =>
                                                setMemberData(
                                                    'vp',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        >
                                            <option value="-">-</option>
                                            <option value="Pusat">Pusat</option>
                                            <option value="Pasuruan">
                                                Pasuruan
                                            </option>
                                            <option value="Mandiri">
                                                Mandiri
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCloseAddMember}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={savingMember}
                                    className="bg-emerald-600 hover:bg-emerald-700"
                                >
                                    {editingMember
                                        ? 'Simpan Perubahan'
                                        : 'Simpan Anggota & Masukkan Manifest'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Booking Paket */}
            {showBookModal && selectedBookPackage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                    <div className="flex max-h-[90vh] w-full max-w-2xl animate-in flex-col overflow-hidden rounded-3xl bg-white p-0 shadow-2xl duration-200 zoom-in-95">
                        <div className="relative flex items-center justify-between overflow-hidden bg-emerald-900 p-6 text-white">
                            <div className="absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500 opacity-20 blur-2xl"></div>
                            <h2 className="relative z-10 flex items-center gap-2 text-xl font-bold">
                                <Package size={20} className="text-amber-400" />
                                Konfirmasi Pendaftaran Paket
                            </h2>
                            <button
                                onClick={handleCancelBooking}
                                className="relative z-10 cursor-pointer text-emerald-300 transition-colors hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 space-y-6 overflow-y-auto p-6">
                            {/* Detail Paket */}
                            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-emerald-100/80 bg-emerald-50/50 p-4 sm:flex-row sm:items-center">
                                <div>
                                    <span className="text-emerald-805 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                                        Paket Pilihan
                                    </span>
                                    <h3 className="mt-1.5 text-lg font-bold text-slate-800">
                                        {selectedBookPackage.name}
                                    </h3>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Keberangkatan:{' '}
                                        <span className="font-semibold text-slate-700">
                                            {selectedBookPackage.departure_date
                                                ? new Date(
                                                      selectedBookPackage.departure_date,
                                                  ).toLocaleDateString(
                                                      'id-ID',
                                                      {
                                                          day: 'numeric',
                                                          month: 'long',
                                                          year: 'numeric',
                                                      },
                                                  )
                                                : '-'}
                                        </span>{' '}
                                        • Maskapai:{' '}
                                        <span className="font-semibold text-slate-700">
                                            {selectedBookPackage.airline || '-'}
                                        </span>
                                    </p>
                                </div>
                                <div className="text-right sm:text-right">
                                    <span className="block text-xs font-medium text-slate-400">
                                        Harga per Pax
                                    </span>
                                    <span className="text-xl font-extrabold text-emerald-800">
                                        Rp{' '}
                                        {selectedBookPackage.price
                                            ? parseInt(
                                                  selectedBookPackage.price,
                                              ).toLocaleString('id-ID')
                                            : '0'}
                                    </span>
                                </div>
                            </div>

                            {/* Pilihan Rombongan */}
                            <div>
                                <h4 className="mb-3 flex items-center gap-1.5 text-sm font-bold text-slate-800">
                                    <Users
                                        size={16}
                                        className="text-emerald-600"
                                    />
                                    Pilih Anggota Rombongan yang Didaftarkan
                                </h4>

                                {members.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                                        <p className="mb-4 text-sm text-slate-500">
                                            Anda belum menambahkan data
                                            keluarga/diri sendiri sebagai
                                            anggota rombongan.
                                        </p>
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                setShowBookModal(false);
                                                setShowAddMember(true);
                                            }}
                                            className="bg-emerald-600 hover:bg-emerald-700"
                                        >
                                            <Plus
                                                size={16}
                                                className="mr-1.5"
                                            />{' '}
                                            Tambah Anggota Pertama
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {members.map((member: any) => {
                                            const booked = isMemberBooked(
                                                member.id,
                                            );
                                            const isSelected =
                                                bookingData.jamaah_member_ids.includes(
                                                    member.id,
                                                );

                                            return (
                                                <label
                                                    key={member.id}
                                                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition-all select-none ${
                                                        booked
                                                            ? 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-60'
                                                            : isSelected
                                                              ? 'border-emerald-500 bg-emerald-50/30 shadow-sm'
                                                              : 'border-slate-200 bg-white hover:border-slate-300'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="checkbox"
                                                            disabled={booked}
                                                            checked={
                                                                isSelected ||
                                                                booked
                                                            }
                                                            onChange={(e) =>
                                                                handleMemberCheck(
                                                                    member.id,
                                                                    e.target
                                                                        .checked,
                                                                )
                                                            }
                                                            className="h-4.5 w-4.5 cursor-pointer rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                                        />
                                                        <div>
                                                            <span className="block text-sm font-bold text-slate-800">
                                                                {member.name}
                                                                <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-slate-700 uppercase">
                                                                    {
                                                                        member.hubungan_keluarga
                                                                    }
                                                                </span>
                                                            </span>
                                                            <span className="mt-0.5 block text-xs text-slate-400">
                                                                NIK:{' '}
                                                                {member.nik ||
                                                                    '-'}{' '}
                                                                • Lahir:{' '}
                                                                {member.tempat_lahir ||
                                                                    '-'}
                                                                ,{' '}
                                                                {member.tgl_lahir ||
                                                                    '-'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        {booked && (
                                                            <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase">
                                                                Sudah Terdaftar
                                                            </span>
                                                        )}
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="border-slate-150 flex justify-end gap-3 border-t bg-slate-50/50 p-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancelBooking}
                            >
                                Batal
                            </Button>
                            <Button
                                type="button"
                                disabled={
                                    bookingInProgress ||
                                    bookingData.jamaah_member_ids.length === 0
                                }
                                onClick={(e) => {
                                    e.preventDefault();
                                    postBooking('/dashboard/bookings', {
                                        preserveScroll: true,
                                        onSuccess: () => {
                                            setShowBookModal(false);
                                            // Clear URL parameters
                                            window.history.replaceState(
                                                {},
                                                document.title,
                                                window.location.pathname,
                                            );
                                        },
                                    });
                                }}
                                className="bg-emerald-600 px-6 font-bold shadow-md hover:bg-emerald-700"
                            >
                                {bookingInProgress
                                    ? 'Memproses...'
                                    : `Daftarkan ${bookingData.jamaah_member_ids.length} Jamaah`}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard Jamaah',
            href: dashboard(),
        },
    ],
};
