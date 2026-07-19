<?php

use App\Models\User;
use App\Models\Package;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('admin can create and update a package with code', function () {
    $admin = User::create([
        'name' => 'Test Admin',
        'email' => 'admin@test.com',
        'password' => bcrypt('password'),
        'role' => 'admin',
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $response = $this->actingAs($admin)
        ->post(route('admin.packages.store'), [
            'name' => 'Umroh VIP 2026',
            'code' => 'UMROH_VIP_2026',
            'program_days' => 12,
            'departure_date' => '2026-12-12',
            'airline' => 'Saudi Airlines',
            'price' => 45000000,
            'harga_agen' => 43000000,
            'hotel_makkah' => 'Hilton',
            'hotel_madinah' => 'Movenpick',
            'total_seats' => 40,
        ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();
    $package = Package::where('code', 'UMROH_VIP_2026')->first();
    expect($package)->not->toBeNull();
    expect($package->name)->toBe('Umroh VIP 2026');

    // Update package code
    $responseUpdate = $this->actingAs($admin)
        ->put(route('admin.packages.update', $package->id), [
            'name' => 'Umroh VIP 2026 Super',
            'code' => 'UMROH_VIP_2026_SUPER',
            'program_days' => 12,
            'departure_date' => '2026-12-12',
            'airline' => 'Saudi Airlines',
            'price' => 45000000,
            'harga_agen' => 43000000,
            'hotel_makkah' => 'Hilton',
            'hotel_madinah' => 'Movenpick',
            'total_seats' => 40,
        ]);

    $responseUpdate->assertSessionHasNoErrors();
    $responseUpdate->assertRedirect();
    
    $package->refresh();
    expect($package->code)->toBe('UMROH_VIP_2026_SUPER');
    expect($package->name)->toBe('Umroh VIP 2026 Super');
});

test('default package BELUM_ATUR_JADWAL is excluded from public homepage', function () {
    // Ensure default package exists
    Package::firstOrCreate(
        ['code' => 'BELUM_ATUR_JADWAL'],
        [
            'name' => 'Belum Atur Jadwal',
            'program_days' => 0,
            'departure_date' => '3000-01-01',
            'airline' => '-',
            'price' => 0,
            'harga_agen' => 0,
            'hotel_makkah' => '-',
            'hotel_madinah' => '-',
            'total_seats' => 99999,
            'available_seats' => 99999,
            'is_active' => true,
        ]
    );

    // Create a regular active package
    Package::create([
        'name' => 'Paket Umroh Reguler',
        'code' => 'REGULER_01',
        'program_days' => 9,
        'departure_date' => '2026-10-10',
        'airline' => 'Lion Air',
        'price' => 30000000,
        'harga_agen' => 28000000,
        'hotel_makkah' => 'Le Meridien',
        'hotel_madinah' => 'Golden Tulip',
        'total_seats' => 45,
        'available_seats' => 45,
        'is_active' => true,
    ]);

    $response = $this->get(route('home'));
    $response->assertStatus(200);

    $props = $response->original->getData()['page']['props'];
    $packages = $props['packages'];

    // Convert keys/values to array for checking
    $packageTitles = collect($packages)->pluck('title')->toArray();

    // Regular package should be present, default package must be excluded
    expect($packageTitles)->toContain('Paket Umroh Reguler');
    expect($packageTitles)->not->toContain('Belum Atur Jadwal');
});
