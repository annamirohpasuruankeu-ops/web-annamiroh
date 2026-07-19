<?php

use App\Models\User;
use App\Models\Package;
use App\Models\Order;
use App\Models\Booking;
use App\Models\JamaahMember;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('register-agent page can be rendered', function () {
    $response = $this->get('/register-agent');
    $response->assertStatus(200);
});

test('new agent registration defaults to inactive state and shows waiting message on login', function () {
    // Register agent
    $response = $this->post('/register', [
        'name' => 'Agent Mitra',
        'email' => 'agent@test.com',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
        'no_wa' => '08123456789',
        'tempat_lahir' => 'Sidoarjo',
        'tgl_lahir' => '1995-05-05',
        'alamat' => 'Jl. Juanda No. 12',
        'role' => 'agen',
    ]);

    $response->assertRedirect();

    // Verify agent is inactive in database
    $agent = User::where('email', 'agent@test.com')->first();
    expect($agent)->not->toBeNull();
    expect($agent->role)->toBe('agen');
    expect($agent->is_active)->toBeFalse();

    // Try logging in with the inactive agent account
    $response = $this->post('/login', [
        'email' => 'agent@test.com',
        'password' => 'Password123!',
    ]);

    $response->assertSessionHasErrors([
        'email' => 'Pendaftaran Anda sebagai Agen berhasil. Silakan tunggu persetujuan Admin sebelum masuk.'
    ]);
});

test('authorized users can view printable registration form and unauthorized are denied', function () {
    // Create admin
    $admin = User::create([
        'name' => 'Admin Pusat',
        'email' => 'pusat@test.com',
        'password' => bcrypt('password'),
        'role' => 'pusat',
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    // Create Agent A
    $agentA = User::create([
        'name' => 'Agent A',
        'email' => 'agentA@test.com',
        'password' => bcrypt('password'),
        'role' => 'agen',
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    // Create Agent B
    $agentB = User::create([
        'name' => 'Agent B',
        'email' => 'agentB@test.com',
        'password' => bcrypt('password'),
        'role' => 'agen',
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    // Create pilgrim user
    $user = User::create([
        'name' => 'Pilgrim',
        'email' => 'pilgrim@test.com',
        'password' => bcrypt('password'),
        'role' => 'user',
        'email_verified_at' => now(),
        'is_active' => true,
        'agent_id' => $agentA->id, // owned by agent A
    ]);

    // Create package
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

    // Create order
    $order = Order::create([
        'package_id' => $package->id,
        'user_id' => $user->id,
        'agent_id' => $agentA->id,
        'total_pax' => 1,
    ]);

    // Create booking
    $booking = Booking::create([
        'order_id' => $order->id,
        'package_id' => $package->id,
        'user_id' => $user->id,
        'status_pembayaran' => 'belum_bayar',
    ]);

    // 1. Guest is denied
    $response = $this->get("/admin/bookings/{$booking->id}/registration-form");
    $response->assertRedirect('/login');

    // 2. Admin/Pusat is authorized
    $this->actingAs($admin);
    $response = $this->get("/admin/bookings/{$booking->id}/registration-form");
    $response->assertStatus(200);

    // 3. Agent A (owner) is authorized
    $this->actingAs($agentA);
    $response = $this->get("/admin/bookings/{$booking->id}/registration-form");
    $response->assertStatus(200);

    // 4. Agent B (non-owner) is unauthorized (403)
    $this->actingAs($agentB);
    $response = $this->get("/admin/bookings/{$booking->id}/registration-form");
    $response->assertStatus(403);
});
