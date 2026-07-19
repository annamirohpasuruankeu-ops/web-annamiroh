import { Link } from '@inertiajs/react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <div className="space-y-1 px-4">
            {items.map((item) => {
                const active = isCurrentUrl(item.href);
                return (
                    <Link
                        key={item.title}
                        href={item.href}
                        className={`flex w-full items-center justify-between rounded-xl px-4 py-3 transition-all duration-200 ${
                            active
                                ? 'border border-emerald-700/50 bg-emerald-800/60 text-white shadow-sm'
                                : 'text-emerald-100/80 hover:bg-emerald-800/30 hover:text-white'
                        }`}
                        prefetch
                    >
                        <div className="flex items-center space-x-3">
                            <span
                                className={
                                    active
                                        ? 'text-amber-400'
                                        : 'text-emerald-300'
                                }
                            >
                                {item.icon && <item.icon size={20} />}
                            </span>
                            <span className="font-medium">{item.title}</span>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
