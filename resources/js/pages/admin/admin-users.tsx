import { Head, router, useForm } from '@inertiajs/react';
import {
    Edit3,
    KeyRound,
    Plus,
    Search,
    ShieldCheck,
    UserCheck,
    UserX,
    X,
} from 'lucide-react';
import { useState } from 'react';
import Pagination from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const labels: Record<string, string> = {
    admin: 'Super Admin',
    pusat: 'Admin Pusat',
    admin_paket: 'Admin Paket',
    admin_manifest: 'Admin Manifest',
    admin_keuangan: 'Admin Keuangan',
};

export default function AdminUsers({ users, filters, roles }: any) {
    const [search, setSearch] = useState(filters?.search || '');
    const [modal, setModal] = useState<'create' | 'edit' | 'password' | null>(
        null,
    );
    const [selected, setSelected] = useState<any>(null);
    const form = useForm({
        name: '',
        email: '',
        role: 'admin_manifest',
        password: '',
        password_confirmation: '',
    });
    const openCreate = () => {
        setSelected(null);
        form.reset();
        setModal('create');
    };
    const openEdit = (user: any) => {
        setSelected(user);
        form.setData({
            ...form.data,
            name: user.name,
            email: user.email,
            role: user.role,
            password: '',
            password_confirmation: '',
        });
        setModal('edit');
    };
    const openPassword = (user: any) => {
        setSelected(user);
        form.setData('password', '');
        form.setData('password_confirmation', '');
        setModal('password');
    };
    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (modal === 'create') {
form.post('/admin/admin-users', {
                onSuccess: () => setModal(null),
            });
} else if (modal === 'edit') {
form.put(`/admin/admin-users/${selected.id}`, {
                onSuccess: () => setModal(null),
            });
} else {
form.patch(`/admin/admin-users/${selected.id}/reset-password`, {
                onSuccess: () => setModal(null),
            });
}
    };

    return (
        <div className="mx-auto min-h-screen w-full max-w-7xl bg-slate-50 p-6 md:p-8">
            <Head title="Manajemen Admin" />
            <div className="mb-8 flex flex-col justify-between gap-4 rounded-3xl bg-emerald-900 p-8 text-white shadow-xl md:flex-row md:items-center">
                <div>
                    <h1 className="flex items-center gap-3 text-3xl font-black">
                        <ShieldCheck className="text-amber-400" />
                        Manajemen Admin
                    </h1>
                    <p className="mt-2 text-emerald-100">
                        Kelola akun dan pembagian tugas administrator.
                    </p>
                </div>
                <Button
                    onClick={openCreate}
                    className="bg-amber-400 font-bold text-emerald-950 hover:bg-amber-300"
                >
                    <Plus size={17} /> Tambah Admin
                </Button>
            </div>
            <div className="mb-6 flex gap-2 rounded-2xl border bg-white p-4">
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) =>
                        e.key === 'Enter' &&
                        router.get('/admin/admin-users', { search })
                    }
                    placeholder="Cari nama atau email..."
                />
                <Button
                    onClick={() => router.get('/admin/admin-users', { search })}
                >
                    <Search size={17} />
                </Button>
            </div>
            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-100 text-left">
                            <tr>
                                <th className="p-4">Nama</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Tindakan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.map((user: any) => (
                                <tr key={user.id} className="border-t">
                                    <td className="p-4 font-bold">
                                        {user.name}
                                    </td>
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4">{labels[user.role]}</td>
                                    <td className="p-4">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-bold ${user.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}
                                        >
                                            {user.is_active
                                                ? 'Aktif'
                                                : 'Nonaktif'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-end gap-2">
                                            {user.role !== 'admin' && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            openEdit(user)
                                                        }
                                                    >
                                                        <Edit3 size={15} />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            openPassword(user)
                                                        }
                                                    >
                                                        <KeyRound size={15} />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.patch(
                                                                `/admin/admin-users/${user.id}/toggle`,
                                                            )
                                                        }
                                                    >
                                                        {user.is_active ? (
                                                            <UserX size={15} />
                                                        ) : (
                                                            <UserCheck
                                                                size={15}
                                                            />
                                                        )}
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Pagination links={users.links} />
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
                    <form
                        onSubmit={submit}
                        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
                    >
                        <div className="mb-5 flex justify-between">
                            <h2 className="text-xl font-bold">
                                {modal === 'create'
                                    ? 'Tambah Admin'
                                    : modal === 'edit'
                                      ? 'Ubah Admin'
                                      : 'Reset Password'}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setModal(null)}
                            >
                                <X />
                            </button>
                        </div>
                        {modal !== 'password' && (
                            <div className="space-y-4">
                                <Input
                                    value={form.data.name}
                                    onChange={(e) =>
                                        form.setData('name', e.target.value)
                                    }
                                    placeholder="Nama"
                                />
                                <Input
                                    type="email"
                                    value={form.data.email}
                                    onChange={(e) =>
                                        form.setData('email', e.target.value)
                                    }
                                    placeholder="Email"
                                />
                                <select
                                    value={form.data.role}
                                    onChange={(e) =>
                                        form.setData('role', e.target.value)
                                    }
                                    className="w-full rounded-md border p-2"
                                >
                                    {roles.map((role: string) => (
                                        <option key={role} value={role}>
                                            {labels[role]}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}{' '}
                        {(modal === 'create' || modal === 'password') && (
                            <div className="mt-4 space-y-4">
                                <Input
                                    type="password"
                                    value={form.data.password}
                                    onChange={(e) =>
                                        form.setData('password', e.target.value)
                                    }
                                    placeholder="Password baru"
                                />
                                <Input
                                    type="password"
                                    value={form.data.password_confirmation}
                                    onChange={(e) =>
                                        form.setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Konfirmasi password"
                                />
                            </div>
                        )}
                        <div className="mt-6 flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setModal(null)}
                            >
                                Batal
                            </Button>
                            <Button disabled={form.processing}>Simpan</Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
