import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Printer,
    CheckCircle2,
    AlertCircle,
    CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Invoice({ booking }: { booking: any }) {
    const amountPaid = Number(booking.amount_paid || 0);
    const packagePrice = Number(booking.package?.price || 0);
    const remaining = Math.max(0, packagePrice - amountPaid);

    const bookingDate = new Date(booking.created_at);
    const invoiceNo = `INV/${bookingDate.getFullYear()}${String(bookingDate.getMonth() + 1).padStart(2, '0')}${String(bookingDate.getDate()).padStart(2, '0')}/${booking.id.toString().padStart(5, '0')}`;

    const handlePrint = () => {
        window.print();
    };

    // Formatted dates
    const invoiceDateStr = bookingDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const departureDateStr = booking.package?.departure_date
        ? new Date(booking.package.departure_date).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
          })
        : '-';

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8 print:bg-white print:px-0 print:py-0">
            <Head title={`Invoice ${invoiceNo}`} />

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
                    .print-border {
                        border: 1px solid #e2e8f0 !important;
                    }
                    .print-shadow-none {
                        box-shadow: none !important;
                        border: none !important;
                    }
                }
            `,
                }}
            />

            {/* Action Bar */}
            <div className="no-print mx-auto mb-6 flex max-w-3xl items-center justify-between">
                <Link
                    href="/admin/bookings"
                    className="inline-flex items-center text-sm font-semibold text-slate-600 transition-colors hover:text-emerald-600"
                >
                    <ArrowLeft size={16} className="mr-1.5" /> Kembali ke Data
                    Booking
                </Link>
                <Button
                    onClick={handlePrint}
                    className="flex items-center gap-2 rounded-xl bg-emerald-600 font-bold text-white shadow-md transition-all hover:bg-emerald-700"
                >
                    <Printer size={16} /> Cetak / Save PDF
                </Button>
            </div>

            {/* Invoice Paper */}
            <div className="print-shadow-none mx-auto max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-xl md:p-12 print:p-0">
                {/* Header */}
                <div className="flex flex-col items-start justify-between gap-6 border-b border-slate-200 pb-8 md:flex-row">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-black tracking-tight text-emerald-700">
                                ANNAMIROH
                            </span>
                            <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold tracking-widest text-emerald-800 uppercase">
                                TRAVEL
                            </span>
                        </div>
                        <p className="mt-2 max-w-xs text-xs leading-relaxed font-medium text-slate-500">
                            Kawasan Ruko Mutiara Blok A/12,
                            <br />
                            Jl. Raya Juanda, Sidoarjo, Jawa Timur
                            <br />
                            Telp: 0812-3456-789 | Email:
                            info@annamirohtravel.com
                        </p>
                    </div>
                    <div className="md:text-right">
                        <h2 className="text-3xl font-black tracking-tight text-slate-800 print:text-black">
                            INVOICE
                        </h2>
                        <div className="mt-2 space-y-1 text-sm text-slate-500">
                            <p className="font-bold text-slate-700 print:text-black">
                                No:{' '}
                                <span className="font-extrabold text-emerald-700 print:text-black">
                                    {invoiceNo}
                                </span>
                            </p>
                            <p>Tanggal: {invoiceDateStr}</p>
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className="grid gap-8 border-b border-slate-200 py-8 md:grid-cols-2">
                    <div>
                        <h3 className="mb-3 text-xs font-bold tracking-wider text-slate-400 uppercase">
                            Ditagihkan Kepada:
                        </h3>
                        <div className="space-y-1">
                            <strong className="block text-base text-slate-800 print:text-black">
                                {booking.jamaah_member?.name ||
                                    booking.user?.name}
                            </strong>
                            <p className="text-sm leading-relaxed text-slate-600 print:text-slate-700">
                                {booking.jamaah_member ? (
                                    <span className="text-xs text-slate-500">
                                        Akun Utama: {booking.user?.name} (
                                        {
                                            booking.jamaah_member
                                                .hubungan_keluarga
                                        }
                                        )
                                    </span>
                                ) : (
                                    <span className="text-xs text-slate-500">
                                        Pendaftar Mandiri
                                    </span>
                                )}
                            </p>
                            <p className="text-sm text-slate-500">
                                Email: {booking.user?.email || '-'}
                            </p>
                            <p className="text-sm text-slate-500">
                                No. WA: {booking.user?.profile?.no_wa || '-'}
                            </p>
                        </div>
                    </div>
                    <div>
                        <h3 className="mb-3 text-xs font-bold tracking-wider text-slate-400 uppercase">
                            Status Pembayaran:
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <span
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase ${
                                        booking.status_pembayaran === 'lunas'
                                            ? 'border border-emerald-200 bg-emerald-100 text-emerald-700'
                                            : 'border border-amber-200 bg-amber-100 text-amber-700'
                                    }`}
                                >
                                    <span
                                        className={`h-1.5 w-1.5 rounded-full ${booking.status_pembayaran === 'lunas' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                    ></span>
                                    {booking.status_pembayaran}
                                </span>
                            </div>
                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs leading-relaxed text-slate-500 print:border print:border-slate-200 print:bg-white">
                                <span className="mb-1 block font-bold text-slate-700">
                                    Catatan Keberangkatan:
                                </span>
                                Paket: {booking.package?.name || '-'}
                                <br />
                                Estimasi Berangkat: {departureDateStr}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="py-8">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                <th className="pb-3">
                                    Deskripsi Layanan / Paket
                                </th>
                                <th className="pb-3 text-right">
                                    Harga Satuan
                                </th>
                                <th className="pb-3 text-right">Jumlah</th>
                                <th className="pb-3 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr>
                                <td className="py-4 pr-4">
                                    <strong className="block font-bold text-slate-800 print:text-black">
                                        {booking.package?.name}
                                    </strong>
                                    <span className="text-xs text-slate-400">
                                        Program {booking.package?.program_days}{' '}
                                        Hari • Maskapai{' '}
                                        {booking.package?.airline}
                                    </span>
                                </td>
                                <td className="py-4 text-right text-slate-600">
                                    Rp {packagePrice.toLocaleString('id-ID')}
                                </td>
                                <td className="py-4 text-right text-slate-600">
                                    1 Orang
                                </td>
                                <td className="py-4 text-right font-bold text-slate-800 print:text-black">
                                    Rp {packagePrice.toLocaleString('id-ID')}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Summary Section */}
                <div className="grid gap-8 border-t border-slate-200 pt-4 md:grid-cols-2">
                    <div className="text-xs leading-relaxed text-slate-500">
                        <div className="rounded-2xl border border-emerald-100/50 bg-emerald-50/50 p-4 print:border print:border-slate-200 print:bg-white">
                            <span className="mb-2 block flex items-center gap-1.5 font-bold text-emerald-800 print:text-black">
                                <CreditCard
                                    size={14}
                                    className="text-emerald-600 print:text-black"
                                />{' '}
                                Petunjuk Pembayaran Transfer:
                            </span>
                            <p className="mb-1">
                                <strong>Bank Syariah Indonesia (BSI)</strong>
                            </p>
                            <p className="mb-2">
                                No. Rekening:{' '}
                                <strong className="font-bold text-slate-800 print:text-black">
                                    7145-2234-89
                                </strong>
                            </p>
                            <p>
                                a.n. <strong>PT Annamiroh Juanda Travel</strong>
                            </p>
                            <p className="mt-3 text-[10px] text-slate-400 italic">
                                Harap kirimkan bukti transfer kepada admin atau
                                agen penanggung jawab Anda.
                            </p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-slate-500">
                            <span>Subtotal</span>
                            <span>
                                Rp {packagePrice.toLocaleString('id-ID')}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm font-bold text-emerald-700">
                            <span>Jumlah Dibayar</span>
                            <span>Rp {amountPaid.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-lg font-black text-slate-800 print:text-black">
                            <span>Sisa Kekurangan</span>
                            <span
                                className={
                                    remaining > 0
                                        ? 'text-amber-600'
                                        : 'text-slate-800 print:text-black'
                                }
                            >
                                Rp {remaining.toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer Signature */}
                <div className="mt-16 flex items-end justify-between gap-6 border-t border-slate-100 pt-12 text-sm text-slate-500">
                    <div>
                        <p className="text-xs italic">
                            Terima kasih telah mempercayakan perjalanan ibadah
                            Anda bersama Annamiroh.
                        </p>
                    </div>
                    <div className="w-48 text-center">
                        <p className="mb-12">Hormat Kami,</p>
                        <div className="mb-1 w-full border-b border-slate-300"></div>
                        <strong className="font-bold text-slate-800 print:text-black">
                            Annamiroh Travel
                        </strong>
                    </div>
                </div>
            </div>
        </div>
    );
}
