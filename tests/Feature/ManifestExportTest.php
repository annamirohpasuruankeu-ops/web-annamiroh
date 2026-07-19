<?php

use App\Models\User;
use App\Models\Package;
use App\Models\Booking;
use App\Models\JamaahMember;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('admin and agents can access the export route and download excel', function () {
    $admin = User::create([
        'name' => 'Test Admin',
        'email' => 'admin@test.com',
        'password' => bcrypt('password'),
        'role' => 'admin',
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $agent = User::create([
        'name' => 'Test Agent',
        'email' => 'agent@test.com',
        'password' => bcrypt('password'),
        'role' => 'agen',
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $package = Package::create([
        'name' => 'UMROH TEST',
        'program_days' => 9,
        'departure_date' => '2026-10-10',
        'airline' => 'Saudia',
        'price' => 30000000,
        'hotel_makkah' => 'Hotel Makkah',
        'hotel_madinah' => 'Hotel Madinah',
        'total_seats' => 45,
        'available_seats' => 45,
        'is_active' => true,
    ]);

    $member = JamaahMember::create([
        'user_id' => $agent->id,
        'name' => 'Pilgrim Test One',
        'jenis_kelamin' => 'Laki-laki',
        'tempat_lahir' => 'Surabaya',
        'tgl_lahir' => '1995-12-31',
    ]);

    Booking::create([
        'package_id' => $package->id,
        'user_id' => $agent->id,
        'jamaah_member_id' => $member->id,
        'status_pembayaran' => 'lunas',
        'status_dokumen' => 'lengkap',
    ]);

    // Test Admin
    $this->actingAs($admin);
    $response = $this->get(route('admin.jamaah.export'));
    $response->assertStatus(200);
    $response->assertHeader('Content-Type', 'application/vnd.ms-excel');
    $response->assertHeader('Content-Disposition', 'attachment; filename="manifest_keberangkatan_' . date('Ymd') . '_' . date('H') . date('i') . date('s') . '.xls"');
    $this->assertStringContainsString('UMROH TEST', $response->getContent());
    $this->assertStringContainsString('Pilgrim Test One', $response->getContent());

    // Test Agent
    $this->actingAs($agent);
    $response = $this->get(route('admin.jamaah.export'));
    $response->assertStatus(200);
    $this->assertStringContainsString('UMROH TEST', $response->getContent());
});

test('regular user cannot access the export route', function () {
    $user = User::create([
        'name' => 'Regular User',
        'email' => 'user@test.com',
        'password' => bcrypt('password'),
        'role' => 'user',
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $this->actingAs($user);
    $response = $this->get(route('admin.jamaah.export'));
    $response->assertStatus(403);
});

test('export respects filters correctly', function () {
    $admin = User::create([
        'name' => 'Test Admin',
        'email' => 'admin@test.com',
        'password' => bcrypt('password'),
        'role' => 'admin',
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $agent1 = User::create([
        'name' => 'Agent One',
        'email' => 'agent1@test.com',
        'password' => bcrypt('password'),
        'role' => 'agen',
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $agent2 = User::create([
        'name' => 'Agent Two',
        'email' => 'agent2@test.com',
        'password' => bcrypt('password'),
        'role' => 'agen',
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $package1 = Package::create([
        'name' => 'PACKAGE ALPHA',
        'program_days' => 9,
        'departure_date' => '2026-10-10',
        'airline' => 'Saudia',
        'price' => 30000000,
        'hotel_makkah' => 'Hotel Makkah',
        'hotel_madinah' => 'Hotel Madinah',
        'total_seats' => 45,
        'available_seats' => 45,
        'is_active' => true,
    ]);

    $package2 = Package::create([
        'name' => 'PACKAGE BETA',
        'program_days' => 12,
        'departure_date' => '2026-11-11',
        'airline' => 'Saudia',
        'price' => 35000000,
        'hotel_makkah' => 'Hotel Makkah',
        'hotel_madinah' => 'Hotel Madinah',
        'total_seats' => 45,
        'available_seats' => 45,
        'is_active' => true,
    ]);

    $member1 = JamaahMember::create([
        'user_id' => $agent1->id,
        'name' => 'Alice Cooper',
        'jenis_kelamin' => 'Laki-laki',
        'tempat_lahir' => 'Surabaya',
        'tgl_lahir' => '1995-12-31',
    ]);

    $member2 = JamaahMember::create([
        'user_id' => $agent2->id,
        'name' => 'Bob Marley',
        'jenis_kelamin' => 'Laki-laki',
        'tempat_lahir' => 'Pasuruan',
        'tgl_lahir' => '1990-01-01',
    ]);

    Booking::create([
        'package_id' => $package1->id,
        'user_id' => $agent1->id,
        'jamaah_member_id' => $member1->id,
        'status_pembayaran' => 'lunas',
        'status_dokumen' => 'lengkap',
    ]);

    Booking::create([
        'package_id' => $package2->id,
        'user_id' => $agent2->id,
        'jamaah_member_id' => $member2->id,
        'status_pembayaran' => 'lunas',
        'status_dokumen' => 'lengkap',
    ]);

    $this->actingAs($admin);

    // Filter by package 1
    $response = $this->get(route('admin.jamaah.export', ['package_id' => $package1->id]));
    $response->assertStatus(200);
    $this->assertStringContainsString('PACKAGE ALPHA', $response->getContent());
    $this->assertStringNotContainsString('PACKAGE BETA', $response->getContent());
    $this->assertStringContainsString('Alice Cooper', $response->getContent());
    $this->assertStringNotContainsString('Bob Marley', $response->getContent());

    // Filter by agent 2
    $response = $this->get(route('admin.jamaah.export', ['agent_id' => $agent2->id]));
    $response->assertStatus(200);
    $this->assertStringContainsString('PACKAGE BETA', $response->getContent());
    $this->assertStringNotContainsString('PACKAGE ALPHA', $response->getContent());
    $this->assertStringContainsString('Bob Marley', $response->getContent());
    $this->assertStringNotContainsString('Alice Cooper', $response->getContent());
});
