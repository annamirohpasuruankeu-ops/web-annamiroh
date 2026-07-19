<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Buat Akun Role Lengkap
        \App\Models\User::firstOrCreate(
            ['email' => 'admin@alharamain.id'],
            [
                'name' => 'Super Admin',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'role' => 'admin',
            ]
        );

        \App\Models\User::firstOrCreate(
            ['email' => 'pusat@alharamain.id'],
            [
                'name' => 'Kantor Pusat',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'role' => 'pusat',
            ]
        );

        \App\Models\User::firstOrCreate(
            ['email' => 'agen@alharamain.id'],
            [
                'name' => 'Agen Cabang',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'role' => 'agen',
            ]
        );

        // 2. Seed Data Paket dari Brosur jika masih kosong
        \App\Models\Package::firstOrCreate(
            ['code' => 'BELUM_ATUR_JADWAL'],
            [
                'name' => 'Belum Atur Jadwal',
                'program_days' => 0,
                'departure_date' => '3000-01-01',
                'airline' => '-',
                'price' => 0,
                'hotel_makkah' => '-',
                'hotel_madinah' => '-',
                'total_seats' => 99999,
                'available_seats' => 99999,
                'is_active' => true,
            ]
        );

        if (\App\Models\Package::where('code', '!=', 'BELUM_ATUR_JADWAL')->count() === 0) {
            \App\Models\Package::create([
                'name' => 'Umroh Spesial Agustus (30 Hari)',
                'program_days' => 30,
                'departure_date' => '2026-08-29',
                'airline' => 'SCOOT',
                'airline_route' => 'Sub-sin -jed',
                'price' => 38900000,
                'hotel_makkah' => 'ATTALAYI / SETARAF (19D)',
                'hotel_madinah' => 'REHAB HARMONI / SETARAF (9D)',
                'included' => ['Hotel mekkah madinah', 'Tiket pesawat PP', 'Akomodasi dan visa', 'Mutawwif & tour leader', 'Headline indonesia-saudi', 'Perlengkapan'],
                'not_included' => ['Paspor', 'Vaksin miningitis dan polio'],
                'bonus' => ['Pigura 12R', 'Album kenangan', 'Sertifikat umroh'],
                'total_seats' => 45,
                'available_seats' => 45,
            ]);

            \App\Models\Package::create([
                'name' => 'Paket Umroh 3 Gratis 1 (12 Hari)',
                'program_days' => 12,
                'departure_date' => '2026-07-12',
                'airline' => 'LION AIR',
                'airline_route' => 'Sub-jed(tanpa transit)',
                'price' => 43200000,
                'hotel_makkah' => 'Paradise (7D)/setaraf',
                'hotel_madinah' => 'Burj mawaddah(3D)/setaraf',
                'included' => ['Hotel, tiket, perlengkapan, akomodasi, visa', 'Tour leader, muthowif', 'Siskopatuh dan asuransi'],
                'not_included' => ['Paspor, vaksin miningitis dan polio'],
                'bonus' => ['Pigura 12R', 'Album kenangan', 'Sertifikat'],
                'total_seats' => 40,
                'available_seats' => 40,
            ]);

            \App\Models\Package::create([
                'name' => 'Umroh Spesial Bulan Juli (16 Hari)',
                'program_days' => 16,
                'departure_date' => '2026-07-18',
                'airline' => 'GARUDA',
                'airline_route' => 'Sub-jed(tanpa transit)',
                'price' => 38950000,
                'hotel_makkah' => 'Al-Muwahiddin (10D)/setaraf',
                'hotel_madinah' => 'Amjad (4D)/setaraf',
                'included' => ['Hotel, tiket, perlengkapan, akomodasi, visa', 'Tour leader, muthowif', 'Siskopatuh dan asuransi'],
                'not_included' => ['Paspor, vaksin miningitis dan polio'],
                'bonus' => ['Pigura 12R', 'Album kenangan', 'Sertifikat'],
                'total_seats' => 50,
                'available_seats' => 50,
            ]);
        }
    }
}
