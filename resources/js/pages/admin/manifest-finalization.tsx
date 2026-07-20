import { Head, router } from '@inertiajs/react';
import {
    Download,
    FileCheck2,
    History,
    Lock,
    Search,
    Unlock,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const roleName: Record<string, string> = {
    admin: 'Super Admin',
    pusat: 'Admin Pusat',
    admin_manifest: 'Admin Manifest',
};

export default function ManifestFinalization({
    packages,
    activities,
    filters,
    canManage,
    pageTitle,
}: any) {
    const [search, setSearch] = useState(filters?.search || '');
    const [historyPackage, setHistoryPackage] = useState<number | null>(null);

    const lockManifest = (id: number) => {
        if (
            confirm(
                'Kunci manifest ini? Setelah dikunci, booking dan data jamaah pada paket tidak dapat diubah.',
            )
        ) {
            router.post(
                `/admin/manifests/${id}/lock`,
                {},
                { preserveScroll: true },
            );
        }
    };
    const unlockManifest = (id: number) => {
        const reason = prompt(
            'Tuliskan alasan membuka kunci manifest (wajib):',
        );

        if (reason?.trim()) {
router.post(
                `/admin/manifests/${id}/unlock`,
                { reason },
                { preserveScroll: true },
            );
}
    };

    const filteredHistory = historyPackage
        ? activities.filter((a: any) => a.package_id === historyPackage)
        : activities;
    const actionLabel: Record<string, string> = {
        locked: 'Dikunci',
        unlocked: 'Dibuka',
        downloaded: 'Diunduh',
    };

    return (
        <div className="mx-auto min-h-screen w-full max-w-7xl bg-slate-50 p-6 md:p-8">
            <Head title={pageTitle} />
            <div className="mb-8 rounded-3xl bg-emerald-900 p-8 text-white shadow-xl">
                <h1 className="flex items-center gap-3 text-3xl font-black">
                    <FileCheck2 className="text-amber-400" />
                    {pageTitle}
                </h1>
                <p className="mt-2 text-emerald-100">
                    {canManage
                        ? 'Periksa, kunci, buka kunci, dan unduh manifest per paket.'
                        : 'Unduh manifest versi final yang sudah dikunci.'}
                </p>
            </div>
            <div className="mb-6 flex gap-2 rounded-2xl border bg-white p-4 shadow-sm">
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) =>
                        e.key === 'Enter' &&
                        router.get('/admin/manifests', { search })
                    }
                    placeholder="Cari kode atau nama paket..."
                />
                <Button
                    onClick={() => router.get('/admin/manifests', { search })}
                >
                    <Search size={17} />
                </Button>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-100 text-left text-slate-600">
                            <tr>
                                <th className="p-4">Paket</th>
                                <th className="p-4">Keberangkatan</th>
                                <th className="p-4 text-center">Jamaah</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Finalisasi</th>
                                <th className="p-4 text-right">Tindakan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {packages.map((pkg: any) => (
                                <tr
                                    key={pkg.id}
                                    className="border-t border-slate-100"
                                >
                                    <td className="p-4">
                                        <p className="font-bold text-slate-800">
                                            {pkg.name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {pkg.code || '-'}
                                        </p>
                                    </td>
                                    <td className="p-4">
                                        {pkg.departure_date
                                            ? new Date(
                                                  pkg.departure_date,
                                              ).toLocaleDateString('id-ID')
                                            : '-'}
                                    </td>
                                    <td className="p-4 text-center font-bold">
                                        {pkg.jamaah_count}
                                    </td>
                                    <td className="p-4">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-bold ${pkg.status === 'final' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
                                        >
                                            {pkg.status === 'final'
                                                ? `Final · Versi ${pkg.version}`
                                                : 'Draft'}
                                        </span>
                                        {pkg.status === 'final' &&
                                            pkg.download_count === 0 && (
                                                <span className="ml-2 rounded-full bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">
                                                    Belum diunduh
                                                </span>
                                            )}
                                    </td>
                                    <td className="p-4 text-xs text-slate-600">
                                        {pkg.locked_by ? (
                                            <>
                                                <p>{pkg.locked_by}</p>
                                                <p>
                                                    {new Date(
                                                        pkg.locked_at,
                                                    ).toLocaleString('id-ID')}
                                                </p>
                                                <p>
                                                    {pkg.download_count} kali
                                                    diunduh
                                                </p>
                                            </>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-end gap-2">
                                            {canManage &&
                                                pkg.status !== 'final' && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            lockManifest(pkg.id)
                                                        }
                                                    >
                                                        <Lock size={15} /> Kunci
                                                    </Button>
                                                )}
                                            {canManage &&
                                                pkg.status === 'final' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            unlockManifest(
                                                                pkg.id,
                                                            )
                                                        }
                                                    >
                                                        <Unlock size={15} />{' '}
                                                        Buka
                                                    </Button>
                                                )}
                                            {pkg.status === 'final' && (
                                                <a
                                                    href={`/admin/manifests/${pkg.id}/download`}
                                                    className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-2 text-xs font-bold text-white"
                                                >
                                                    <Download size={15} /> Excel
                                                </a>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() =>
                                                    setHistoryPackage(pkg.id)
                                                }
                                                title="Riwayat"
                                            >
                                                <History size={16} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {packages.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="p-10 text-center text-slate-500"
                                    >
                                        Belum ada manifest yang tersedia.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-lg font-bold">
                        <History size={19} />
                        Riwayat {historyPackage ? 'Paket Terpilih' : 'Terbaru'}
                    </h2>
                    {historyPackage && (
                        <Button
                            variant="ghost"
                            onClick={() => setHistoryPackage(null)}
                        >
                            Tampilkan Semua
                        </Button>
                    )}
                </div>
                <div className="space-y-3">
                    {filteredHistory.map((item: any) => (
                        <div
                            key={item.id}
                            className="flex flex-col justify-between rounded-xl bg-slate-50 p-4 text-sm md:flex-row"
                        >
                            <div>
                                <span className="font-bold text-slate-800">
                                    {actionLabel[item.action] || item.action}
                                </span>{' '}
                                · Versi {item.version || '-'} · {item.user_name}{' '}
                                ({roleName[item.user_role] || item.user_role})
                                {item.reason && (
                                    <p className="mt-1 text-slate-600">
                                        Alasan: {item.reason}
                                    </p>
                                )}
                            </div>
                            <span className="mt-2 text-xs text-slate-500 md:mt-0">
                                {new Date(item.created_at).toLocaleString(
                                    'id-ID',
                                )}
                            </span>
                        </div>
                    ))}
                    {filteredHistory.length === 0 && (
                        <p className="text-sm text-slate-500">
                            Belum ada riwayat.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
