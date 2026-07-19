import { Head, Link } from '@inertiajs/react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Calendar, Plane } from 'lucide-react';

interface Package {
    id: number;
    name: string;
    departure_date: string;
    price: string | number;
    airline: string;
    airline_route?: string;
    hotel_makkah: string;
    hotel_madinah: string;
    available_seats: number;
}

interface Props {
    packages: Package[];
}

export default function UmrohReguler({ packages }: Props) {
    // Mengubah tanggal mentah database (ISO) menjadi format Indonesia (Contoh: 2 Juli 2026)
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        } catch (e) {
            return dateString;
        }
    };

    
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
            <Head title="Paket Umroh Reguler" />

            <Navbar />

            <main className="flex-grow pt-32 pb-16 bg-slate-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    
                    <div className="mb-8 text-center lg:text-left">
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                            Program Paket Umroh Reguler
                        </h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Daftar pilihan jadwal keberangkatan umroh reguler PT. Annamiroh Travelindo.
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-slate-200 shadow-xs bg-white">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-[#115e59] text-xs font-bold uppercase tracking-wider text-white">
                                    <tr>
                                        <th className="px-6 py-4">Nama Paket</th>
                                        <th className="px-6 py-4">Keberangkatan</th>
                                        <th className="px-6 py-4 text-right">Harga</th>
                                        <th className="px-6 py-4">Pesawat</th>
                                        <th className="px-6 py-4 text-center">🏢 Makkah</th>
                                        <th className="px-6 py-4 text-center">🏢 Madinah</th>
                                        <th className="px-6 py-4 text-center">Sisa Seat</th>
                                        <th className="px-6 py-4 text-center">Keterangan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {packages.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-12 text-center font-medium text-slate-400">
                                                Belum ada paket reguler yang dijadwalkan saat ini.
                                            </td>
                                        </tr>
                                    ) : (
                                        packages.map((pkg) => (
                                            <tr key={pkg.id} className="transition-colors hover:bg-slate-50/50">
                                                
                                                {/* Nama Paket */}
                                                <td className="px-6 py-5 font-bold text-slate-800">
                                                    {pkg.name}
                                                </td>

                                                {/* Tanggal Keberangkatan */}
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2 font-semibold text-slate-600">
                                                        <Calendar size={14} className="text-slate-400" />
                                                        <span>{formatDate(pkg.departure_date)}</span>
                                                    </div>
                                                </td>

                                                {/* Harga Bulat */}
                                                <td className="px-6 py-5 text-right font-bold text-emerald-700">
                                                    Rp {Math.floor(Number(pkg.price)).toLocaleString('id-ID')}
                                                </td>

                                                {/* Maskapai Pesawat */}
                                                <td className="px-6 py-5">
    <div className="flex flex-col gap-0.5">
        {/* Baris Atas: Ikon + Nama Maskapai */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Plane size={14} className="text-slate-400 shrink-0" />
            <span>{pkg.airline}</span>
        </div>
        
        {/* Baris Bawah: Rute Penerbangan (Hanya muncul jika ada isinya) */}
        {pkg.airline_route && (
            <span className="pl-5 text-[11px] font-medium text-slate-405 italic tracking-wide">
                {pkg.airline_route}
            </span>
        )}
    </div>
</td>

                                                {/* Kolom Hotel Makkah Bersih */}
<td className="px-6 py-5 text-center font-semibold text-slate-700">
    {pkg.hotel_makkah || '-'}
</td>

{/* Kolom Hotel Madinah Bersih */}
<td className="px-6 py-5 text-center font-semibold text-slate-700">
    {pkg.hotel_madinah || '-'}
</td>

                                                {/* Sisa Kursi */}
                                                <td className="px-6 py-5 text-center">
                                                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                                                        pkg.available_seats === 0 ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-800'
                                                    }`}>
                                                        {pkg.available_seats === 0 ? "Penuh" : `${pkg.available_seats} Seat`}
                                                    </span>
                                                </td>

                                                {/* Tombol Aksi */}
                                                <td className="px-6 py-5 text-center">
                                                    <Link
                                                        href={`/login?package_id=${pkg.id}`}
                                                        disabled={pkg.available_seats === 0}
                                                        className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-xs font-bold text-white shadow-xs transition-all ${
                                                            pkg.available_seats === 0
                                                                ? 'cursor-not-allowed bg-slate-200 text-slate-400'
                                                                : 'bg-[#115e59] hover:bg-[#0f514c] active:scale-95'
                                                        }`}
                                                    >
                                                        SELENGKAPNYA
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}

// Menonaktifkan layout sidebar dashboard bawaan global
UmrohReguler.layout = (page: any) => <>{page}</>;