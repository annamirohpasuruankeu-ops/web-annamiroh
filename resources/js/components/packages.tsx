import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Package } from '@/types';
import { useRef, useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

interface PackagesProps {
    packages: Package[];
}

export default function Packages({ packages }: PackagesProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const rearrangePackages = (list: Package[]): Package[] => {
        if (list.length < 2) return list;
        const bestSellerIndex = list.findIndex((pkg) => pkg.is_best_seller);
        if (bestSellerIndex === -1) return list;

        const targetIndex = 1;
        if (bestSellerIndex === targetIndex || targetIndex >= list.length)
            return list;

        const newList = [...list];
        const temp = newList[targetIndex];
        newList[targetIndex] = newList[bestSellerIndex];
        newList[bestSellerIndex] = temp;
        return newList;
    };

    const processedPackages = rearrangePackages(packages);

    const handleBookNow = (pkg: Package) => {
    if (pkg.availableSeats === 0) return;

    router.visit(`/paket-umroh/${pkg.id}`);
};

    const checkScroll = () => {
        const el = scrollContainerRef.current;
        if (el) {
            setCanScrollLeft(el.scrollLeft > 5);
            setCanScrollRight(
                el.scrollLeft < el.scrollWidth - el.clientWidth - 5,
            );
        }
    };

    useEffect(() => {
        const el = scrollContainerRef.current;
        if (el) {
            el.addEventListener('scroll', checkScroll);
            checkScroll();
            window.addEventListener('resize', checkScroll);
        }
        return () => {
            if (el) {
                el.removeEventListener('scroll', checkScroll);
            }
            window.removeEventListener('resize', checkScroll);
        };
    }, [packages]);

    const scroll = (direction: 'left' | 'right') => {
        const el = scrollContainerRef.current;
        if (el) {
            const card = el.querySelector('.package-card');
            if (card) {
                const cardWidth = card.clientWidth;
                const gap = 24; // gap-6
                const scrollAmount =
                    direction === 'left' ? -(cardWidth + gap) : cardWidth + gap;
                el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    const isSlider = packages.length > 3;

    return (
        <section id="packages" className="overflow-hidden py-16">
            {/* Hide the default scrollbar for Chrome/Safari */}
            <style>{`
        #packages-scroll-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>

            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <h2 className="border-l-4 border-amber-400 pl-4 text-2xl font-bold tracking-tight text-emerald-900 md:text-3xl">
                            Pilihan Paket Berkah
                        </h2>
                        <p className="mt-3 ml-5 max-w-2xl text-sm text-slate-500">
                            Temukan paket umroh dan haji yang paling sesuai
                            dengan kebutuhan Anda.
                        </p>
                    </div>

                    {/* Navigation Controls (Only show if > 3 packages) */}
                    {isSlider && (
                        <div className="ml-5 flex gap-2 sm:ml-0">
                            <button
                                onClick={() => scroll('left')}
                                disabled={!canScrollLeft}
                                className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all ${
                                    canScrollLeft
                                        ? 'cursor-pointer border-emerald-800 text-emerald-800 hover:bg-emerald-50 active:scale-95'
                                        : 'cursor-not-allowed border-slate-200 text-slate-300'
                                }`}
                                aria-label="Sebelumnya"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                disabled={!canScrollRight}
                                className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all ${
                                    canScrollRight
                                        ? 'cursor-pointer border-emerald-800 text-emerald-800 hover:bg-emerald-50 active:scale-95'
                                        : 'cursor-not-allowed border-slate-200 text-slate-300'
                                }`}
                                aria-label="Selanjutnya"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </div>

                {packages.length === 0 ? (
                    <div className="flex h-64 items-center justify-center text-slate-500">
                        <p>Belum ada paket yang tersedia.</p>
                    </div>
                ) : !isSlider ? (
                    // Grid layout for 3 or fewer packages
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {processedPackages.map((pkg, idx) => (
                            <motion.div
                                key={pkg.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                                className={`flex flex-col rounded-xl border bg-white p-4 shadow-sm ${
                                    pkg.is_best_seller
                                        ? 'border-2 border-amber-400'
                                        : 'border-slate-200 hover:border-emerald-600'
                                } group relative transition-all`}
                            >
                                {pkg.is_best_seller && (
                                    <div className="absolute -top-3 right-4 z-10 rounded-full bg-amber-400 px-3 py-1 text-[10px] font-bold text-emerald-900 uppercase shadow-sm">
                                        Best Seller
                                    </div>
                                )}

                                <div className="relative mb-4 h-40 w-full overflow-hidden rounded-lg">
                                    <img
                                        src={pkg.image}
                                        alt={pkg.title}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>

                                <div className="flex flex-1 flex-col">
                                    <div className="mb-1 text-[10px] font-bold text-emerald-600 uppercase">
                                        {pkg.airline} • {pkg.departureDate}
                                    </div>
                                    <h3 className="mb-2 text-base leading-snug font-bold text-slate-800">
                                        {pkg.title}
                                    </h3>
                                    <div className="mb-3 text-xl font-bold text-emerald-900">
                                        Rp {pkg.price.toLocaleString('id-ID')}
                                    </div>

                                    {/* Seat Availability Bar */}
                                    {pkg.availableSeats !== undefined &&
                                        pkg.totalSeats !== undefined && (
                                            <div className="mb-4">
                                                <div className="mb-1 flex items-center justify-between text-[10px] font-bold text-slate-500">
                                                    <span>
                                                        Ketersediaan Kursi
                                                    </span>
                                                    <span
                                                        className={`${pkg.availableSeats === 0 ? 'text-rose-600' : pkg.availableSeats <= 5 ? 'text-amber-600' : 'text-emerald-700'}`}
                                                    >
                                                        {pkg.availableSeats ===
                                                        0
                                                            ? 'Habis'
                                                            : `${pkg.availableSeats} sisa`}
                                                    </span>
                                                </div>
                                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-500 ${
                                                            pkg.availableSeats ===
                                                            0
                                                                ? 'bg-rose-500'
                                                                : pkg.availableSeats <=
                                                                    5
                                                                  ? 'bg-amber-500'
                                                                  : 'bg-emerald-600'
                                                        }`}
                                                        style={{
                                                            width: `${Math.min(100, Math.max(0, (pkg.availableSeats / pkg.totalSeats) * 100))}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}

                                    <ul className="mb-6 flex-1 space-y-1.5 text-xs text-slate-600">
                                        <li className="flex items-start gap-2">
                                            <span className="mt-0.5 text-emerald-500">
                                                ✔
                                            </span>{' '}
                                            Hotel Makkah: {pkg.hotelMecca}
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="mt-0.5 text-emerald-500">
                                                ✔
                                            </span>{' '}
                                            Hotel Madinah: {pkg.hotelMedina}
                                        </li>
                                        {pkg.features
                                            .slice(0, 3)
                                            .map((feature, i) => (
                                                <li
                                                    key={i}
                                                    className="flex items-start gap-2"
                                                >
                                                    <span className="mt-0.5 text-emerald-500">
                                                        ✔
                                                    </span>{' '}
                                                    {feature}
                                                </li>
                                            ))}
                                    </ul>

                                    <button
                                        onClick={() => handleBookNow(pkg)}
                                        disabled={pkg.availableSeats === 0}
                                        className={`w-full rounded py-2.5 text-xs font-bold transition-colors ${
                                            pkg.availableSeats === 0
                                                ? 'cursor-not-allowed bg-slate-200 text-slate-400'
                                                : pkg.is_best_seller
                                                  ? 'bg-emerald-800 text-white shadow-md shadow-emerald-800/10 hover:bg-emerald-700'
                                                  : 'bg-slate-100 text-emerald-800 hover:bg-slate-200'
                                        }`}
                                    >
                                        {pkg.availableSeats === 0
                                            ? 'Sudah Penuh'
                                            : 'Pesan Sekarang'}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    // Horizontal Slider layout when there are > 3 items
                    <div
                        id="packages-scroll-container"
                        ref={scrollContainerRef}
                        className="-mx-6 flex snap-x snap-mandatory scrollbar-none gap-6 overflow-x-auto scroll-smooth px-6 pt-4 pb-6 lg:mx-0 lg:px-0"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                    >
                        {processedPackages.map((pkg, idx) => (
                            <div
                                key={pkg.id}
                                className="package-card w-[85%] flex-shrink-0 snap-start snap-always sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)]"
                            >
                                <div
                                    className={`flex h-full flex-col rounded-xl border bg-white p-4 shadow-sm ${
                                        pkg.is_best_seller
                                            ? 'border-2 border-amber-400'
                                            : 'border-slate-200 hover:border-emerald-600'
                                    } group relative transition-all`}
                                >
                                    {pkg.is_best_seller && (
                                        <div className="absolute -top-3 right-4 z-10 rounded-full bg-amber-400 px-3 py-1 text-[10px] font-bold text-emerald-900 uppercase shadow-sm">
                                            Best Seller
                                        </div>
                                    )}

                                    <div className="relative mb-4 h-40 w-full overflow-hidden rounded-lg">
                                        <img
                                            src={pkg.image}
                                            alt={pkg.title}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>

                                    <div className="flex flex-1 flex-col">
                                        <div className="mb-1 text-[10px] font-bold text-emerald-600 uppercase">
                                            {pkg.airline} • {pkg.departureDate}
                                        </div>
                                        <h3 className="mb-2 text-base leading-snug font-bold text-slate-800">
                                            {pkg.title}
                                        </h3>
                                        <div className="mb-3 text-xl font-bold text-emerald-900">
                                            Rp{' '}
                                            {pkg.price.toLocaleString('id-ID')}
                                        </div>

                                        {/* Seat Availability Bar */}
                                        {pkg.availableSeats !== undefined &&
                                            pkg.totalSeats !== undefined && (
                                                <div className="mb-4">
                                                    <div className="mb-1 flex items-center justify-between text-[10px] font-bold text-slate-500">
                                                        <span>
                                                            Ketersediaan Kursi
                                                        </span>
                                                        <span
                                                            className={`${pkg.availableSeats === 0 ? 'text-rose-600' : pkg.availableSeats <= 5 ? 'text-amber-600' : 'text-emerald-700'}`}
                                                        >
                                                            {pkg.availableSeats ===
                                                            0
                                                                ? 'Habis'
                                                                : `${pkg.availableSeats} sisa`}
                                                        </span>
                                                    </div>
                                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-500 ${
                                                                pkg.availableSeats ===
                                                                0
                                                                    ? 'bg-rose-500'
                                                                    : pkg.availableSeats <=
                                                                        5
                                                                      ? 'bg-amber-500'
                                                                      : 'bg-emerald-600'
                                                            }`}
                                                            style={{
                                                                width: `${Math.min(100, Math.max(0, (pkg.availableSeats / pkg.totalSeats) * 100))}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}

                                        <ul className="mb-6 flex-1 space-y-1.5 text-xs text-slate-600">
                                            <li className="flex items-start gap-2">
                                                <span className="mt-0.5 text-emerald-500">
                                                    ✔
                                                </span>{' '}
                                                Hotel Makkah: {pkg.hotelMecca}
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="mt-0.5 text-emerald-500">
                                                    ✔
                                                </span>{' '}
                                                Hotel Madinah: {pkg.hotelMedina}
                                            </li>
                                            {pkg.features
                                                .slice(0, 3)
                                                .map((feature, i) => (
                                                    <li
                                                        key={i}
                                                        className="flex items-start gap-2"
                                                    >
                                                        <span className="mt-0.5 text-emerald-500">
                                                            ✔
                                                        </span>{' '}
                                                        {feature}
                                                    </li>
                                                ))}
                                        </ul>

                                        <button
                                            onClick={() => handleBookNow(pkg)}
                                            disabled={pkg.availableSeats === 0}
                                            className={`w-full rounded py-2.5 text-xs font-bold transition-colors ${
                                                pkg.availableSeats === 0
                                                    ? 'cursor-not-allowed bg-slate-200 text-slate-400'
                                                    : pkg.is_best_seller
                                                      ? 'bg-emerald-800 text-white shadow-md shadow-emerald-800/10 hover:bg-emerald-700'
                                                      : 'bg-slate-100 text-emerald-800 hover:bg-slate-200'
                                            }`}
                                        >
                                            {pkg.availableSeats === 0
                                                ? 'Sudah Penuh'
                                                : 'Pesan Sekarang'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
