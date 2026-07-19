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
}