import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const handleScrollTo = (id: string) => {
        setIsOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="fixed top-0 z-50 w-full border-b border-emerald-800 bg-emerald-900 text-white shadow-md">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
                <div className="flex items-center">
                    <img
                        src="/images/LOGO 2 CABANG.png"
                        alt="Annamirah Travel"
                        className="h-12 w-auto object-contain"
                    />
                </div>

                {/* Desktop Menu */}
                <div className="hidden items-center gap-8 text-sm font-medium md:flex">
                    <Link
    href="/"
    className="cursor-pointer py-2 text-left transition hover:text-amber-400 block"
>
    Beranda
</Link>
                    <Link
    href="/kategori-program/umroh-reguler"
    className="cursor-pointer py-2 text-left transition hover:text-amber-400 block"
>
    Paket Umroh
</Link>
                    <Link
    href="/#agency"
    className="cursor-pointer transition hover:text-amber-400"
>
    Keagenan
</Link>

<Link
    href="/#gallery"
    className="cursor-pointer transition hover:text-amber-400"
>
    Galeri
</Link>

                    <div className="ml-4 flex items-center gap-3 border-l border-emerald-700 pl-6">
                        <Link
                            href="/login"
                            className="px-3 py-2 font-bold transition hover:text-amber-400"
                        >
                            Masuk
                        </Link>
                        <Link
                            href="/register"
                            className="rounded-xl bg-amber-400 px-5 py-2 font-bold text-emerald-900 shadow-lg shadow-amber-400/20 transition hover:-translate-y-0.5 hover:bg-amber-300"
                        >
                            Daftar Mandiri
                        </Link>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex md:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="cursor-pointer p-2 text-white transition hover:text-amber-400 focus:outline-none"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="border-emerald-850 animate-in space-y-4 border-t bg-emerald-950 px-6 py-6 duration-200 slide-in-from-top-5 md:hidden">
                    <div className="flex flex-col space-y-3 text-sm font-medium">
                        <Link
    href="/"
    className="cursor-pointer py-2 text-left transition hover:text-amber-400 block"
>
    Beranda
</Link>
                      <Link
    href="/kategori-program/umroh-reguler"
    className="cursor-pointer py-2 text-left transition hover:text-amber-400 block"
>
    Paket Umroh
</Link>
                        <Link
    href="/#agency"
    className="cursor-pointer transition hover:text-amber-400"
>
    Keagenan
</Link>

<Link
    href="/#gallery"
    className="cursor-pointer transition hover:text-amber-400"
>
    Galeri
</Link>
                    </div>

                    <div className="border-emerald-805 flex flex-col gap-3 border-t pt-4">
                        <Link
                            href="/login"
                            onClick={() => setIsOpen(false)}
                            className="w-full rounded-xl border border-emerald-800 py-2.5 text-center font-bold transition hover:text-amber-400"
                        >
                            Masuk
                        </Link>
                        <Link
                            href="/register"
                            onClick={() => setIsOpen(false)}
                            className="w-full rounded-xl bg-amber-400 py-2.5 text-center font-bold text-emerald-900 shadow-lg shadow-amber-400/20 transition hover:bg-amber-300"
                        >
                            Daftar Mandiri
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
