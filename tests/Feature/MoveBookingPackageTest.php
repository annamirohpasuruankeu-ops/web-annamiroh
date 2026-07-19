<?php

use App\Models\User;
use App\Models\Package;
use App\Models\Order;
use App\Models\Booking;
use App\Models\JamaahMember;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('admin can move booking to another package', function () {
    // 1. Create agent user and admin user
    $agent = User::create([
        'name' => 'Test Agent',
        'email' => 'agent@test.com',
        'password' => bcrypt('password'),
        'role' => 'agen',
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $admin = User::create([
        'name' => 'Test Admin',
        'email' => 'admin@test.com',
        'password' => bcrypt('password'),
        'role' => 'admin',
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    // 2. Create packages A and B
    $packageA = Package::create([
        'name' => 'Package A',
        'program_days' => 9,
        'departure_date' => now()->addDays(30),
        'airline' => 'Garuda',
        'price' => 30000000,
        'hotel_makkah' => 'Hotel Makkah A',
        'hotel_madinah' => 'Hotel Madinah A',
        'total_seats' => 10,
        'available_seats' => 10,
        'is_active' => true,
    ]);

    $packageB = Package::create([
        'name' => 'Package B',
        'program_days' => 12,
        'departure_date' => now()->addDays(40),
        'airline' => 'Saudia',
        'price' => 35000000,
        'hotel_makkah' => 'Hotel Makkah B',
        'hotel_madinah' => 'Hotel Madinah B',
        'total_seats' => 5,
        'available_seats' => 5,
        'is_active' => true,
    ]);

    // 3. Create Group User for Order A
    $groupUserA = User::create([
        'name' => 'Rombongan A',
        'email' => 'rombongana@test.com',
        'password' => bcrypt('password'),
        'role' => 'user',
    ]);

    // 4. Create Order A
    $orderA = Order::create([
        'package_id' => $packageA->id,
        'agent_id' => $agent->id,
        'user_id' => $groupUserA->id,
        'total_pax' => 1,
        'status_kunci' => 'open',
    ]);

    // Refresh packages to check available seats adjustment
    $packageA->refresh();
    expect($packageA->available_seats)->toBe(9);

    // 5. Create Jamaah Member and Booking
    $member = JamaahMember::create([
        'user_id' => $groupUserA->id,
        'name' => 'Jamaah Test',
        'jenis_kelamin' => 'Laki-laki',
    ]);

    $booking = Booking::create([
        'order_id' => $orderA->id,
        'package_id' => $packageA->id,
        'user_id' => $groupUserA->id,
        'jamaah_member_id' => $member->id,
        'status_pembayaran' => 'belum_bayar',
        'status_dokumen' => 'belum_lengkap',
    ]);

    // 6. Act: Call the move endpoint as Admin
    $this->actingAs($admin);

    $response = $this->post(route('admin.bookings.move-package', $booking->id), [
        'target_package_id' => $packageB->id,
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();
    
    // 7. Assertions
    // Order A should be deleted now since its total_pax became 0
    expect(Order::find($orderA->id))->toBeNull();
    // The group user associated with Order A should NOT be deleted under the new business model
    expect(User::find($groupUserA->id))->not->toBeNull();

    // Package A available_seats should be back to 10
    $packageA->refresh();
    expect($packageA->available_seats)->toBe(10);

    // Find the automatically created target order
    $orderB = Order::where('package_id', $packageB->id)
        ->where('agent_id', $agent->id)
        ->first();

    expect($orderB)->not->toBeNull();
    expect($orderB->total_pax)->toBe(1);

    // Package B available_seats should be decremented to 4
    $packageB->refresh();
    expect($packageB->available_seats)->toBe(4);

    // Booking should be updated with new order, new package, and new group user
    $booking->refresh();
    expect($booking->package_id)->toBe($packageB->id);
    expect($booking->order_id)->toBe($orderB->id);
    expect($booking->user_id)->toBe($orderB->user_id);

    // Jamaah Member's user_id should be updated to the new order's group user
    $member->refresh();
    expect($member->user_id)->toBe($orderB->user_id);
});

test('cannot move booking if destination package has no seats', function () {
    $agent = User::create([
        'name' => 'Test Agent',
        'email' => 'agent2@test.com',
        'password' => bcrypt('password'),
        'role' => 'agen',
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $admin = User::create([
        'name' => 'Test Admin',
        'email' => 'admin2@test.com',
        'password' => bcrypt('password'),
        'role' => 'admin',
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $packageA = Package::create([
        'name' => 'Package A',
        'program_days' => 9,
        'departure_date' => now()->addDays(30),
        'airline' => 'Garuda',
        'price' => 30000000,
        'hotel_makkah' => 'Hotel Makkah A',
        'hotel_madinah' => 'Hotel Madinah A',
        'total_seats' => 10,
        'available_seats' => 10,
        'is_active' => true,
    ]);

    $packageB = Package::create([
        'name' => 'Package B',
        'program_days' => 12,
        'departure_date' => now()->addDays(40),
        'airline' => 'Saudia',
        'price' => 35000000,
        'hotel_makkah' => 'Hotel Makkah B',
        'hotel_madinah' => 'Hotel Madinah B',
        'total_seats' => 5,
        'available_seats' => 0, // NO SEATS AVAILABLE!
        'is_active' => true,
    ]);

    $groupUserA = User::create([
        'name' => 'Rombongan A',
        'email' => 'rombongana2@test.com',
        'password' => bcrypt('password'),
        'role' => 'user',
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $orderA = Order::create([
        'package_id' => $packageA->id,
        'agent_id' => $agent->id,
        'user_id' => $groupUserA->id,
        'total_pax' => 1,
        'status_kunci' => 'open',
    ]);

    $member = JamaahMember::create([
        'user_id' => $groupUserA->id,
        'name' => 'Jamaah Test',
        'jenis_kelamin' => 'Laki-laki',
    ]);

    $booking = Booking::create([
        'order_id' => $orderA->id,
        'package_id' => $packageA->id,
        'user_id' => $groupUserA->id,
        'jamaah_member_id' => $member->id,
        'status_pembayaran' => 'belum_bayar',
        'status_dokumen' => 'belum_lengkap',
    ]);

    $this->actingAs($admin);

    $response = $this->post(route('admin.bookings.move-package', $booking->id), [
        'target_package_id' => $packageB->id,
    ]);

    $response->assertSessionHasErrors(['message']);
    
    // Seat counts and order associations should remain unchanged
    $orderA->refresh();
    expect($orderA->total_pax)->toBe(1);

    $packageA->refresh();
    expect($packageA->available_seats)->toBe(9);

    $packageB->refresh();
    expect($packageB->available_seats)->toBe(0);

    $booking->refresh();
    expect($booking->package_id)->toBe($packageA->id);
});
