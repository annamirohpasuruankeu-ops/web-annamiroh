<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    private const ROLES = ['pusat', 'admin_paket', 'admin_manifest', 'admin_keuangan'];

    public function index(Request $request)
    {
        $users = User::whereIn('role', array_merge(['admin'], self::ROLES))
            ->when($request->filled('search'), fn ($q) => $q->where(fn ($sq) => $sq->where('name', 'like', '%'.$request->search.'%')->orWhere('email', 'like', '%'.$request->search.'%')))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/admin-users', [
            'users' => $users,
            'filters' => $request->only('search'),
            'roles' => self::ROLES,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'role' => ['required', Rule::in(self::ROLES)],
            'password' => 'required|string|min:8|confirmed',
        ]);

        User::create([
            ...$validated,
            'password' => Hash::make($validated['password']),
            'is_active' => true,
            'password_changed' => true,
        ]);

        return back()->with('success', 'Akun admin berhasil dibuat.');
    }

    public function update(Request $request, User $user)
    {
        abort_if($user->role === 'admin', 403, 'Akun Super Admin tidak dapat diubah dari menu ini.');
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role' => ['required', Rule::in(self::ROLES)],
        ]);

        $user->update($validated);

        return back()->with('success', 'Akun admin berhasil diperbarui.');
    }

    public function toggle(Request $request, User $user)
    {
        abort_if($user->id === $request->user()->id || $user->role === 'admin', 403, 'Akun Super Admin tidak dapat dinonaktifkan.');
        abort_unless(in_array($user->role, self::ROLES, true), 404);
        $user->update(['is_active' => !$user->is_active]);

        return back()->with('success', 'Status akun berhasil diperbarui.');
    }

    public function resetPassword(Request $request, User $user)
    {
        abort_if($user->role === 'admin', 403, 'Password Super Admin tidak dapat direset dari menu ini.');
        abort_unless(in_array($user->role, self::ROLES, true), 404);
        $validated = $request->validate(['password' => 'required|string|min:8|confirmed']);
        $user->update(['password' => Hash::make($validated['password']), 'password_changed' => true]);

        return back()->with('success', 'Password berhasil direset.');
    }
}
