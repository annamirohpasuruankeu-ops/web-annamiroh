import { Head, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { useState } from 'react';
import {
    LayoutGrid,
    ArrowRight,
    User,
    Users,
    Mail,
    Lock,
    Phone,
    MapPin,
    Calendar,
    Home,
    Eye,
    EyeOff,
    Check,
    Package,
    AlertCircle,
    BookOpen,
    Ban,
    Info,
    Fingerprint,
    Globe,
} from 'lucide-react';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
    registerAsAgent?: boolean;
    packages?: any[];
};

export default function Register({
    passwordRules,
    registerAsAgent = false,
    packages = [],
}: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);

    const params = new URLSearchParams(window.location.search);
    const packageId = params.get('package_id') ?? '';
    const isAgentFlow = registerAsAgent || params.get('role') === 'agen';
    const initialRole = isAgentFlow ? 'agen' : 'user';

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        no_wa: '',
        tempat_lahir: '',
        tgl_lahir: '',
        alamat: '',
        role: initialRole as 'user' | 'agen',
        package_id: packageId,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!agreeTerms) {
            alert(
                isAgentFlow
                    ? 'Anda harus menyetujui SOP Keagenan dan Ketentuan Larangan Agen Annamirah Travel.'
                    : 'Anda harus menyetujui Persyaratan Jamaah Mandiri Annamirah Travel.',
            );
            return;
        }
        post(store(), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const loginUrl = packageId
        ? login.url({ query: { package_id: packageId } })
        : login().url;

    return (
        <div className="flex min-h-screen w-full bg-white font-sans selection:bg-emerald-200 selection:text-emerald-900">
            <Head
                title={isAgentFlow ? 'Daftar Agen Resmi' : 'Daftar Akun Baru'}
            />

            {/* Left side - Branding/Hero */}
            <div className="relative hidden w-[45%] flex-shrink-0 items-center justify-center overflow-hidden bg-emerald-900 p-16 lg:flex">
                {/* Decorative elements */}
                <div className="pointer-events-none absolute top-0 left-0 h-full w-full">
                    <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-800/40 blur-3xl" />
                    <div className="absolute right-[-10%] bottom-[-10%] h-[400px] w-[400px] rounded-full bg-amber-600/20 blur-3xl" />
                    <div className="absolute top-[40%] left-[60%] h-[200px] w-[200px] rounded-full bg-emerald-600/20 blur-2xl" />
                </div>

                {/* Geometric pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />

                <div className="relative z-10 max-w-xl text-white">
                    <div className="mb-10 flex items-center">
                        <img
                            src="/images/LOGO 2 CABANG.png"
                            alt="Annamirah Travel"
                            className="h-20 w-auto object-contain"
                        />
                    </div>
                    <h1 className="mb-8 text-5xl leading-tight font-bold">
                        Bergabunglah bersama kami dalam perjalanan suci.
                    </h1>
                    <p className="mb-10 text-xl leading-relaxed text-emerald-100/80">
                        Daftar sekarang untuk mengakses paket umrah & haji
                        terbaik, atau jadilah mitra agen kami.
                    </p>

                    {/* Feature highlights */}
                    <div className="space-y-4">
                        {[
                            'Paket umrah & haji terpercaya',
                            'Bimbingan manasik profesional',
                            'Kemitraan agen yang menguntungkan',
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="flex items-center space-x-3"
                            >
                                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/20">
                                    <Check
                                        size={14}
                                        className="text-amber-400"
                                    />
                                </div>
                                <span className="text-base text-emerald-100/90">
                                    {feature}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="flex min-h-screen w-full items-start justify-center overflow-y-auto bg-gray-50/30 p-6 sm:p-10 lg:w-[55%] xl:p-16">
                <div className="w-full max-w-xl py-8">
                    {/* Mobile branding */}
                    <div className="mb-8 flex items-center justify-center lg:hidden">
                        <img
                            src="/images/LOGO 2 CABANG.png"
                            alt="Annamirah Travel"
                            className="h-16 w-auto object-contain"
                        />
                    </div>

                    <div className="mb-8 text-center lg:text-left">
                        <h2 className="mb-2 text-3xl font-bold text-gray-900">
                            {isAgentFlow
                                ? 'Pendaftaran Agen Cabang'
                                : 'Pendaftaran Jamaah Mandiri'}
                        </h2>
                        <p className="text-lg text-gray-500">
                            {isAgentFlow
                                ? 'Isi data diri Anda untuk mengajukan kemitraan agen resmi.'
                                : 'Isi data diri Anda untuk membuat akun jamaah mandiri.'}
                        </p>
                        {packageId && (
                            <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                                <Package
                                    size={16}
                                    className="flex-shrink-0 text-emerald-600"
                                />
                                <p className="text-sm text-emerald-800">
                                    Setelah akun dibuat, Anda akan langsung
                                    diarahkan ke halaman pemesanan paket.
                                </p>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label
                                className="mb-2 block text-sm font-medium text-gray-700"
                                htmlFor="name"
                            >
                                Nama Lengkap
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                    <User size={18} className="text-gray-400" />
                                </div>
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    className="block w-full rounded-xl border border-gray-200 bg-white py-3 pr-4 pl-11 text-sm leading-5 placeholder-gray-400 shadow-sm transition-all focus:border-transparent focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    placeholder="Sesuai KTP"
                                />
                            </div>
                            <InputError
                                message={errors.name}
                                className="mt-2"
                            />
                        </div>

                        {/* Phone & Email - two columns */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                    htmlFor="no_wa"
                                >
                                    Nomor WhatsApp
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                        <Phone
                                            size={18}
                                            className="text-gray-400"
                                        />
                                    </div>
                                    <input
                                        id="no_wa"
                                        type="text"
                                        required
                                        value={data.no_wa}
                                        onChange={(e) =>
                                            setData('no_wa', e.target.value)
                                        }
                                        className="block w-full rounded-xl border border-gray-200 bg-white py-3 pr-4 pl-11 text-sm leading-5 placeholder-gray-400 shadow-sm transition-all focus:border-transparent focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                        placeholder="08123456789"
                                    />
                                </div>
                                <InputError
                                    message={errors.no_wa}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <label
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                    htmlFor="email"
                                >
                                    Alamat Email
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                        <Mail
                                            size={18}
                                            className="text-gray-400"
                                        />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        className="block w-full rounded-xl border border-gray-200 bg-white py-3 pr-4 pl-11 text-sm leading-5 placeholder-gray-400 shadow-sm transition-all focus:border-transparent focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                        placeholder="email@example.com"
                                    />
                                </div>
                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        {/* Tempat & Tanggal Lahir - two columns */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                    htmlFor="tempat_lahir"
                                >
                                    Tempat Lahir
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                        <MapPin
                                            size={18}
                                            className="text-gray-400"
                                        />
                                    </div>
                                    <input
                                        id="tempat_lahir"
                                        type="text"
                                        required
                                        value={data.tempat_lahir}
                                        onChange={(e) =>
                                            setData(
                                                'tempat_lahir',
                                                e.target.value,
                                            )
                                        }
                                        className="block w-full rounded-xl border border-gray-200 bg-white py-3 pr-4 pl-11 text-sm leading-5 placeholder-gray-400 shadow-sm transition-all focus:border-transparent focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                        placeholder="Kota Kelahiran"
                                    />
                                </div>
                                <InputError
                                    message={errors.tempat_lahir}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <label
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                    htmlFor="tgl_lahir"
                                >
                                    Tanggal Lahir
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                        <Calendar
                                            size={18}
                                            className="text-gray-400"
                                        />
                                    </div>
                                    <input
                                        id="tgl_lahir"
                                        type="date"
                                        required
                                        value={data.tgl_lahir}
                                        onChange={(e) =>
                                            setData('tgl_lahir', e.target.value)
                                        }
                                        className="block w-full rounded-xl border border-gray-200 bg-white py-3 pr-4 pl-11 text-sm leading-5 placeholder-gray-400 shadow-sm transition-all focus:border-transparent focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    />
                                </div>
                                <InputError
                                    message={errors.tgl_lahir}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        {/* Alamat */}
                        <div>
                            <label
                                className="mb-2 block text-sm font-medium text-gray-700"
                                htmlFor="alamat"
                            >
                                Alamat Lengkap
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                    <Home size={18} className="text-gray-400" />
                                </div>
                                <input
                                    id="alamat"
                                    type="text"
                                    required
                                    value={data.alamat}
                                    onChange={(e) =>
                                        setData('alamat', e.target.value)
                                    }
                                    className="block w-full rounded-xl border border-gray-200 bg-white py-3 pr-4 pl-11 text-sm leading-5 placeholder-gray-400 shadow-sm transition-all focus:border-transparent focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    placeholder="Alamat domisili saat ini"
                                />
                            </div>
                            <InputError
                                message={errors.alamat}
                                className="mt-2"
                            />
                        </div>

                        {/* Password fields - two columns */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                    htmlFor="password"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                        <Lock
                                            size={18}
                                            className="text-gray-400"
                                        />
                                    </div>
                                    <input
                                        id="password"
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        required
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        className="block w-full rounded-xl border border-gray-200 bg-white py-3 pr-11 pl-11 text-sm leading-5 placeholder-gray-400 shadow-sm transition-all focus:border-transparent focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                        placeholder="Min. 8 karakter"
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 transition-colors hover:text-gray-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>
                                <InputError
                                    message={errors.password}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <label
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                    htmlFor="password_confirmation"
                                >
                                    Konfirmasi Password
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                        <Lock
                                            size={18}
                                            className="text-gray-400"
                                        />
                                    </div>
                                    <input
                                        id="password_confirmation"
                                        type={
                                            showConfirmPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        required
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                'password_confirmation',
                                                e.target.value,
                                            )
                                        }
                                        className="block w-full rounded-xl border border-gray-200 bg-white py-3 pr-11 pl-11 text-sm leading-5 placeholder-gray-400 shadow-sm transition-all focus:border-transparent focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                        placeholder="Ulangi password"
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword,
                                            )
                                        }
                                        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 transition-colors hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>
                                <InputError
                                    message={errors.password_confirmation}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        {/* SOP / Persyaratan Card */}
                        {isAgentFlow ? (
                            <div className="animate-in space-y-4 rounded-2xl border border-amber-200 bg-amber-50/50 p-5 duration-300 fade-in slide-in-from-bottom-2">
                                <div className="flex items-center gap-2 border-b border-amber-200 pb-2 text-sm font-extrabold text-amber-800">
                                    <BookOpen size={18} />
                                    <span>SOP KEAGENAN ANNAMIRAH TRAVEL</span>
                                </div>
                                <ul className="list-decimal space-y-2 pl-4 text-xs leading-relaxed font-semibold text-amber-900/80">
                                    <li>
                                        Setiap pendaftaran Booking Order oleh
                                        Agen disarankan untuk mendaftarkan
                                        minimal 10 jamaah (sebagai target
                                        kemitraan).
                                    </li>
                                    <li>
                                        Melakukan pendataan jamaah secara
                                        lengkap (KTP, KK, Paspor, Buku Vaksin)
                                        melalui sistem paling lambat H-45
                                        sebelum tanggal keberangkatan.
                                    </li>
                                    <li>
                                        Menyelenggarakan bimbingan awal atau
                                        manasik dasar secara mandiri kepada
                                        jamaah yang direkrut.
                                    </li>
                                    <li>
                                        Seluruh dana pembayaran jamaah wajib
                                        ditransfer langsung ke rekening resmi
                                        Annamirah Travel.
                                    </li>
                                </ul>

                                <div className="flex items-center gap-2 border-b border-amber-200 pt-2 pb-2 text-sm font-extrabold text-red-800">
                                    <Ban size={18} />
                                    <span>KETENTUAN LARANGAN AGEN</span>
                                </div>
                                <ul className="list-disc space-y-2 pl-4 text-xs leading-relaxed font-semibold text-red-900/80">
                                    <li>
                                        Dilarang menjual/menawarkan paket di
                                        bawah harga batas minimum resmi yang
                                        ditetapkan Kantor Pusat.
                                    </li>
                                    <li>
                                        Dilarang menawarkan atau mempromosikan
                                        produk/paket agensi travel lain kepada
                                        jamaah Annamirah Travel.
                                    </li>
                                    <li>
                                        Dilarang memungut biaya tambahan liar
                                        tanpa persetujuan tertulis dari Kantor
                                        Pusat.
                                    </li>
                                    <li>
                                        Dilarang melakukan manipulasi data
                                        jamaah atau menyalahgunakan berkas
                                        dokumen keberangkatan.
                                    </li>
                                </ul>

                                <div className="flex items-start gap-2.5 rounded-xl border border-amber-300/60 bg-amber-100/50 p-3">
                                    <Info
                                        size={16}
                                        className="mt-0.5 flex-shrink-0 text-amber-700"
                                    />
                                    <p className="text-xs leading-normal font-bold text-amber-800">
                                        Pendaftaran agen memerlukan verifikasi &
                                        persetujuan Admin. Status akun Anda akan
                                        aktif setelah disetujui.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 duration-300 fade-in slide-in-from-bottom-2">
                                <div className="flex items-center gap-2 border-b border-emerald-200 pb-2 text-sm font-extrabold text-emerald-800">
                                    <AlertCircle size={18} />
                                    <span>
                                        PERSYARATAN & KETENTUAN JAMAAH MANDIRI
                                    </span>
                                </div>
                                <ul className="list-disc space-y-2.5 pl-4 text-xs leading-relaxed font-semibold text-emerald-900/80">
                                    <li>
                                        <strong className="text-emerald-950 underline">
                                            Batas Pelunasan:
                                        </strong>{' '}
                                        Pembayaran dan pelunasan biaya paket
                                        wajib diselesaikan paling lambat{' '}
                                        <span className="text-red-650 font-black uppercase">
                                            H-30
                                        </span>{' '}
                                        sebelum tanggal keberangkatan.
                                    </li>
                                    <li>
                                        <strong className="text-emerald-950 underline">
                                            Ketentuan Harga:
                                        </strong>{' '}
                                        Harga paket sewaktu-waktu dapat berubah
                                        menyesuaikan fluktuasi biaya tiket
                                        pesawat dan akomodasi hotel di Arab
                                        Saudi.
                                    </li>
                                    <li>
                                        <strong className="text-emerald-950 underline">
                                            Kelengkapan Dokumen:
                                        </strong>{' '}
                                        Berkas dokumen asli (Paspor, KTP, KK,
                                        Buku Vaksin Meningitis) wajib diserahkan
                                        paling lambat{' '}
                                        <span className="text-emerald-950">
                                            H-45
                                        </span>{' '}
                                        sebelum berangkat.
                                    </li>
                                </ul>
                            </div>
                        )}

                        {/* Agreement Checkbox */}
                        <div className="flex items-start gap-3 p-1">
                            <input
                                id="agreeTerms"
                                type="checkbox"
                                checked={agreeTerms}
                                onChange={(e) =>
                                    setAgreeTerms(e.target.checked)
                                }
                                className={`h-5 w-5 rounded-md border-gray-300 transition-colors focus:ring-offset-2 ${
                                    isAgentFlow
                                        ? 'text-amber-500 focus:ring-amber-500'
                                        : 'text-emerald-600 focus:ring-emerald-600'
                                } mt-0.5 cursor-pointer`}
                            />
                            <label
                                htmlFor="agreeTerms"
                                className="cursor-pointer text-xs leading-relaxed font-bold text-gray-600 select-none"
                            >
                                {isAgentFlow
                                    ? 'Saya menyatakan telah membaca, memahami, dan berkomitmen mematuhi SOP Keagenan serta ketentuan Larangan Agen.'
                                    : 'Saya menyetujui seluruh Persyaratan Jamaah Mandiri, termasuk batas pelunasan H-30 dan kebijakan harga dinamis.'}{' '}
                                <span className="text-red-500">*</span>
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            className={`group mt-3 flex w-full items-center justify-center rounded-xl border border-transparent px-4 py-3.5 text-[15px] font-semibold text-white shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70 ${
                                data.role === 'agen'
                                    ? 'bg-amber-500 shadow-amber-500/25 hover:bg-amber-600 focus:ring-amber-500'
                                    : 'bg-emerald-600 shadow-emerald-500/25 hover:bg-emerald-700 focus:ring-emerald-500'
                            }`}
                        >
                            {processing ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            ) : (
                                <>
                                    {data.role === 'agen'
                                        ? 'Daftar sebagai Agen'
                                        : 'Buat Akun Saya'}
                                    <ArrowRight
                                        size={18}
                                        className="ml-2 transition-transform group-hover:translate-x-1.5"
                                    />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-500">
                        Sudah memiliki akun?{' '}
                        <TextLink
                            href={loginUrl}
                            className="font-semibold text-emerald-600 transition-colors hover:text-emerald-500"
                        >
                            Masuk di sini
                        </TextLink>
                    </p>
                </div>
            </div>
        </div>
    );
}

Register.layout = (page: React.ReactNode) => <>{page}</>;
