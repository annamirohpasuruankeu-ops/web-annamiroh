import { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

interface PromoPopupProps {
    popupPromo: {
        id: number;
        title: string;
        description: string | null;
        image: string | null;
        buttonText: string | null;
        buttonLink: string | null;
    } | null;
}

export default function PromoPopup({ popupPromo }: PromoPopupProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (!popupPromo) return;

        // Check sessionStorage to avoid showing popup again in same session
        const dismissed = sessionStorage.getItem(
            `popup_promo_${popupPromo.id}_dismissed`,
        );
        if (dismissed) return;

        // Small delay for a more natural entrance after page loads
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 800);

        return () => clearTimeout(timer);
    }, [popupPromo]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsVisible(false);
            setIsClosing(false);
            if (popupPromo) {
                sessionStorage.setItem(
                    `popup_promo_${popupPromo.id}_dismissed`,
                    'true',
                );
            }
        }, 300);
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    if (!popupPromo || !isVisible) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300 ${
                isClosing ? 'opacity-0' : 'opacity-100'
            }`}
            onClick={handleBackdropClick}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Popup Card */}
            <div
                className={`relative w-full max-w-sm transform transition-all duration-500 ${
                    isClosing
                        ? 'translate-y-4 scale-90 opacity-0'
                        : 'translate-y-0 scale-100 opacity-100'
                }`}
                style={{
                    animation: isClosing
                        ? undefined
                        : 'popupEntrance 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
            >
                {/* Glow Effect */}
                <div className="absolute -inset-1 animate-pulse rounded-[2rem] bg-gradient-to-r from-amber-400 via-emerald-500 to-amber-400 opacity-30 blur-lg" />

                <div className="relative overflow-hidden rounded-[1.75rem] border border-white/20 bg-white shadow-2xl">
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/40 active:scale-95"
                        aria-label="Tutup"
                    >
                        <X size={16} strokeWidth={3} />
                    </button>

                    {/* Image Section */}
                    {popupPromo.image && (
                        <div className="relative w-full overflow-hidden">
                            <img
                                src={popupPromo.image}
                                alt={popupPromo.title}
                                className="block h-auto w-full"
                            />
                            {/* Gradient Overlay */}
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                        </div>
                    )}

                    {/* Content Section */}
                    <div
                        className={`p-6 ${popupPromo.image ? 'pt-5' : 'pt-14'}`}
                    >
                        {/* Badge */}
                        <div className="mb-3 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1 text-[10px] font-extrabold tracking-widest text-amber-950 uppercase shadow-sm">
                                <Sparkles size={12} />
                                Promo Spesial
                            </span>
                        </div>

                        {/* Title */}
                        <h2 className="mb-2 text-2xl leading-tight font-extrabold tracking-tight text-slate-900">
                            {popupPromo.title}
                        </h2>

                        {/* Description */}
                        {popupPromo.description && (
                            <p className="mb-5 text-sm leading-relaxed text-slate-600">
                                {popupPromo.description}
                            </p>
                        )}

                        {/* CTA Buttons */}
                        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                            {popupPromo.buttonText && popupPromo.buttonLink && (
                                <a
                                    href={popupPromo.buttonLink}
                                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.02] hover:from-emerald-700 hover:to-emerald-800 hover:shadow-emerald-600/40 active:scale-[0.98]"
                                >
                                    {popupPromo.buttonText}
                                </a>
                            )}
                            <button
                                onClick={handleClose}
                                className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 px-6 py-3.5 text-sm font-bold text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-700"
                            >
                                Nanti Saja
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS Animation */}
            <style>{`
                @keyframes popupEntrance {
                    0% {
                        opacity: 0;
                        transform: scale(0.85) translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
