<?php

namespace App\Http\Controllers;

use App\Models\FinanceRecord;
use App\Models\JamaahMember;
use App\Models\Order;
use App\Models\Package;
use App\Models\Recommendation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleDashboardController extends Controller
{
    public function index(Request $request)
    {
        return match ($request->user()->role) {
            'admin' => app(AdminController::class)->index($request),
            'admin_paket' => $this->packageDashboard(),
            'admin_manifest' => $this->manifestDashboard(),
            'admin_keuangan' => $this->financeDashboard(),
            'pusat' => redirect()->route('admin.manifests.index'),
            'agen' => redirect()->route('admin.orders'),
            default => redirect()->route('dashboard'),
        };
    }

    private function packageDashboard()
    {
        $packages = Package::withCount('bookings')->orderBy('departure_date')->get();

        return Inertia::render('admin/role-dashboard', [
            'title' => 'Dashboard Admin Paket',
            'description' => 'Ringkasan paket, jadwal keberangkatan, dan ketersediaan kursi.',
            'cards' => [
                ['label' => 'Paket Aktif', 'value' => $packages->where('is_active', true)->count()],
                ['label' => 'Paket Tidak Aktif', 'value' => $packages->where('is_active', false)->count()],
                ['label' => 'Total Kapasitas', 'value' => $packages->sum('total_seats')],
                ['label' => 'Kursi Tersedia', 'value' => $packages->sum('available_seats')],
            ],
            'packages' => $packages->take(10),
        ]);
    }

    private function manifestDashboard()
    {
        return Inertia::render('admin/role-dashboard', [
            'title' => 'Dashboard Admin Manifest',
            'description' => 'Ringkasan jamaah, booking, dan kesiapan manifest keberangkatan.',
            'cards' => [
                ['label' => 'Total Jamaah', 'value' => JamaahMember::count()],
                ['label' => 'Booking Order', 'value' => Order::count()],
                ['label' => 'Manifest Final', 'value' => Package::where('manifest_status', 'final')->count()],
                ['label' => 'Rekomendasi Tertunda', 'value' => Recommendation::where('status', 'pending')->count()],
            ],
            'packages' => Package::withCount('bookings')->orderBy('departure_date')->take(10)->get(),
        ]);
    }

    private function financeDashboard()
    {
        $income = FinanceRecord::where('type', 'PEMASUKAN')->sum('amount');
        $expense = FinanceRecord::where('type', 'PENGELUARAN')->sum('amount');

        return Inertia::render('admin/role-dashboard', [
            'title' => 'Dashboard Admin Keuangan',
            'description' => 'Ringkasan transaksi dan kondisi keuangan terkini.',
            'cards' => [
                ['label' => 'Total Pemasukan', 'value' => $income, 'currency' => true],
                ['label' => 'Total Pengeluaran', 'value' => $expense, 'currency' => true],
                ['label' => 'Saldo', 'value' => $income - $expense, 'currency' => true],
                ['label' => 'Transaksi Bulan Ini', 'value' => FinanceRecord::whereYear('transaction_date', now()->year)->whereMonth('transaction_date', now()->month)->count()],
            ],
            'packages' => [],
        ]);
    }
}
