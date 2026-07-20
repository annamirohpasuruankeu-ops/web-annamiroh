import { Head } from '@inertiajs/react';
import { CalendarDays, LayoutDashboard } from 'lucide-react';

export default function RoleDashboard({
    title,
    description,
    cards,
    packages,
}: any) {
    const formatValue = (card: any) =>
        card.currency
            ? new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  maximumFractionDigits: 0,
              }).format(Number(card.value || 0))
            : new Intl.NumberFormat('id-ID').format(Number(card.value || 0));

    return (
        <div className="mx-auto min-h-screen w-full max-w-7xl bg-slate-50 p-6 md:p-8">
            <Head title={title} />
            <div className="mb-8 rounded-3xl bg-emerald-900 p-8 text-white shadow-xl">
                <h1 className="flex items-center gap-3 text-3xl font-black">
                    <LayoutDashboard className="text-amber-400" />
                    {title}
                </h1>
                <p className="mt-2 text-emerald-100">{description}</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((card: any) => (
                    <div
                        key={card.label}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                        <p className="text-sm font-semibold text-slate-500">
                            {card.label}
                        </p>
                        <p className="mt-2 text-2xl font-black text-slate-800">
                            {formatValue(card)}
                        </p>
                    </div>
                ))}
            </div>
            {packages.length > 0 && (
                <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-5">
                        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                            <CalendarDays size={20} />
                            Paket dan Keberangkatan
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-left text-slate-500">
                                <tr>
                                    <th className="p-4">Kode</th>
                                    <th className="p-4">Paket</th>
                                    <th className="p-4">Keberangkatan</th>
                                    <th className="p-4 text-center">
                                        Kapasitas
                                    </th>
                                    <th className="p-4 text-center">
                                        Tersedia
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {packages.map((pkg: any) => (
                                    <tr
                                        key={pkg.id}
                                        className="border-t border-slate-100"
                                    >
                                        <td className="p-4 font-semibold">
                                            {pkg.code || '-'}
                                        </td>
                                        <td className="p-4">{pkg.name}</td>
                                        <td className="p-4">
                                            {pkg.departure_date
                                                ? new Date(
                                                      pkg.departure_date,
                                                  ).toLocaleDateString('id-ID')
                                                : '-'}
                                        </td>
                                        <td className="p-4 text-center">
                                            {pkg.total_seats}
                                        </td>
                                        <td className="p-4 text-center">
                                            {pkg.available_seats}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
