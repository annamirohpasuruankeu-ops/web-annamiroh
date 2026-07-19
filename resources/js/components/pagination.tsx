import { Link } from '@inertiajs/react';

export default function Pagination({ links }: { links: any[] }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-1">
            {links.map((link, k) => (
                <div key={k}>
                    {link.url === null ? (
                        <div
                            className="cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-400"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : (
                        <Link
                            preserveScroll
                            href={link.url}
                            className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                                link.active
                                    ? 'border-emerald-600 bg-emerald-600 font-semibold text-white shadow-md shadow-emerald-600/20'
                                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
