import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Printer, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function RegistrationForm({ booking }: { booking: any }) {
    useEffect(() => {
        // Automatically open the print dialog when the page loads
        const timer = setTimeout(() => {
            window.print();
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const handlePrint = () => {
        window.print();
    };

    // Date formatting helper
    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '-';
        try {
            return new Date(dateStr).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });
        } catch (e) {
            return dateStr;
        }
    };

    // Calculate Age helper
    const calculateAge = (dobString: string | null) => {
        if (!dobString) return '-';
        try {
            const dob = new Date(dobString);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const m = today.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                age--;
            }
            return age >= 0 ? `${age} Tahun` : '-';
        } catch (e) {
            return '-';
        }
    };

    const jamaah = booking.jamaah_member || {};
    const packageInfo = booking.package || {};
    const user = booking.user || {};
    const profile = user.profile || {};

    const pageTitle = `Formulir Pendaftaran - ${jamaah.name || user.name}`;

    return (
        <div className="min-h-screen bg-slate-100 px-4 py-8 font-sans text-slate-800 sm:px-6 lg:px-8 print:bg-white print:px-0 print:py-0">
            <Head title={pageTitle} />

            {/* Print styles */}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                @media print {
                    body {
                        background-color: #fff !important;
                        color: #000 !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                    .print-shadow-none {
                        box-shadow: none !important;
                        border: none !important;
                    }
                    .print-border-black {
                        border-color: #000 !important;
                    }
                }
            `,
                }}
            />

            {/* Action Bar */}
            <div className="no-print mx-auto mb-6 flex max-w-4xl items-center justify-between">
                <Link
                    href={`/admin/orders/${booking.order_id}/isi-jamaah`}
                    className="inline-flex items-center text-sm font-semibold text-slate-600 transition-colors hover:text-emerald-600"
                >
                    <ArrowLeft size={16} className="mr-1.5" /> Kembali ke Input
                    Jamaah
                </Link>
                <Button
                    onClick={handlePrint}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 font-bold text-white shadow-md transition-all hover:bg-blue-700"
                >
                    <Printer size={16} /> Cetak Formulir
                </Button>
            </div>

            {/* Paper Container */}
            <div className="print-shadow-none mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-xl md:p-12 print:border-none print:p-0">
                {/* Header */}
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-6 print:border-black">
                    <div className="flex items-center gap-4">
                        <img
                            src="/images/LOGO 2 CABANG.png"
                            alt="Logo Annamirah"
                            className="h-16 w-auto object-contain"
                            onError={(e) => {
                                // fallback if image fails to load in development
                                (e.target as HTMLElement).style.display =
                                    'none';
                            }}
                        />
                        <div>
                            <h1 className="text-xl font-black tracking-tight text-emerald-800 print:text-black">
                                PT ANNAMIROH JUANDA TRAVEL
                            </h1>
                            <p className="max-w-md text-[10px] leading-normal font-bold text-slate-500 print:text-slate-800">
                                Kawasan Ruko Mutiara Blok A/12, Jl. Raya Juanda,
                                Sidoarjo, Jawa Timur
                                <br />
                                Telp: 0812-3456-789 | Email:
                                info@annamirohtravel.com
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="rounded bg-emerald-100 px-3 py-1 text-xs font-black tracking-widest text-emerald-800 uppercase print:border print:border-black print:text-black">
                            FORM PENDAFTARAN
                        </span>
                        <p className="mt-2 text-[10px] font-bold text-slate-400">
                            Booking ID: #{booking.id}
                        </p>
                    </div>
                </div>

                <div className="my-6 text-center">
                    <h2 className="text-lg font-black tracking-wider text-slate-900 uppercase">
                        FORMULIR PENDAFTARAN PESERTA UMRAH / HAJI
                    </h2>
                </div>

                {/* Section 1: Data Pribadi */}
                <div className="mb-6">
                    <h3 className="mb-3 rounded bg-slate-800 px-3 py-1.5 text-xs font-black tracking-wider text-white uppercase print:bg-black print:text-white">
                        I. DATA PRIBADI JAMAAH
                    </h3>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                        <div className="grid grid-cols-3 border-b border-slate-100 py-1">
                            <span className="col-span-1 font-bold text-slate-500">
                                Nama Lengkap
                            </span>
                            <span className="col-span-2 font-extrabold text-slate-900">
                                : {jamaah.name || user.name || '-'}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 border-b border-slate-100 py-1">
                            <span className="col-span-1 font-bold text-slate-500">
                                Nomor NIK (KTP)
                            </span>
                            <span className="col-span-2 font-semibold text-slate-900">
                                : {jamaah.nik || '-'}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 border-b border-slate-100 py-1">
                            <span className="col-span-1 font-bold text-slate-500">
                                Jenis Kelamin
                            </span>
                            <span className="col-span-2 font-semibold text-slate-900">
                                : {jamaah.jenis_kelamin || '-'}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 border-b border-slate-100 py-1">
                            <span className="col-span-1 font-bold text-slate-500">
                                Tempat/Tgl Lahir
                            </span>
                            <span className="col-span-2 font-semibold text-slate-900">
                                : {jamaah.tempat_lahir || '-'},{' '}
                                {formatDate(jamaah.tgl_lahir)}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 border-b border-slate-100 py-1">
                            <span className="col-span-1 font-bold text-slate-500">
                                Umur
                            </span>
                            <span className="col-span-2 font-semibold text-slate-900">
                                : {calculateAge(jamaah.tgl_lahir)}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 border-b border-slate-100 py-1">
                            <span className="col-span-1 font-bold text-slate-500">
                                No. WhatsApp/HP
                            </span>
                            <span className="col-span-2 font-semibold text-slate-900">
                                : {jamaah.no_hp || profile.no_wa || '-'}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 border-b border-slate-100 py-1">
                            <span className="col-span-1 font-bold text-slate-500">
                                Email
                            </span>
                            <span className="col-span-2 font-semibold text-slate-900">
                                : {jamaah.email || user.email || '-'}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 border-b border-slate-100 py-1">
                            <span className="col-span-1 font-bold text-slate-500">
                                Hubungan Keluarga
                            </span>
                            <span className="col-span-2 font-semibold text-slate-900">
                                :{' '}
                                {jamaah.hubungan_keluarga ||
                                    'Utama (Pendaftar)'}
                            </span>
                        </div>
                        <div className="col-span-2 grid grid-cols-3 border-b border-slate-100 py-1">
                            <span className="col-span-1 font-bold text-slate-500">
                                Alamat Lengkap
                            </span>
                            <span className="col-span-2 font-semibold text-slate-900">
                                : {jamaah.alamat || profile.alamat || '-'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Section 2: Data Paspor */}
                <div className="mb-6">
                    <h3 className="mb-3 rounded bg-slate-800 px-3 py-1.5 text-xs font-black tracking-wider text-white uppercase print:bg-black print:text-white">
                        II. DATA PASPOR & DOKUMEN PENDUKUNG
                    </h3>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                        <div className="grid grid-cols-3 border-b border-slate-100 py-1">
                            <span className="col-span-1 font-bold text-slate-500">
                                Nomor Paspor
                            </span>
                            <span className="col-span-2 font-extrabold text-slate-900">
                                : {jamaah.nomor_paspor || '-'}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 border-b border-slate-100 py-1">
                            <span className="col-span-1 font-bold text-slate-500">
                                Kantor Penerbit
                            </span>
                            <span className="col-span-2 font-semibold text-slate-900">
                                : {jamaah.paspor_office || '-'}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 border-b border-slate-100 py-1">
                            <span className="col-span-1 font-bold text-slate-500">
                                Tanggal Dikeluarkan
                            </span>
                            <span className="col-span-2 font-semibold text-slate-900">
                                : {formatDate(jamaah.paspor_issued)}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 border-b border-slate-100 py-1">
                            <span className="col-span-1 font-bold text-slate-500">
                                Tanggal Habis Berlaku
                            </span>
                            <span className="col-span-2 font-semibold text-slate-900">
                                : {formatDate(jamaah.paspor_expiry)}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 border-b border-slate-100 py-1">
                            <span className="col-span-1 font-bold text-slate-500">
                                Penyerahan Paspor (PP)
                            </span>
                            <span className="col-span-2 font-bold text-emerald-700 print:text-black">
                                : {booking.pp || '-'}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 border-b border-slate-100 py-1">
                            <span className="col-span-1 font-bold text-slate-500">
                                Vaksin Meningitis (VM)
                            </span>
                            <span className="col-span-2 font-bold text-emerald-700 print:text-black">
                                : {booking.vm || '-'}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 border-b border-slate-100 py-1">
                            <span className="col-span-1 font-bold text-slate-500">
                                Vaksin Polio (VP)
                            </span>
                            <span className="col-span-2 font-bold text-emerald-700 print:text-black">
                                : {booking.vp || '-'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Section 3: Data Paket */}
                <div className="mb-6">
                    <h3 className="mb-3 rounded bg-slate-800 px-3 py-1.5 text-xs font-black tracking-wider text-white uppercase print:bg-black print:text-white">
                        III. INFORMASI PROGRAM PAKET & PERJALANAN
                    </h3>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                        <div className="grid grid-cols-3 border-b border-slate-100 py-1">
                            <span className="col-span-1 font-bold text-slate-500">
                                Kode Paket
                            </span>
                            <span className="col-span-2 font-extrabold text-emerald-800 print:text-black">
                                : {packageInfo.code || '-'}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 border-b border-slate-100 py-1">
                            <span className="col-span-1 font-bold text-slate-500">
                                Nama Paket
                            </span>
                            <span className="col-span-2 font-extrabold text-slate-900">
                                : {packageInfo.name || '-'}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 border-b border-slate-100 py-1">
                            <span className="col-span-1 font-bold text-slate-500">
                                Program Hari
                            </span>
                            <span className="col-span-2 font-semibold text-slate-900">
                                :{' '}
                                {packageInfo.program_days
                                    ? `${packageInfo.program_days} Hari`
                                    : '-'}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 border-b border-slate-100 py-1">
                            <span className="col-span-1 font-bold text-slate-500">
                                Maskapai
                            </span>
                            <span className="col-span-2 font-semibold text-slate-900">
                                : {packageInfo.airline || '-'}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 border-b border-slate-100 py-1">
                            <span className="col-span-1 font-bold text-slate-500">
                                Estimasi Keberangkatan
                            </span>
                            <span className="col-span-2 font-semibold text-slate-900">
                                : {formatDate(packageInfo.departure_date)}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 border-b border-slate-100 py-1">
                            <span className="col-span-1 font-bold text-slate-500">
                                Harga Paket
                            </span>
                            <span className="col-span-2 font-extrabold text-slate-900">
                                : Rp{' '}
                                {Number(packageInfo.price || 0).toLocaleString(
                                    'id-ID',
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Section 4: Persyaratan & Pernyataan */}
                <div className="mb-10 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-[10px] leading-relaxed print:border-black print:bg-white">
                    <span className="mb-2 block font-black text-slate-900 uppercase">
                        SYARAT & KETENTUAN PENTING PENDAFTARAN
                    </span>
                    <ol className="list-decimal space-y-1.5 pl-4 font-semibold text-slate-700 print:text-black">
                        <li>
                            <strong className="text-slate-900">
                                Batas Pelunasan H-30:
                            </strong>{' '}
                            Seluruh biaya perjalanan wajib dilunasi paling
                            lambat H-30 sebelum tanggal keberangkatan yang telah
                            ditentukan. Keterlambatan pelunasan dapat
                            menyebabkan pembatalan seat secara sepihak.
                        </li>
                        <li>
                            <strong className="text-slate-900">
                                Fluktuasi Harga:
                            </strong>{' '}
                            Harga paket yang tercantum dapat berubah
                            sewaktu-waktu tanpa pemberitahuan terlebih dahulu
                            menyesuaikan kebijakan maskapai penerbangan, hotel,
                            dan biaya visa Arab Saudi.
                        </li>
                        <li>
                            <strong className="text-slate-950">
                                Validitas Data:
                            </strong>{' '}
                            Jamaah bertanggung jawab penuh atas keabsahan
                            seluruh berkas identitas dan dokumen perjalanan yang
                            diserahkan kepada pihak travel.
                        </li>
                    </ol>
                    <p className="mt-3 font-extrabold text-slate-900 italic">
                        "Dengan menandatangani formulir pendaftaran ini, saya
                        menyatakan setuju dan siap mematuhi segala aturan
                        pendaftaran di PT Annamiroh Juanda Travel."
                    </p>
                </div>

                {/* Section 5: Signature */}
                <div className="flex items-end justify-between gap-12 pt-4 text-xs">
                    <div className="w-52 text-center">
                        <p className="mb-20 font-bold text-slate-500">
                            Petugas / Agen Penerima,
                        </p>
                        <div className="mb-1 w-full border-b border-slate-400"></div>
                        <strong className="font-bold text-slate-900">
                            .........................................
                        </strong>
                    </div>

                    <div className="text-center">
                        <p className="mb-2 text-[10px] font-medium text-slate-400 italic">
                            Dicetak pada:{' '}
                            {new Date().toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </p>
                    </div>

                    <div className="w-52 text-center">
                        <p className="mb-20 font-bold text-slate-500">
                            Pendaftar / Jamaah,
                        </p>
                        <div className="mb-1 w-full border-b border-slate-400"></div>
                        <strong className="font-bold text-slate-900">
                            {jamaah.name || user.name}
                        </strong>
                    </div>
                </div>
            </div>
        </div>
    );
}
