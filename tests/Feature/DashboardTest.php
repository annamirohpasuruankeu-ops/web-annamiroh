<?php

use App\Models\User;
use App\Models\Package;
use App\Models\Order;
use App\Models\Booking;
use App\Models\JamaahMember;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('adding a new member from dashboard with active order automatically enters pilgrim manifest', function () {
    // Seed admin user for fallback agent
    $admin = User::create([
        'name' => 'Admin Pusat',
        'email' => 'pusat@test.com',
        'password' => bcrypt('password'),
        'role' => 'pusat',
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    // Create user
    $user = User::create([
        'name' => 'Regular Customer',
        'email' => 'user@test.com',
        'password' => bcrypt('password'),
        'role' => 'user',
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    // Create package with 10 seats
    $package = Package::create([
        'name' => 'Umroh Hemat',
        'program_days' => 9,
        'departure_date' => '2026-12-12',
        'airline' => 'Lion',
        'price' => 25000000,
        'hotel_makkah' => 'Hotel Makkah',
        'hotel_madinah' => 'Hotel Madinah',
        'total_seats' => 10,
        'available_seats' => 10,
        'is_active' => true,
    ]);

    // Create an initial order for the package
    $order = Order::create([
        'package_id' => $package->id,
        'user_id' => $user->id,
        'agent_id' => $admin->id,
        'total_pax' => 1,
        'keterangan' => 'Pendaftaran Mandiri',
        'status_kunci' => 'open',
    ]);

    $this->actingAs($user);

    // Post new member from dashboard
    $response = $this->post('/dashboard/members', [
        'name' => 'Keluarga Baru',
        'nik' => '3578012345678901',
        'jenis_kelamin' => 'Perempuan',
        'hubungan_keluarga' => 'Istri',
        'tempat_lahir' => 'Surabaya',
        'tgl_lahir' => '1992-05-15',
        'email' => 'istri@test.com',
        'nohp' => '08987654321',
        'nomor_paspor' => 'C1234567',
        'paspor_office' => 'Kanim Surabaya',
        'paspor_issued' => '2025-05-05',
        'paspor_expiry' => '2035-05-05',
        'pp' => 'Pusat',
        'vm' => 'Pasuruan',
        'vp' => 'Mandiri',
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    // Verify member is created
    $member = JamaahMember::where('name', 'Keluarga Baru')->first();
    expect($member)->not->toBeNull();
    expect($member->nik)->toBe('3578012345678901');
    expect($member->email)->toBe('istri@test.com');
    expect($member->nohp)->toBe('08987654321');
    expect($member->nomor_paspor)->toBe('C1234567');
    expect($member->pp)->toBe('Pusat');
    expect($member->vm)->toBe('Pasuruan');
    expect($member->vp)->toBe('Mandiri');

    // Verify auto-booking was created
    $booking = Booking::where('jamaah_member_id', $member->id)->first();
    expect($booking)->not->toBeNull();
    expect($booking->order_id)->toBe($order->id);
    expect($booking->package_id)->toBe($package->id);

    // Verify order total_pax incremented to 2
    $order->refresh();
    expect($order->total_pax)->toBe(2);

    // Verify package seats decremented to 8 (1 from initial order creation, 1 from adding member to active order)
    $package->refresh();
    expect($package->available_seats)->toBe(8);
});

test('updating an existing member from dashboard updates data correctly', function () {
    $user = User::create([
        'name' => 'Regular Customer',
        'email' => 'user@test.com',
        'password' => bcrypt('password'),
        'role' => 'user',
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $member = JamaahMember::create([
        'user_id' => $user->id,
        'name' => 'Member A',
        'jenis_kelamin' => 'Laki-laki',
        'tempat_lahir' => 'Surabaya',
        'tgl_lahir' => '1990-01-01',
        'nik' => '3578012345678901',
    ]);

    $this->actingAs($user);

    $response = $this->put("/dashboard/members/{$member->id}", [
        'name' => 'Member A Updated',
        'nik' => '3578012345678999', // Updated NIK
        'jenis_kelamin' => 'Laki-laki',
        'hubungan_keluarga' => 'Suami',
        'tempat_lahir' => 'Sidoarjo', // Updated birthplace
        'tgl_lahir' => '1990-01-01',
        'email' => 'updated@test.com',
        'nohp' => '0812345678',
        'nomor_paspor' => 'X987654',
        'paspor_office' => 'Kanim Sidoarjo',
        'paspor_issued' => '2026-01-01',
        'paspor_expiry' => '2036-01-01',
        'pp' => 'Pasuruan',
        'vm' => 'Mandiri',
        'vp' => 'Pusat',
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    $member->refresh();
    expect($member->name)->toBe('Member A Updated');
    expect($member->nik)->toBe('3578012345678999');
    expect($member->tempat_lahir)->toBe('Sidoarjo');
    expect($member->email)->toBe('updated@test.com');
    expect($member->pp)->toBe('Pasuruan');
    expect($member->vm)->toBe('Mandiri');
    expect($member->vp)->toBe('Pusat');
});