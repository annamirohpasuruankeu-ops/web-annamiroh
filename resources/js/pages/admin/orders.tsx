import { Head, useForm, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    Search,
    Plus,
    Edit3,
    Lock,
    Unlock,
    ClipboardList,
    Info,
    FileText,
    CheckCircle2,
    AlertTriangle,
    UserCheck,
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Label } from '@/components/ui/label';

interface OrderItem {
    id: number;
    package_id: number;
    package_name: string;
    departure_date: string;
    agent_id: number;
    agent_name: string;
    total_pax: number;
    keterangan: string | null;
    status_kunci: 'open' | 'locked';
    inputted_pax: number;
    missing_pax: number;
    incomplete_pax: number;
    created_at: string;
}

export default function Orders({
    orders,
    packages,
    activePackages,
    agents,
    totalJamaahRegistered,
    userRole,
    filters,
    errors,
}: PageProps<{
    orders: OrderItem[];
    packages: any[];
    activePackages: any[];
    agents: any[];
    totalJamaahRegistered: number;
    userRole: string;
    filters: any;
}>) {
    const [agentFilter, setAgentFilter] = useState(filters?.agent_id || '');
    const [packageFilter, setPackageFilter] = useState(
        filters?.package_id || '',
    );
    const [editingOrder, setEditingOrder] = useState<OrderItem | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const isAdmin = ['admin', 'pusat'].includes(userRole);

    const {
        data,
        setData,
        post,
        put,
        processing,
        errors: formErrors,
        reset,
    } = useForm({
        package_id: '',
        agent_id: '',
        total_pax: 1,
        keterangan: '',
    });

    const handleFilterChange = (agentId: string, pkgId: string) => {
        router.get(
            '/admin/orders',
            {
                agent_id: agentId,
                package_id: pkgId,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleResetFilter = () => {
        setAgentFilter('');
        setPackageFilter('');
        router.get('/admin/orders', {}, { replace: true });
    };

    const openCreate = () => {
        reset();
        setData({
            package_id: activePackages[0]?.id?.toString() || '',
            agent_id: agents[0]?.id?.toString() || '',
            total_pax: 1,
            keterangan: '',
        });
        setShowCreateModal(true);
    };

    const openEdit = (order: OrderItem) => {
        setEditingOrder(order);
        setData({
            package_id: order.package_id.toString(),
            agent_id: order.agent_id.toString(),
            total_pax: order.total_pax,
            keterangan: order.keterangan || '',
        });
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/orders', {
            onSuccess: () => {
                setShowCreateModal(false);
                reset();
            },
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingOrder) return;
        put(`/admin/orders/${editingOrder.id}`, {
            onSuccess: () => {
                setEditingOrder(null);
                reset();
            },
        });
    };

    const toggleLock = (id: number) => {
        if (!confirm('Ubah status kunci order ini?')) return;
        router.patch(
            `/admin/orders/${id}/toggle-lock`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <div className="mx-auto min-h-screen w-full max-w-7xl bg-slate-50 p-6 font-sans md:p-8">
            <Head title="Dashboard Order & Booking" />

            {/* Header Banner */}
            <div className="relative mb-8 flex flex-col items-start justify-between overflow-hidden rounded-[2rem] border border-emerald-800 bg-emerald-900 p-8 text-white shadow-2xl shadow-emerald-900/10 md:flex-row md:items-center md:p-10">
                <div className="absolute top-0 right-0 h-96 w-96 translate-x-1/3 -translate-y-1/2 rounded-full bg-amber-500 opacity-20 blur-3xl"></div>
                <div className="relative z-10">
                    <span className="mb-4 inline-block rounded-full bg-amber-400 px-3 py-1 text-[10px] font-bold tracking-widest text-emerald-950 uppercase shadow-sm shadow-amber-400/20">
                        {userRole === 'admin'
                            ? 'Super Admin'
                            : userRole === 'pusat'
                              ? 'Pusat'
                              : 'Agen Resmi'}
                    </span>
                    <h2 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight md:text-4xl">
                        <ClipboardList className="text-amber-400" size={36} />
                        Dashboard Booking Order
                    </h2>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-emerald-100/80 md:text-base">
                        Kelola antrean pemesanan kursi, pantau jumlah target
                        pax, dan kelola kelengkapan berkas jamaah per agen
                        secara terpusat.
                    </p>
                </div>
                <div className="relative z-10 mt-6 min-w-[200px] rounded-2xl border border-white/10 bg-white/10 p-5 text-right backdrop-blur-md md:mt-0">
                    <span className="mb-1 block text-[10px] font-bold tracking-wider text-emerald-200 uppercase">
                        TOTAL JAMAAH TERDAFTAR
                    </span>
                    <span className="text-4xl font-black tracking-tight text-amber-400">
                        {totalJamaahRegistered}
                    </span>
                    <span className="mt-1 block text-xs text-white/80">
                        Pax Terisi / Target
                    </span>
                </div>
            </div>

            {errors?.message && (
                <div className="mb-8 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600 shadow-sm">
                    <div className="h-2 w-2 animate-ping rounded-full bg-red-500"></div>
                    {errors.message}
                </div>
            )}

            {/* Filters and Search */}
            <div className="mb-6 flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center">
                <div className="flex flex-1 flex-wrap items-center gap-3">
                    {/* Agent Filter for admin/pusat */}
                    {isAdmin && (
                        <div className="w-full md:w-56">
                            <select
                                value={agentFilter}
                                onChange={(e) => {
                                    setAgentFilter(e.target.value);
                                    handleFilterChange(
                                        e.target.value,
                                        packageFilter,
                                    );
                                }}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700 focus:border-emerald-500 focus:ring-emerald-500"
                            >
                                <option value="">Semua Agen</option>
                                {agents.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Package Filter */}
                    <div className="w-full md:w-56">
                        <select
                            value={packageFilter}
                            onChange={(e) => {
                                setPackageFilter(e.target.value);
                                handleFilterChange(agentFilter, e.target.value);
                            }}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700 focus:border-emerald-500 focus:ring-emerald-500"
                        >
                            <option value="">Semua Paket / Tanggal</option>
                            {packages.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Button
                        onClick={handleResetFilter}
                        variant="outline"
                        className="rounded-xl border-slate-200 font-bold text-slate-600 hover:bg-slate-100"
                    >
                        Reset Filter
                    </Button>
                </div>

                {/* Create Order Button */}
                {userRole !== 'pusat' && (
                    <Button
                        onClick={openCreate}
                        className="gap-2 rounded-xl bg-emerald-600 px-5 py-6 font-bold text-white shadow-lg shadow-emerald-600/10 hover:bg-emerald-700"
                    >
                        <Plus size={18} /> BUAT ORDER BARU
                    </Button>
                )}
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-bold tracking-wider uppercase">
                                Tgl Berangkat / Paket
                            </th>
                            <th className="px-6 py-4 text-[10px] font-bold tracking-wider uppercase">
                                Agen
                            </th>
                            <th className="px-6 py-4 text-[10px] font-bold tracking-wider uppercase">
                                Status Data & Pax
                            </th>
                            <th className="px-6 py-4 text-[10px] font-bold tracking-wider uppercase">
                                Kunci
                            </th>
                            <th className="px-6 py-4 text-right text-[10px] font-bold tracking-wider uppercase">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {orders.map((order) => {
                            const isDataLengkap =
                                order.missing_pax === 0 &&
                                order.incomplete_pax === 0;

                            return (
                                <tr
                                    key={order.id}
                                    className="transition-colors hover:bg-slate-50/50"
                                >
                                    <td className="px-6 py-5">
                                        <div className="text-base font-extrabold text-slate-800">
                                            {order.package_name}
                                        </div>
                                        {order.departure_date && (
                                            <div className="mt-1 text-xs font-medium text-slate-500">
                                                Keberangkatan:{' '}
                                                {new Date(
                                                    order.departure_date,
                                                ).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </div>
                                        )}
                                        {order.keterangan && (
                                            <div className="border-slate-150 mt-2 max-w-xs rounded-lg border bg-slate-50 p-2 text-xs whitespace-normal text-slate-400 italic">
                                                Ket: {order.keterangan}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 font-bold text-slate-700">
                                        {order.agent_name}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-2">
                                            <span className="text-xs font-bold text-slate-600">
                                                Target:{' '}
                                                <span className="text-sm font-extrabold text-slate-900">
                                                    {order.total_pax} Pax
                                                </span>
                                            </span>
                                            <div className="flex flex-col gap-1.5">
                                                {order.missing_pax > 0 && (
                                                    <span className="inline-flex w-max items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700">
                                                        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500"></div>
                                                        Kurang Input:{' '}
                                                        {order.missing_pax} org
                                                    </span>
                                                )}
                                                {order.incomplete_pax > 0 && (
                                                    <span className="inline-flex w-max items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500"></div>
                                                        Data Belum Lengkap:{' '}
                                                        {order.incomplete_pax}{' '}
                                                        org
                                                    </span>
                                                )}
                                                {isDataLengkap && (
                                                    <span className="inline-flex w-max items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                                        Data Lengkap
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase ${order.status_kunci === 'open' ? 'border border-emerald-200 bg-emerald-50 text-emerald-700' : 'border border-red-200 bg-red-50 text-red-700'}`}
                                        >
                                            {order.status_kunci === 'open' ? (
                                                <Unlock size={12} />
                                            ) : (
                                                <Lock size={12} />
                                            )}
                                            {order.status_kunci === 'open'
                                                ? 'OPEN'
                                                : 'LOCKED'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* Isi Jamaah */}
                                            {order.status_kunci === 'open' && (
                                                <Button
                                                    onClick={() =>
                                                        router.get(
                                                            `/admin/orders/${order.id}/isi-jamaah`,
                                                        )
                                                    }
                                                    className="rounded-lg bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700"
                                                    size="sm"
                                                >
                                                    Isi Jamaah
                                                </Button>
                                            )}

                                            {/* Edit */}
                                            {userRole !== 'pusat' &&
                                                (order.status_kunci ===
                                                    'open' ||
                                                    isAdmin) && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            openEdit(order)
                                                        }
                                                        className="rounded-lg border-blue-200 bg-blue-50 font-bold text-blue-600 shadow-sm hover:bg-blue-100 hover:text-blue-800"
                                                        title="Edit Order"
                                                    >
                                                        <Edit3 size={14} />
                                                    </Button>
                                                )}

                                            {/* Lock Toggle */}
                                            {isAdmin && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        toggleLock(order.id)
                                                    }
                                                    className="rounded-lg border-amber-200 bg-amber-50 font-bold text-amber-700 shadow-sm hover:bg-amber-100 hover:text-amber-800"
                                                    title={
                                                        order.status_kunci ===
                                                        'open'
                                                            ? 'Kunci Order'
                                                            : 'Buka Kunci Order'
                                                    }
                                                >
                                                    {order.status_kunci ===
                                                    'open' ? (
                                                        <Lock size={14} />
                                                    ) : (
                                                        <Unlock size={14} />
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {orders.length === 0 && (
                    <div className="bg-slate-50 p-12 text-center text-sm font-medium text-slate-500">
                        Belum ada data order booking.
                    </div>
                )}
            </div>

            {/* Create Order Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                    <div className="flex w-full max-w-md animate-in flex-col overflow-hidden rounded-3xl bg-white p-0 shadow-2xl duration-200 zoom-in-95">
                        <div className="relative flex items-center justify-between overflow-hidden bg-emerald-900 p-6 text-white">
                            <div className="absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500 opacity-20 blur-2xl"></div>
                            <h2 className="relative z-10 flex items-center gap-2 text-xl font-bold">
                                <ClipboardList
                                    size={20}
                                    className="text-amber-400"
                                />{' '}
                                Buat Order Baru
                            </h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="relative z-10 text-emerald-300 transition-colors hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form
                            onSubmit={submitCreate}
                            className="space-y-6 p-6 md:p-8"
                        >
                            {/* Package */}
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">
                                    Tanggal Keberangkatan / Paket
                                </Label>
                                <select
                                    required
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    value={data.package_id}
                                    onChange={(e) =>
                                        setData('package_id', e.target.value)
                                    }
                                >
                                    {activePackages.map((pkg) => (
                                        <option key={pkg.id} value={pkg.id}>
                                            {pkg.name} (Sisa:{' '}
                                            {pkg.available_seats} seat - Rp{' '}
                                            {Number(pkg.price).toLocaleString(
                                                'id-ID',
                                            )}
                                            {pkg.harga_agen
                                                ? ` / Agen: Rp ${Number(pkg.harga_agen).toLocaleString('id-ID')}`
                                                : ''}
                                            )
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Agent */}
                            {isAdmin && (
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">
                                        Nama Agen
                                    </Label>
                                    <select
                                        required
                                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        value={data.agent_id}
                                        onChange={(e) =>
                                            setData('agent_id', e.target.value)
                                        }
                                    >
                                        {agents.map((a) => (
                                            <option key={a.id} value={a.id}>
                                                {a.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Pax Count */}
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">
                                    Jumlah Pax
                                </Label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    value={data.total_pax}
                                    onChange={(e) =>
                                        setData(
                                            'total_pax',
                                            parseInt(e.target.value),
                                        )
                                    }
                                />
                                {formErrors.total_pax && (
                                    <p className="mt-1 text-xs font-bold text-red-500">
                                        {formErrors.total_pax}
                                    </p>
                                )}
                            </div>

                            {/* Keterangan */}
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">
                                    Keterangan
                                </Label>
                                <textarea
                                    className="min-h-[80px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    value={data.keterangan}
                                    onChange={(e) =>
                                        setData('keterangan', e.target.value)
                                    }
                                    placeholder="Opsional, misal: titipan rombongan A"
                                />
                            </div>

                            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowCreateModal(false)}
                                    className="rounded-xl border-slate-300 px-6 font-bold text-slate-600 hover:bg-slate-50"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-emerald-600 px-6 font-bold text-white shadow-md hover:bg-emerald-700"
                                >
                                    Buat Order
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Order Modal */}
            {editingOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                    <div className="flex w-full max-w-md animate-in flex-col overflow-hidden rounded-3xl bg-white p-0 shadow-2xl duration-200 zoom-in-95">
                        <div className="relative flex items-center justify-between overflow-hidden bg-emerald-900 p-6 text-white">
                            <div className="absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500 opacity-20 blur-2xl"></div>
                            <h2 className="relative z-10 flex items-center gap-2 text-xl font-bold">
                                <ClipboardList
                                    size={20}
                                    className="text-amber-400"
                                />{' '}
                                Edit Order #{editingOrder.id}
                            </h2>
                            <button
                                onClick={() => setEditingOrder(null)}
                                className="relative z-10 text-emerald-300 transition-colors hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form
                            onSubmit={submitEdit}
                            className="space-y-6 p-6 md:p-8"
                        >
                            {/* Package */}
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">
                                    Tanggal Keberangkatan / Paket
                                </Label>
                                <select
                                    required
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    value={data.package_id}
                                    onChange={(e) =>
                                        setData('package_id', e.target.value)
                                    }
                                >
                                    {packages.map((pkg) => (
                                        <option key={pkg.id} value={pkg.id}>
                                            {pkg.name} (Rp{' '}
                                            {Number(pkg.price).toLocaleString(
                                                'id-ID',
                                            )}
                                            {pkg.harga_agen
                                                ? ` / Agen: Rp ${Number(pkg.harga_agen).toLocaleString('id-ID')}`
                                                : ''}
                                            )
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Agent */}
                            {isAdmin && (
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">
                                        Nama Agen
                                    </Label>
                                    <select
                                        required
                                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        value={data.agent_id}
                                        onChange={(e) =>
                                            setData('agent_id', e.target.value)
                                        }
                                    >
                                        {agents.map((a) => (
                                            <option key={a.id} value={a.id}>
                                                {a.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Pax Count */}
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">
                                    Jumlah Pax
                                </Label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    value={data.total_pax}
                                    onChange={(e) =>
                                        setData(
                                            'total_pax',
                                            parseInt(e.target.value),
                                        )
                                    }
                                />
                                {formErrors.total_pax && (
                                    <p className="mt-1 text-xs font-bold text-red-500">
                                        {formErrors.total_pax}
                                    </p>
                                )}
                            </div>

                            {/* Keterangan */}
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">
                                    Keterangan
                                </Label>
                                <textarea
                                    className="min-h-[80px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    value={data.keterangan}
                                    onChange={(e) =>
                                        setData('keterangan', e.target.value)
                                    }
                                />
                            </div>

                            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditingOrder(null)}
                                    className="rounded-xl border-slate-300 px-6 font-bold text-slate-600 hover:bg-slate-50"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-amber-500 px-6 font-bold text-amber-950 shadow-md hover:bg-amber-600"
                                >
                                    Simpan Perubahan
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

Orders.layout = {
    breadcrumbs: [{ title: 'Booking Order', href: '/admin/orders' }],
};
