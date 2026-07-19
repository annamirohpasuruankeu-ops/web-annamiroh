<?php

use App\Models\User;
use App\Models\Package;
use App\Models\Order;
use App\Models\Booking;
use App\Models\JamaahMember;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('independent registration correctly creates parent order and links bookings', function () {
    // Seed admin user for pusat agent fallback
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

    // Create family members
    $member1 = JamaahMember::create([
        'user_id' => $user->id,
        'name' => 'Member A',
        'jenis_kelamin' => 'Laki-laki',
        'tempat_lahir' => 'Surabaya',
        'tgl_lahir' => '1990-01-01',
    ]);

    $member2 = JamaahMember::create([
        'user_id' => $user->id,
        'name' => 'Member B',
        'jenis_kelamin' => 'Perempuan',
        'tempat_lahir' => 'Surabaya',
        'tgl_lahir' => '1992-02-02',
    ]);

    $this->actingAs($user);

    $response = $this->post(route('dashboard.bookings.store'), [
        'package_id' => $package->id,
        'jamaah_member_ids' => [$member1->id, $member2->id],
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    // Verify order was created
    $order = Order::first();
    expect($order)->not->toBeNull();
    expect($order->package_id)->toBe($package->id);
    expect($order->user_id)->toBe($user->id);
    expect($order->agent_id)->toBe($admin->id); // Fallback agent_id is the admin/pusat user
    expect($order->total_pax)->toBe(2);

    // Verify bookings were created and linked to the order
    $bookings = Booking::where('order_id', $order->id)->get();
    expect($bookings->count())->toBe(2);
    expect($bookings[0]->jamaah_member_id)->toBe($member1->id);
    expect($bookings[1]->jamaah_member_id)->toBe($member2->id);

    // Verify package available seats decreased by 2 (10 -> 8)
    $package->refresh();
    expect($package->available_seats)->toBe(8);
});
