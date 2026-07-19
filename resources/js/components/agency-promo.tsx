import { motion } from 'framer-motion';
import { Users, TrendingUp, Handshake, ChevronRight } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function AgencyPromo() {
    return (
        <section id="agency" className="py-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col overflow-hidden rounded-2xl bg-emerald-900 shadow-xl shadow-emerald-900/10 md:flex-row"
                >
                    <div className="relative flex flex-col justify-center p-10 md:w-3/5 md:p-12">
                        <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/3 -translate-y-1/2 rounded-full bg-emerald-800 opacity-50 blur-3xl"></div>

                        <div className="relative z-10">
                            <span className="mb-4 inline-block rounded bg-amber-400 px-2 py-1 text-[10px] font-bold tracking-widest text-emerald-900 uppercase">
                                Peluang Kemitraan
                            </span>
                            <h2 className="mb-4 font-serif text-3xl leading-tight font-bold text-white md:text-4xl">
                                Mari Menjadi Bagian dari <br /> Keluarga
                                Annamirah
                            </h2>
                            <p className="mb-8 max-w-lg text-sm leading-relaxed text-emerald-50 opacity-90 md:text-base">
                                Daftarkan diri Anda sebagai agen perwakilan
                                kami. Dapatkan komisi menarik, bimbingan bisnis,
                                dan pahala dalam membantu tamu Allah ke Tanah
                                Suci.
                            </p>

                            <div className="flex flex-col gap-4 sm:flex-row">
                                <Link
                                    href="/register?role=agen"
                                    className="flex inline-flex items-center justify-center gap-2 rounded bg-amber-400 px-6 py-3 font-bold text-emerald-900 transition-colors hover:bg-amber-300"
                                >
                                    Daftar Menjadi Agen
                                    <ChevronRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center gap-6 border-l border-emerald-700/50 bg-emerald-800 p-10 md:w-2/5">
                        <h3 className="mb-2 font-bold text-white">
                            Keuntungan Menjadi Agen:
                        </h3>

                        <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-emerald-700">
                                <TrendingUp
                                    className="text-amber-400"
                                    size={20}
                                />
                            </div>
                            <div>
                                <h4 className="mb-1 text-sm font-bold text-emerald-50">
                                    Komisi & Bonus Menarik
                                </h4>
                                <p className="text-xs text-emerald-200/70">
                                    Potensi penghasilan tak terbatas dari setiap
                                    jamaah yang mendaftar melalui Anda.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-emerald-700">
                                <Handshake
                                    className="text-amber-400"
                                    size={20}
                                />
                            </div>
                            <div>
                                <h4 className="mb-1 text-sm font-bold text-emerald-50">
                                    Dukungan Penuh
                                </h4>
                                <p className="flex-1 text-xs text-emerald-200/70">
                                    Materi promosi, training produk, dan bantuan
                                    tim operasional 24/7.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-emerald-700">
                                <Users className="text-amber-400" size={20} />
                            </div>
                            <div>
                                <h4 className="mb-1 text-sm font-bold text-emerald-50">
                                    Sistem Terintegrasi
                                </h4>
                                <p className="text-xs text-emerald-200/70">
                                    Pantau pendaftaran, jamaah, dan komisi
                                    melalui dashboard khusus agen.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
