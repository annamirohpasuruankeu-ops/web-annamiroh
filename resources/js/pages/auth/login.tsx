import { Head, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import Navbar from '@/components/navbar';
import { Mail, Lock, ArrowRight, Package } from 'lucide-react';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    const packageId =
        typeof window !== 'undefined'
            ? (new URLSearchParams(window.location.search).get('package_id') ??
              '')
            : '';

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
        package_id: packageId,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store(), {
            onFinish: () => reset('password'),
        });
    };

    const registerUrl = packageId
        ? register.url({ query: { package_id: packageId } })
        : register().url;

    const csWhatsappMessage = encodeURIComponent(
        "Assalamu'alaikum Admin Annamiroh Travel, saya membutuhkan bantuan terkait login atau akses akun di website Annamiroh. Mohon bantuannya. Terima kasih.",
    );
    const csWhatsappUrl = `https://wa.me/6285790721167?text=${csWhatsappMessage}`;

    return (
        <div className="flex min-h-screen w-full flex-col bg-white font-sans selection:bg-emerald-200 selection:text-emerald-900">
            <Head title="Log in" />

            {/* 1. Header / Navbar di paling atas */}
            <Navbar />

            {/* 2. Container Tampilan Split (Left Hero + Right Form) */}
            <div className="flex w-full flex-1 pt-16 md:pt-20">
                {/* Left side - Branding/Hero */}
                <div className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-emerald-900 p-16 lg:flex">
                    {/* Decorative elements */}
                    <div className="pointer-events-none absolute top-0 left-0 h-full w-full">
                        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-800/40 blur-3xl" />
                        <div className="absolute right-[-10%] bottom-[-10%] h-[400px] w-[400px] rounded-full bg-amber-600/20 blur-3xl" />
                    </div>

                    <div className="relative z-10 max-w-xl text-white">
                        <h1 className="mb-8 text-5xl leading-tight font-bold">
                            Layanan perjalanan umrah dan haji yang amanah.
                        </h1>
                        <p className="text-xl leading-relaxed text-emerald-100/80">
                            Silakan masuk untuk mengakses panel Anda, mengelola
                            pendaftaran jamaah, paket keberangkatan, dan
                            laporan.
                        </p>
                    </div>
                </div>

                {/* Right side - Form */}
                <div className="flex w-full items-center justify-center bg-gray-50/30 p-6 sm:p-12 lg:w-1/2 xl:p-24">
                    <div className="w-full max-w-md">
                        <div className="mb-10 flex items-center justify-center lg:hidden">
                            <img
                                src="/images/LOGO 2 CABANG.png"
                                alt="Annamirah Travel"
                                className="h-16 w-auto object-contain"
                            />
                        </div>

                        <div className="mb-10 text-center lg:text-left">
                            <h2 className="mb-2.5 text-3xl font-bold text-gray-900">
                                Selamat Datang
                            </h2>
                            <p className="text-lg text-gray-500">
                                Silakan masukkan detail akun Anda untuk masuk.
                            </p>

                            {status && (
                                <div className="mt-4 text-sm font-medium text-green-600">
                                    {status}
                                </div>
                            )}

                            {packageId && (
                                <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                                    <Package
                                        size={16}
                                        className="flex-shrink-0 text-emerald-600"
                                    />
                                    <p className="text-sm text-emerald-800">
                                        Anda akan langsung diarahkan ke
                                        pemesanan paket setelah masuk.
                                    </p>
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                    htmlFor="email"
                                >
                                    Alamat Email / Nomor HP
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                        <Mail
                                            size={20}
                                            className="text-gray-400"
                                        />
                                    </div>
                                    <input
                                        id="email"
                                        type="text"
                                        required
                                        autoFocus
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        className="block w-full rounded-xl border border-gray-200 bg-white py-3.5 pr-4 pl-11 leading-5 placeholder-gray-400 shadow-sm transition-all focus:border-transparent focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                        placeholder="email@example.com atau 08123456789"
                                    />
                                </div>
                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label
                                        className="block text-sm font-medium text-gray-700"
                                        htmlFor="password"
                                    >
                                        Password
                                    </label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-500"
                                        >
                                            Lupa password?
                                        </TextLink>
                                    )}
                                </div>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                        <Lock
                                            size={20}
                                            className="text-gray-400"
                                        />
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        required
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        className="block w-full rounded-xl border border-gray-200 bg-white py-3.5 pr-4 pl-11 leading-5 placeholder-gray-400 shadow-sm transition-all focus:border-transparent focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <InputError
                                    message={errors.password}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData('remember', e.target.checked)
                                    }
                                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-emerald-600 transition-colors focus:ring-emerald-500"
                                    style={{
                                        accentColor: 'var(--color-emerald-600)',
                                    }}
                                />
                                <label
                                    htmlFor="remember"
                                    className="ml-2.5 block cursor-pointer text-sm text-gray-700 select-none"
                                >
                                    Ingat saya selama 30 hari
                                </label>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="group mt-2 flex w-full items-center justify-center rounded-xl border border-transparent bg-emerald-600 px-4 py-4 text-[15px] font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {processing ? (
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    ) : (
                                        <>
                                            Masuk ke Dashboard
                                            <ArrowRight
                                                size={18}
                                                className="ml-2 transition-transform group-hover:translate-x-1.5"
                                            />
                                        </>
                                    )}
                                </button>

                                <a
                                    href={csWhatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex w-full items-center justify-center rounded-xl border border-emerald-600 bg-white px-4 py-4 text-[15px] font-semibold text-emerald-700 shadow-sm transition-all hover:bg-emerald-50/50 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none"
                                >
                                    <svg
                                        className="mr-2 h-5 w-5 fill-current text-emerald-600 transition-transform group-hover:scale-110"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    Hubungi CS / ADMIN
                                </a>
                            </div>
                        </form>

                        <p className="mt-10 text-center text-sm text-gray-500">
                            Belum memiliki akun?{' '}
                            <TextLink
                                href={registerUrl}
                                className="font-semibold text-emerald-600 transition-colors hover:text-emerald-500"
                            >
                                Daftar sekarang
                            </TextLink>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

Login.layout = (page: React.ReactNode) => <>{page}</>;
