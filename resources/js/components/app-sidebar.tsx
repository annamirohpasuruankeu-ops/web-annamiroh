import { Link } from '@inertiajs/react';
import {
    BookOpen,
    FolderGit2,
    LayoutGrid,
    Users,
    LogOut,
    Megaphone,
    Image,
    TrendingUp,
    ClipboardList,
    Coins,
    FileText,
    ShieldCheck,
    FileCheck2,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

import { usePage } from '@inertiajs/react';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard Saya',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutGrid,
    },
    {
        title: 'Booking Order',
        href: '/admin/orders',
        icon: ClipboardList,
    },
    {
        title: 'Rekomendasi Paspor',
        href: '/admin/recommendations',
        icon: FileText,
    },
    {
        title: 'Data Paket',
        href: '/admin/packages',
        icon: FolderGit2,
    },
    {
        title: 'Data Agen',
        href: '/admin/agents',
        icon: Users,
    },
    {
        title: 'Database Jamaah',
        href: '/admin/jamaah-database',
        icon: Users,
    },
    {
        title: 'Manifest Keberangkatan',
        href: '/admin/jamaah',
        icon: BookOpen,
    },
    {
        title: 'Popup Promo',
        href: '/admin/popup-promos',
        icon: Megaphone,
    },
    {
        title: 'Galeri Perjalanan',
        href: '/admin/galleries',
        icon: Image,
    },
    {
        title: 'Kelola Keuangan',
        href: '/admin/finance',
        icon: Coins,
    },
    {
        title: 'Tagihan Keagenan',
        href: '/admin/invoices',
        icon: FileText,
    },
    {
        title: 'Finalisasi Manifest',
        href: '/admin/manifests',
        icon: FileCheck2,
    },
    {
        title: 'Manajemen Admin',
        href: '/admin/admin-users',
        icon: ShieldCheck,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage<any>().props;
    const userRole = auth?.user?.role || 'user';

    const logoUrl = [
        'admin',
        'pusat',
        'admin_paket',
        'admin_manifest',
        'admin_keuangan',
    ].includes(userRole)
        ? '/admin'
        : userRole === 'agen'
          ? '/admin/jamaah'
          : '/dashboard';

    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="z-10 border-none !bg-emerald-900 text-white shadow-xl transition-all duration-300"
        >
            <SidebarHeader className="flex h-20 items-center justify-center border-b border-emerald-800 px-6 py-2">
                <Link
                    href={logoUrl}
                    prefetch
                    className="flex w-full items-center justify-center"
                >
                    <img
                        src="/images/LOGO 2 CABANG.png"
                        alt="Annamirah Travel"
                        className="h-12 w-auto max-w-full object-contain"
                    />
                </Link>
            </SidebarHeader>

            <SidebarContent>
                {userRole === 'user' && <NavMain items={mainNavItems} />}
                {userRole === 'admin' && (
                    <>
                        <div className="mt-4 px-5 py-3 text-xs font-bold tracking-wider text-emerald-300/70 uppercase">
                            Menu Admin
                        </div>
                        <NavMain items={adminNavItems} />
                    </>
                )}
                {userRole === 'admin_paket' && (
                    <NavMain
                        items={[
                            {
                                title: 'Dashboard',
                                href: '/admin',
                                icon: LayoutGrid,
                            },
                            {
                                title: 'Data Paket',
                                href: '/admin/packages',
                                icon: FolderGit2,
                            },
                            {
                                title: 'Booking Order',
                                href: '/admin/orders',
                                icon: ClipboardList,
                            },
                        ]}
                    />
                )}
                {userRole === 'admin_manifest' && (
                    <NavMain
                        items={[
                            {
                                title: 'Dashboard',
                                href: '/admin',
                                icon: LayoutGrid,
                            },
                            {
                                title: 'Booking Order',
                                href: '/admin/orders',
                                icon: ClipboardList,
                            },
                            {
                                title: 'Rekomendasi Paspor',
                                href: '/admin/recommendations',
                                icon: FileText,
                            },
                            {
                                title: 'Data Paket',
                                href: '/admin/packages',
                                icon: FolderGit2,
                            },
                            {
                                title: 'Database Jamaah',
                                href: '/admin/jamaah-database',
                                icon: Users,
                            },
                            {
                                title: 'Manifest Keberangkatan',
                                href: '/admin/jamaah',
                                icon: BookOpen,
                            },
                            {
                                title: 'Finalisasi Manifest',
                                href: '/admin/manifests',
                                icon: FileCheck2,
                            },
                        ]}
                    />
                )}
                {userRole === 'admin_keuangan' && (
                    <NavMain
                        items={[
                            {
                                title: 'Dashboard',
                                href: '/admin',
                                icon: LayoutGrid,
                            },
                            {
                                title: 'Kelola Keuangan',
                                href: '/admin/finance',
                                icon: Coins,
                            },
                            {
                                title: 'Tagihan Keagenan',
                                href: '/admin/invoices',
                                icon: FileText,
                            },
                            {
                                title: 'Booking Order',
                                href: '/admin/orders',
                                icon: ClipboardList,
                            },
                            {
                                title: 'Data Agen',
                                href: '/admin/agents',
                                icon: Users,
                            },
                            {
                                title: 'Data Paket',
                                href: '/admin/packages',
                                icon: FolderGit2,
                            },
                        ]}
                    />
                )}
                {userRole === 'pusat' && (
                    <NavMain
                        items={[
                            {
                                title: 'Manifest Final',
                                href: '/admin/manifests',
                                icon: FileCheck2,
                            },
                        ]}
                    />
                )}
                {userRole === 'agen' && (
                    <>
                        <div className="mt-4 px-5 py-3 text-xs font-bold tracking-wider text-emerald-300/70 uppercase">
                            Menu Agen
                        </div>
                        <NavMain
                            items={[
                                {
                                    title: 'Booking Order',
                                    href: '/admin/orders',
                                    icon: ClipboardList,
                                },
                                {
                                    title: 'Rekomendasi Paspor',
                                    href: '/admin/recommendations',
                                    icon: FileText,
                                },
                                {
                                    title: 'Data Paket',
                                    href: '/admin/packages',
                                    icon: FolderGit2,
                                },
                                {
                                    title: 'Database Jamaah',
                                    href: '/admin/jamaah-database',
                                    icon: Users,
                                },
                                {
                                    title: 'Manifest Keberangkatan',
                                    href: '/admin/jamaah',
                                    icon: BookOpen,
                                },
                                {
                                    title: 'Tagihan Agen',
                                    href: '/admin/invoices',
                                    icon: FileText,
                                },
                            ]}
                        />
                    </>
                )}
            </SidebarContent>

            <SidebarFooter className="border-t border-emerald-800 p-4">
                <Link
                    method="post"
                    as="button"
                    href="/logout"
                    className="flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-emerald-200 transition-colors hover:bg-emerald-800 hover:text-white"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </Link>
            </SidebarFooter>
        </Sidebar>
    );
}
