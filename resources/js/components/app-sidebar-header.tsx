import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Search, Bell, ChevronDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { usePage } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage<any>().props;
    const getInitials = useInitials();
    const userRole = auth.user?.role || 'user';
    const roleMap: Record<string, string> = {
        admin: 'Administrator',
        pusat: 'Pusat',
        agen: 'Agen Cabang',
        user: 'Jamaah',
    };

    return (
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-6 transition-[width,height] ease-linear">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="-ml-1" />
                <div className="hidden md:block">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            </div>

            <div className="flex items-center space-x-6">
                {/* <div className="relative hidden lg:block">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-64 pl-10 pr-3 py-2 border border-gray-200 rounded-full leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 sm:text-sm transition-colors"
                        placeholder="Pencarian cepat..."
                    />
                </div> */}

                <button className="relative hidden text-gray-400 transition-colors hover:text-gray-500 focus:outline-none sm:block">
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
                </button>

                {auth.user && (
                    <DropdownMenu>
                        <DropdownMenuTrigger className="focus:outline-none">
                            <div className="group flex cursor-pointer items-center space-x-3">
                                <Avatar className="h-10 w-10 rounded-full border-2 border-emerald-100 object-cover transition-colors group-hover:border-emerald-300">
                                    <AvatarImage
                                        src={auth.user.avatar}
                                        alt={auth.user.name}
                                    />
                                    <AvatarFallback className="bg-emerald-100 font-bold text-emerald-700">
                                        {getInitials(auth.user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="hidden text-left md:block">
                                    <p className="text-sm font-bold text-gray-700">
                                        {auth.user.name}
                                    </p>
                                    <p className="text-xs font-medium text-gray-500">
                                        {roleMap[userRole]}
                                    </p>
                                </div>
                                <ChevronDown
                                    size={16}
                                    className="hidden text-gray-400 md:block"
                                />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="mt-2 w-56 rounded-xl"
                        >
                            <UserMenuContent user={auth.user} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </header>
    );
}
