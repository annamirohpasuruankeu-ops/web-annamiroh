<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Package;
use App\Models\PopupPromo;
use App\Models\Gallery;
use Illuminate\Support\Facades\Storage;

class HomeController extends Controller
{
    public function index()
    {
        $dbPackages = Package::where('is_active', true)
            ->where(function($q) {
                $q->where(function($sub) {
                    $sub->whereNull('code')
                        ->orWhere('code', '!=', 'BELUM_ATUR_JADWAL');
                })
                ->where('name', '!=', 'Belum Atur Jadwal');
            })
            ->orderBy('departure_date', 'asc')
            ->get();

        $packages = $dbPackages->map(function ($pkg) {
            // Determine image URL: check if uploaded, else fallback to a premium picsum placeholder
            $image = $pkg->image
                ? asset('storage-file/' . $pkg->image)
                : 'https://picsum.photos/seed/umrah' . $pkg->id . '/800/600';

            // Build features list dynamically from included/includes and bonus/free_items
            $features = [];

            if (is_array($pkg->included)) {
                $features = array_merge($features, $pkg->included);
            } elseif (!empty($pkg->includes)) {
                $parsedIncludes = array_filter(array_map('trim', preg_split('/[\n,]+/', $pkg->includes)));
                $features = array_merge($features, $parsedIncludes);
            }

            if (is_array($pkg->bonus)) {
                $features = array_merge($features, $pkg->bonus);
            } elseif (!empty($pkg->free_items)) {
                $parsedFree = array_filter(array_map('trim', preg_split('/[\n,]+/', $pkg->free_items)));
                $features = array_merge($features, $parsedFree);
            }

            // Defaults if features are still empty
            if (empty($features)) {
                $features = ['Tiket pesawat PP', 'Akomodasi dan visa', 'Mutawwif & tour leader'];
            }

            // Format date to Indonesian locale (e.g. "29 Agustus 2026")
            $departureDateFormatted = '';
            if ($pkg->departure_date) {
                $departureDateFormatted = \Carbon\Carbon::parse($pkg->departure_date)
                    ->locale('id')
                    ->translatedFormat('d F Y');
            }

            return [
                'id' => (string) $pkg->id,
                'title' => $pkg->name,
                'price' => (int) $pkg->price,
                'airline' => $pkg->airline . ($pkg->airline_route ? ' (' . $pkg->airline_route . ')' : ''),
                'hotelMecca' => $pkg->hotel_makkah,
                'hotelMedina' => $pkg->hotel_madinah,
                'departureDate' => $departureDateFormatted,
                'features' => array_values(array_slice($features, 0, 4)), // limit to 4 for clean layout
                'image' => $image,
                'availableSeats' => (int) $pkg->available_seats,
                'totalSeats' => (int) $pkg->total_seats,
                'is_best_seller' => (bool) $pkg->is_best_seller,
            ];
        });

        // Get the active popup promo
        $activePopup = PopupPromo::where('is_active', true)->first();

        // Get the active galleries
        $galleries = Gallery::where('is_active', true)
            ->orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($g) {
                return [
                    'id' => $g->id,
                    'title' => $g->title,
                    'image' => asset('storage-file/' . $g->image),
                ];
            });

        return Inertia::render('home', [
            'packages' => $packages,
            'popupPromo' => $activePopup ? [
                'id' => $activePopup->id,
                'title' => $activePopup->title,
                'description' => $activePopup->description,
                'image' => $activePopup->image ? asset('storage-file/' . $activePopup->image) : null,
                'buttonText' => $activePopup->button_text,
                'buttonLink' => $activePopup->button_link,
            ] : null,
            'galleries' => $galleries,
        ]);
    }
}

