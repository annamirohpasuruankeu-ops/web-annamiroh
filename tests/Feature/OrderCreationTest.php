<?php

use App\Models\User;
use App\Models\Package;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('creating an order does not create a new user account', function () {
    $agent = User::create([
        'name' => 'Agent A',
        'email' => 'agent@test.com',
        'password' => bcrypt('password'),
        'role' => 'agen',
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $package = Package::create([
        'name' => 'Paket Umroh Premium',
        'program_days' => 9,
        'departure_date' => now()->addDays(30),
        'airline' => 'Garuda',
        'price' => 35000000,
        'harga_agen' => 33000000,
        'hotel_makkah' => 'Hotel Makkah',
        'hotel_madinah' => 'Hotel Madinah',
        'total_seats' => 45,
        'available_seats' => 45,
        'is_active' => true,
    ]);

    $this->actingAs($agent);

    // Get current user count
    $initialUserCount = User::count();

    // Create Order
    $response = $this->post(route('admin.orders.store'), [
        'package_id' => $package->id,
        'total_pax' => 5,
        'keterangan' => 'Test order creation',
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    // Verify order was created
    $order = Order::first();
    expect($order)->not->toBeNull();
    expect($order->user_id)->toBe($agent->id); // Directly associated with the agent's user ID

    // Verify user count did NOT increase
    $finalUserCount = User::count();
    expect($finalUserCount)->toBe($initialUserCount);
});

test('cannot reduce total_pax below the number of registered/filled bookings', function () {
    $agent = User::create([
        'name' => 'Agent A',
        'email' => 'agent@test.com',
        'password' => bcrypt('password'),
        'role' => 'agen',
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $package = Package::create([
        'name' => 'Paket Umroh Premium',
        'program_days' => 9,
        'departure_date' => now()->addDays(30),
        'airline' => 'Garuda',
        'price' => 35000000,
        'harga_agen' => 33000000,
        'hotel_makkah' => 'Hotel Makkah',
        'hotel_madinah' => 'Hotel Madinah',
        'total_seats' => 45,
        'available_seats' => 45,
        'is_active' => true,
    ]);

    $order = Order::create([
        'package_id' => $package->id,
        'agent_id' => $agent->id,
        'user_id' => $agent->id,
        'total_pax' => 4,
        'keterangan' => 'Booking 4 Pax',
        'status_kunci' => 'open',
    ]);

    // Create 4 bookings under this order
    for ($i = 0; $i < 4; $i++) {
        $jamaah = User::create([
            'name' => "Jamaah {$i}",
            'email' => "jamaah{$i}@test.com",
            'password' => bcrypt('password'),
            'role' => 'user',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);
        
        $member = \App\Models\JamaahMember::create([
            'user_id' => $jamaah->id,
            'name' => "Jamaah Member {$i}",
            'nik' => '123456789012345' . $i,
            'nomor_paspor' => 'PAS' . $i,
            'jenis_kelamin' => 'Laki-laki',
        ]);

        \App\Models\Booking::create([
            'package_id' => $package->id,
            'user_id' => $jamaah->id,
            'jamaah_member_id' => $member->id,
            'order_id' => $order->id,
            'status_pembayaran' => 'belum_bayar',
            'status_dokumen' => 'belum_lengkap',
        ]);
    }

    $this->actingAs($agent);

    // Try to update order to 3 pax (should fail)
    $response = $this->put(route('admin.orders.update', $order->id), [
        'package_id' => $package->id,
        'total_pax' => 3,
        'keterangan' => 'Booking 3 Pax',
    ]);

    $response->assertSessionHasErrors(['total_pax']);
    
    $order->refresh();
    expect($order->total_pax)->toBe(4);

    // Try to update order to 4 pax or 5 pax (should succeed)
    $response = $this->put(route('admin.orders.update', $order->id), [
        'package_id' => $package->id,
        'total_pax' => 4,
        'keterangan' => 'Booking 4 Pax',
    ]);
    $response->assertSessionHasNoErrors();
});
