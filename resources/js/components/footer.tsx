import { Compass } from 'lucide-react';

export default function Footer() {
    const socials = [
        {
            name: 'TikTok',
            username: 'Annamiroh Pasuruan official',
            href: 'https://www.tiktok.com/search?q=Annamiroh%20Pasuruan%20official',
            color: 'hover:text-slate-900 hover:bg-slate-50 hover:border-slate-800',
            icon: (
                <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
            ),
        },
        {
            name: 'Facebook',
            username: 'Annamiroh pasuruan',
            href: 'https://www.facebook.com/search/top?q=Annamiroh%20pasuruan',
            color: 'hover:text-blue-600 hover:bg-blue-50 hover:border-blue-300',
            icon: (
                <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
            ),
        },
        {
            name: 'Instagram',
            username: 'annamiroh Pasuruan',
            href: 'https://www.instagram.com/explore/tags/annamirohpasuruan/',
            color: 'hover:text-pink-600 hover:bg-pink-50 hover:border-pink-300',
            icon: (
                <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
            ),
        },
        {
            name: 'YouTube',
            username: 'Annamiroh Pasuruan',
            href: 'https://www.youtube.com/results?search_query=Annamiroh+Pasuruan',
            color: 'hover:text-red-600 hover:bg-red-50 hover:border-red-300',
            icon: (
                <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
                    <polygon points="10 15 15 12 10 9" />
                </svg>
            ),
        },
    ];

    return (
        <footer className="border-t border-slate-200 bg-slate-100 py-10">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mb-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:col-span-2">
                        <div className="text-xs text-slate-500">
                            <span className="mb-2 block font-bold tracking-wider text-slate-700">
                                ALAMAT KANTOR CABANG
                            </span>
                            Jl. Sakera RT. 002 RW. 001, Krajan Desa Tampung Kec. Rembang Kab. Pasuruan, Prov. Jawa Timur
                        </div>
                        <div className="text-xs text-slate-500">
                            <span className="mb-2 block font-bold tracking-wider text-slate-700">
                                KONTAK RESMI
                            </span>
                            0857 - 5547 - 7112 / annamirohpasuruan.keu@gmail.com
                        </div>
                    </div>

                    <div className="flex items-center justify-start gap-3 opacity-80 lg:justify-end">
                        <div className="rounded border border-slate-300 bg-white px-3 py-1.5 text-[10px] font-bold text-slate-600">
                            PPIU No. 949 Tahun 2019
                        </div>
                        <div className="rounded border border-slate-300 bg-white px-3 py-1.5 text-[10px] font-bold text-slate-600">
                            KEMENAG RI
                        </div>
                    </div>
                </div>

                {/* Media Sosial Section */}
                <div className="border-t border-slate-200 pt-6">
                    <span className="mb-4 block text-center text-xs font-bold tracking-wider text-slate-700 lg:text-left">
                        IKUTI MEDIA SOSIAL KAMI
                    </span>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {socials.map((social) => (
                            <a
                                key={social.name}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-all ${social.color} hover:-translate-y-0.5 hover:shadow`}
                            >
                                <div className="text-slate-400 transition-colors">
                                    {social.icon}
                                </div>
                                <div className="overflow-hidden">
                                    <span className="block text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                                        {social.name}
                                    </span>
                                    <span className="block truncate text-xs font-bold text-slate-700">
                                        {social.username}
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                <div className="mt-8 border-t border-slate-200 pt-4 text-center text-[10px] text-slate-400">
                    © 2026 Annamirah Travel. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
