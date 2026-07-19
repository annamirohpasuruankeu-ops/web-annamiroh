import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function Hero() {
    return (
        <div className="mx-auto max-w-7xl px-6 pt-28 pb-12 lg:px-8">
            <div className="relative flex min-h-[60vh] items-center overflow-hidden rounded-2xl bg-emerald-800 p-10 text-white shadow-lg md:p-16">
                <div className="absolute top-0 right-0 flex h-full w-1/2 items-center justify-center bg-gradient-to-l from-emerald-700 to-transparent opacity-30">
                    <div className="h-96 w-96 rotate-45 rounded-full border-[16px] border-white/10 mix-blend-overlay"></div>
                </div>

                <div className="absolute inset-0 h-full w-full">
                    <img
                        src="https://picsum.photos/seed/makka/1024/768"
                        alt="Kaaba Mecca"
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover opacity-20 mix-blend-overlay"
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="relative z-10 max-w-2xl space-y-6"
                >
                    <span className="inline-block rounded bg-amber-400 px-2 py-1 text-[10px] font-bold tracking-widest text-emerald-900 uppercase">
                        Terpercaya Sejak 2008
                    </span>
                    <h1 className="font-serif text-4xl leading-tight font-bold text-white md:text-5xl lg:text-6xl">
                        Wujudkan Ibadah Berkah Menuju Baitullah
                    </h1>
                    <p className="max-w-xl text-lg leading-relaxed font-light text-emerald-50 opacity-90 md:text-xl">
                        Layanan profesional dengan pembimbing bersertifikat dan
                        akomodasi hotel terdekat dari Masjidil Haram.
                    </p>

                    <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                        <button
                            onClick={() =>
                                document
                                    .getElementById('packages')
                                    ?.scrollIntoView({ behavior: 'smooth' })
                            }
                            className="flex items-center justify-center gap-2 rounded bg-amber-400 px-8 py-3 font-bold text-emerald-900 shadow-lg transition-colors hover:bg-amber-300"
                        >
                            Lihat Paket Umroh
                        </button>
                        <button
                            onClick={() =>
                                document
                                    .getElementById('gallery')
                                    ?.scrollIntoView({ behavior: 'smooth' })
                            }
                            className="flex items-center justify-center rounded border border-emerald-600 bg-emerald-700 px-8 py-3 font-bold text-white transition-colors hover:bg-emerald-600"
                        >
                            Galeri Kami
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
