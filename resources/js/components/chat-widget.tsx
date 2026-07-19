import { useState } from 'react';
import { ChevronDown, MessageSquare, BookOpen, FileText, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);

    // ================= CONFIG: SILAKAN GANTI NOMOR WHATSAPP DI SINI =================
    const whatsappNumber = "6281252777871"; 
    // ================================================================================

    const handleMenuClick = (menuType: 'paket' | 'dokumen' | 'cs') => {
        let waText = '';

        if (menuType === 'paket') {
            waText = `Assalamualaikum Admin Annamiroh, saya tertarik dengan *Pilihan Paket Berkah* di website. Boleh minta informasi paket umroh terbaru yang masih tersedia sisa kursinya? 🕋✨`;
        } else if (menuType === 'dokumen') {
            waText = `Assalamualaikum Admin, saya mau tanya mengenai *Persyaratan Dokumen*. Apa saja daftar berkas (KTP/KK/Paspor/Vaksin) yang harus saya siapkan untuk manifest keberangkatan? 📜`;
        } else if (menuType === 'cs') {
            waText = `Halo Customer Service Annamiroh Travel, saya butuh bantuan langsung atau ada pertanyaan lain di luar informasi paket. Terima kasih. 🙏`;
        }

        const encodedText = encodeURIComponent(waText);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedText}`;

        // Buka WhatsApp di tab baru
        window.open(whatsappUrl, '_blank');
        setIsOpen(false);
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed right-6 bottom-24 z-50 flex w-80 flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl sm:w-[350px]"
                    >
                        {/* Header - Warna Teal Tua khas Annamiroh */}
                        <div className="flex items-center justify-between bg-[#115e59] px-5 py-4 text-white">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold tracking-wide">
                                    Asisten Digital Annamiroh
                                </span>
                                <span className="text-[10px] text-emerald-200/90 font-medium">
                                    Online • Respon Otomatis
                                </span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/80 transition hover:text-white focus:outline-none"
                            >
                                <ChevronDown size={20} />
                            </button>
                        </div>

                        {/* Chat Body & Buttons */}
                        <div className="bg-slate-50 p-5 space-y-4">
                            {/* Gelembung Pesan Sambutan */}
                            <div className="flex flex-col rounded-2xl rounded-tl-none bg-white p-4 shadow-sm border border-slate-100 text-xs leading-relaxed text-slate-700">
                                <p className="font-semibold text-slate-800 mb-1">
                                    Assalamualaikum! Selamat datang di PT. Annamiroh Travelindo. ✨
                                </p>
                                <p>
                                    Ada yang bisa asisten digital kami bantu hari ini? Silakan klik salah satu menu di bawah untuk terhubung langsung ke WhatsApp tim operasional kami:
                                </p>
                            </div>

                            {/* Menu Pilihan Opsi */}
                            <div className="flex flex-col gap-2.5 pt-2">
                                <button
                                    onClick={() => handleMenuClick('paket')}
                                    className="flex items-center gap-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-left text-xs font-bold text-slate-700 shadow-xs transition-all hover:border-emerald-600 hover:bg-emerald-50/40 hover:text-emerald-900 active:scale-[0.98]"
                                >
                                    <BookOpen size={16} className="text-emerald-600 shrink-0" />
                                    <span>Tanya Paket Umroh / Haji</span>
                                </button>

                                <button
                                    onClick={() => handleMenuClick('dokumen')}
                                    className="flex items-center gap-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-left text-xs font-bold text-slate-700 shadow-xs transition-all hover:border-emerald-600 hover:bg-emerald-50/40 hover:text-emerald-900 active:scale-[0.98]"
                                >
                                    <FileText size={16} className="text-emerald-600 shrink-0" />
                                    <span>Syarat Berkas & Dokumen</span>
                                </button>

                                <button
                                    onClick={() => handleMenuClick('cs')}
                                    className="flex items-center gap-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-left text-xs font-bold text-slate-700 shadow-xs transition-all hover:border-emerald-600 hover:bg-emerald-50/40 hover:text-emerald-900 active:scale-[0.98]"
                                >
                                    <Phone size={16} className="text-emerald-600 shrink-0" />
                                    <span>Hubungi CS / Admin Lainnya</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Button Utama */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group fixed right-6 bottom-6 z-50 flex h-16 w-16 items-center justify-center rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 focus:outline-none"
            >
                <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-white bg-emerald-50 shadow-lg">
                    <img
                        src="/images/support_avatar.png"
                        alt="Customer Support"
                        className="h-full w-full object-cover"
                    />
                </div>
                {/* Indikator Online Hijau Berkedip */}
                <span className="absolute right-1 bottom-1 h-4 w-4 animate-pulse rounded-full border-2 border-white bg-green-500"></span>
            </button>
        </>
    );
}