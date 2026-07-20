import { Head, Link } from '@inertiajs/react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import {
    ArrowLeft,
    CalendarDays,
    Check,
    Clock3,
    Gift,
    Hotel,
    MessageCircle,
    Plane,
    ShoppingCart,
    TicketCheck,
    X,
} from 'lucide-react';

interface PackageDetailData {
    id: number;
    name: string;
    code?: string | null;
    program_days?: number | null;
    departure_date?: string | null;
    airline?: string | null;
    airline_route?: string | null;
    price: number;
    hotel_makkah?: string | null;
    hotel_madinah?: string | null;
    included?: string[] | null;
    not_included?: string[] | null;
    bonus?: string[] | null;
    includes?: string | null;
    excludes?: string | null;
    free_items?: string | null;
    total_seats: number;
    available_seats: number;
    image_url: string;
    detail_url: string;
}

interface Props {
    package: PackageDetailData;
}

const listFrom = (arrayValue?: string[] | null, textValue?: string | null) => {
    if (Array.isArray(arrayValue) && arrayValue.length) return arrayValue;
    return (textValue || '')
        .split(/[\n,]+/)
        .map((item) => item.trim())
        .filter(Boolean);
};

export default function PackageDetail({ package: pkg }: Props) {
    const included = listFrom(pkg.included, pkg.includes);
    const excluded = listFrom(pkg.not_included, pkg.excludes);
    const bonuses = listFrom(pkg.bonus, pkg.free_items);
    const seatPercentage =
        pkg.total_seats > 0
            ? Math.min(
                  100,
                  Math.max(0, (pkg.available_seats / pkg.total_seats) * 100),
              )
            : 0;
    const isFull = pkg.available_seats <= 0;
    const formattedDate = pkg.departure_date
        ? new Date(`${pkg.departure_date}T00:00:00`).toLocaleDateString(
              'id-ID',
              {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
              },
          )
        : 'Jadwal menyusul';
    const whatsappText = encodeURIComponent(
        `Assalamu'alaikum, saya ingin konsultasi mengenai paket ${pkg.name}${pkg.code ? ` (${pkg.code})` : ''}.\n\nLink paket:\n${pkg.detail_url}`,
    );
    const whatsappUrl = `https://api.whatsapp.com/send?phone=6285790721167&text=${whatsappText}`;

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-800">
            <Head title={`${pkg.name} - Paket Umroh`} />
            <Navbar />

            <main className="flex-grow pt-28 pb-16 sm:pt-32">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/kategori-program/umroh-reguler"
                        className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-800 transition hover:text-emerald-600"
                    >
                        <ArrowLeft size={18} /> Kembali ke Daftar Paket
                    </Link>

                    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
                        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                            <div className="relative overflow-hidden rounded-t-3xl bg-slate-100">
    <img
        src={pkg.image_url}
        alt={pkg.name}
        className="h-auto max-h-[650px] w-full object-contain"
    />
                                {pkg.code && (
                                    <span className="absolute top-5 left-5 rounded-full bg-emerald-900/90 px-4 py-2 text-xs font-bold tracking-wide text-white backdrop-blur">
                                        {pkg.code}
                                    </span>
                                )}
                            </div>

                            <div className="p-5 sm:p-8">
                                <h1 className="text-2xl font-extrabold tracking-tight text-emerald-950 sm:text-4xl">
                                    {pkg.name}
                                </h1>
                                <p className="mt-2 text-sm text-slate-500">
                                    Informasi lengkap program perjalanan ibadah
                                    Anda bersama PT. Annamiroh Travelindo.
                                </p>

                                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                                    <Info
                                        icon={<CalendarDays size={20} />}
                                        label="Keberangkatan"
                                        value={formattedDate}
                                    />
                                    <Info
                                        icon={<Clock3 size={20} />}
                                        label="Durasi Program"
                                        value={
                                            pkg.program_days
                                                ? `${pkg.program_days} Hari`
                                                : '-'
                                        }
                                    />
                                    <Info
                                        icon={<Plane size={20} />}
                                        label="Maskapai"
                                        value={pkg.airline || '-'}
                                        detail={pkg.airline_route || undefined}
                                    />
                                    <Info
                                        icon={<Hotel size={20} />}
                                        label="Hotel Makkah"
                                        value={pkg.hotel_makkah || '-'}
                                    />
                                    <Info
                                        icon={<Hotel size={20} />}
                                        label="Hotel Madinah"
                                        value={pkg.hotel_madinah || '-'}
                                    />
                                    <Info
                                        icon={<TicketCheck size={20} />}
                                        label="Kode Paket"
                                        value={pkg.code || '-'}
                                    />
                                </div>

                                <div className="mt-8 grid gap-5 md:grid-cols-2">
                                    <FeatureList
                                        title="Fasilitas yang Termasuk"
                                        items={included}
                                        icon="check"
                                    />
                                    <FeatureList
                                        title="Belum Termasuk"
                                        items={excluded}
                                        icon="x"
                                    />
                                </div>

                                {bonuses.length > 0 && (
                                    <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                                        <h2 className="flex items-center gap-2 font-extrabold text-amber-900">
                                            <Gift size={20} /> Bonus &
                                            Cinderamata
                                        </h2>
                                        <ul className="mt-3 grid gap-2 text-sm text-amber-950 sm:grid-cols-2">
                                            {bonuses.map((item, index) => (
                                                <li key={index}>• {item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </article>

                        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 lg:sticky lg:top-28">
                            <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                                Harga per jamaah
                            </p>
                            <p className="mt-2 text-3xl font-extrabold text-emerald-900">
                                Rp {Number(pkg.price).toLocaleString('id-ID')}
                            </p>

                            <div className="my-6 border-t border-slate-100" />
                            <div className="flex items-end justify-between gap-4">
                                <div>
                                    <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                                        Sisa kuota
                                    </p>
                                    <p
                                        className={`mt-1 text-xl font-extrabold ${isFull ? 'text-rose-600' : 'text-emerald-800'}`}
                                    >
                                        {isFull
                                            ? 'Penuh'
                                            : `${pkg.available_seats} Kursi`}
                                    </p>
                                </div>
                                {pkg.total_seats > 0 && (
                                    <span className="text-xs text-slate-400">
                                        dari {pkg.total_seats}
                                    </span>
                                )}
                            </div>
                            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className={`h-full rounded-full ${isFull ? 'bg-rose-500' : pkg.available_seats <= 5 ? 'bg-amber-500' : 'bg-emerald-600'}`}
                                    style={{ width: `${seatPercentage}%` }}
                                />
                            </div>

                            <div className="mt-7 space-y-3">
                                {isFull ? (
                                    <span className="flex w-full cursor-not-allowed items-center justify-center rounded-xl bg-slate-200 px-5 py-3.5 text-sm font-extrabold text-slate-500">
                                        Paket Sudah Penuh
                                    </span>
                                ) : (
                                    <Link
                                        href={`/login?package_id=${pkg.id}`}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-5 py-3.5 text-sm font-extrabold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-emerald-700"
                                    >
                                        <ShoppingCart size={19} /> Pesan Paket
                                        Ini Sekarang
                                    </Link>
                                )}
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3.5 text-sm font-extrabold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#20bd5a]"
                                >
                                    <MessageCircle size={19} /> Konsultasi via
                                    WhatsApp
                                </a>
                            </div>
                            <p className="mt-4 text-center text-xs leading-relaxed text-slate-400">
                                Silakan konsultasikan detail program terlebih
                                dahulu bila Anda membutuhkan bantuan.
                            </p>
                        </aside>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

function Info({
    icon,
    label,
    value,
    detail,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    detail?: string;
}) {
    return (
        <div className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <span className="mt-0.5 text-emerald-700">{icon}</span>
            <div className="min-w-0">
                <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                    {label}
                </p>
                <p className="mt-1 font-bold text-slate-800">{value}</p>
                {detail && (
                    <p className="mt-0.5 text-xs text-slate-500">{detail}</p>
                )}
            </div>
        </div>
    );
}

function FeatureList({
    title,
    items,
    icon,
}: {
    title: string;
    items: string[];
    icon: 'check' | 'x';
}) {
    return (
        <section className="rounded-2xl border border-slate-200 p-5">
            <h2 className="font-extrabold text-slate-900">{title}</h2>
            {items.length ? (
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                    {items.map((item, index) => (
                        <li key={index} className="flex items-start gap-2.5">
                            <span
                                className={`mt-0.5 rounded-full p-0.5 ${icon === 'check' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'}`}
                            >
                                {icon === 'check' ? (
                                    <Check size={14} />
                                ) : (
                                    <X size={14} />
                                )}
                            </span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="mt-3 text-sm text-slate-400">
                    Informasi belum tersedia.
                </p>
            )}
        </section>
    );
}

PackageDetail.layout = (page: React.ReactNode) => <>{page}</>;
