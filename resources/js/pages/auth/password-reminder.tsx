import { Head, Link, useForm } from '@inertiajs/react';
import { KeyRound, ShieldCheck } from 'lucide-react';
import InputError from '@/components/input-error';
import Navbar from '@/components/navbar';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface Props {
    passwordRules: string;
}

export default function PasswordReminder({ passwordRules }: Props) {
    const { data, setData, put, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        put('/password-reminder', {
            preserveScroll: true,
            onFinish: () =>
                reset('current_password', 'password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Head title="Amankan Akun Anda" />
            <Navbar />

            <main className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 pt-28 pb-12 sm:px-6">
                <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid-cols-[0.85fr_1.15fr]">
                    <div className="hidden bg-emerald-900 p-10 text-white lg:flex lg:flex-col lg:justify-center">
                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400 text-emerald-950">
                            <ShieldCheck size={30} />
                        </div>
                        <h1 className="text-3xl font-extrabold">
                            Amankan Akun Anda
                        </h1>
                        <p className="mt-4 leading-relaxed text-emerald-100">
                            Anda masih menggunakan password awal. Kami
                            menyarankan Anda menggantinya untuk menjaga keamanan
                            akun.
                        </p>
                    </div>

                    <div className="p-6 sm:p-10">
                        <div className="mb-7 lg:hidden">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
                                <KeyRound size={25} />
                            </div>
                            <h1 className="text-2xl font-extrabold text-slate-900">
                                Amankan Akun Anda
                            </h1>
                        </div>

                        <p className="mb-7 text-sm leading-relaxed text-slate-500">
                            Ganti password sekarang atau lewati untuk sementara.
                            Selama password awal belum diganti, halaman ini akan
                            muncul kembali setelah Anda login berikutnya.
                        </p>

                        <form onSubmit={submit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="current_password">
                                    Password saat ini
                                </Label>
                                <PasswordInput
                                    id="current_password"
                                    value={data.current_password}
                                    onChange={(e) =>
                                        setData(
                                            'current_password',
                                            e.target.value,
                                        )
                                    }
                                    autoComplete="current-password"
                                    placeholder="Masukkan password saat ini"
                                />
                                <InputError message={errors.current_password} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password baru</Label>
                                <PasswordInput
                                    id="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    autoComplete="new-password"
                                    placeholder="Masukkan password baru"
                                    passwordrules={passwordRules}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">
                                    Konfirmasi password baru
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                    autoComplete="new-password"
                                    placeholder="Ulangi password baru"
                                    passwordrules={passwordRules}
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <div className="flex flex-col gap-3 pt-2 sm:flex-row-reverse">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 rounded-xl bg-emerald-700 py-3 font-bold text-white hover:bg-emerald-800"
                                >
                                    {processing
                                        ? 'Menyimpan...'
                                        : 'Ganti Password Sekarang'}
                                </Button>
                                <Button
                                    asChild
                                    type="button"
                                    variant="outline"
                                    className="flex-1 rounded-xl py-3 font-bold"
                                >
                                    <Link href="/admin/packages">
                                        Lewati untuk Saat Ini
                                    </Link>
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}

PasswordReminder.layout = (page: React.ReactNode) => <>{page}</>;
