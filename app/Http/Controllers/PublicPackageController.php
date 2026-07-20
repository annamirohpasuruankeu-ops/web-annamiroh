<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Inertia\Inertia;
use Illuminate\Http\Request;

class PublicPackageController extends Controller
{
    public function index()
    {
        // Mengambil paket umroh yang aktif dan diurutkan berdasarkan tanggal keberangkatan terdekat
        $packages = Package::where('is_active', true)
                           ->orderBy('departure_date', 'asc')
                           ->get();

        return Inertia::render('umroh-reguler', [
            'packages' => $packages
        ]);
    }

    public function show(Package $package)
    {
        abort_unless($package->is_active, 404);

        return Inertia::render('package-detail', [
            'package' => [
                'id' => $package->id,
                'name' => $package->name,
                'code' => $package->code,
                'program_days' => $package->program_days,
                'departure_date' => optional($package->departure_date)->toDateString(),
                'airline' => $package->airline,
                'airline_route' => $package->airline_route,
                'price' => (int) $package->price,
                'hotel_makkah' => $package->hotel_makkah,
                'hotel_madinah' => $package->hotel_madinah,
                'included' => $package->included,
                'not_included' => $package->not_included,
                'bonus' => $package->bonus,
                'includes' => $package->includes,
                'excludes' => $package->excludes,
                'free_items' => $package->free_items,
                'total_seats' => (int) $package->total_seats,
                'available_seats' => (int) $package->available_seats,
                'image_url' => $package->image
                    ? asset('storage-file/' . $package->image)
                    : 'https://picsum.photos/seed/umrah' . $package->id . '/1200/800',
                'detail_url' => route('packages.show', $package),
            ],
        ]);
    }
}
