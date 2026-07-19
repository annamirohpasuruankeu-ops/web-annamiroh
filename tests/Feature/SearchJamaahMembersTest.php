<?php

use App\Models\User;
use App\Models\JamaahMember;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('admin can search all jamaah members', function () {
    $admin = User::create([
        'name' => 'Test Admin',
        'email' => 'admin@test.com',
        'password' => bcrypt('password'),
        'role' => 'admin',
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $agentA = User::create([
        'name' => 'Agent A',
        'email' => 'agentA@test.com',
        'password' => bcrypt('password'),
        'role' => 'agen',
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $groupUserA = User::create([
        'name' => 'Rombongan A',
        'email' => 'rombonganA@test.com',
        'password' => bcrypt('password'),
        'role' => 'user',
        'agent_id' => $agentA->id,
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $agentB = User::create([
        'name' => 'Agent B',
        'email' => 'agentB@test.com',
        'password' => bcrypt('password'),
        'role' => 'agen',
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $groupUserB = User::create([
        'name' => 'Rombongan B',
        'email' => 'rombonganB@test.com',
        'password' => bcrypt('password'),
        'role' => 'user',
        'agent_id' => $agentB->id,
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $memberA = JamaahMember::create([
        'user_id' => $groupUserA->id,
        'name' => 'Ahmad Fauzi',
        'nik' => '1234567890123456',
        'nomor_paspor' => 'A8877665',
        'jenis_kelamin' => 'Laki-laki',
    ]);

    $memberB = JamaahMember::create([
        'user_id' => $groupUserB->id,
        'name' => 'Budi Santoso',
        'nik' => '9876543210987654',
        'nomor_paspor' => 'B1122334',
        'jenis_kelamin' => 'Laki-laki',
    ]);

    $this->actingAs($admin);

    // Search for Ahmad
    $response = $this->getJson(route('admin.jamaah-members.search', ['search' => 'Ahmad']));
    $response->assertStatus(200);
    $data = $response->json();
    expect(count($data))->toBe(1);
    expect($data[0]['name'])->toBe('Ahmad Fauzi');

    // Search for Budi
    $response = $this->getJson(route('admin.jamaah-members.search', ['search' => 'Budi']));
    $response->assertStatus(200);
    $data = $response->json();
    expect(count($data))->toBe(1);
    expect($data[0]['name'])->toBe('Budi Santoso');
});

test('agent can only search their own registered jamaah members', function () {
    $agentA = User::create([
        'name' => 'Agent A',
        'email' => 'agentA2@test.com',
        'password' => bcrypt('password'),
        'role' => 'agen',
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $groupUserA = User::create([
        'name' => 'Rombongan A',
        'email' => 'rombonganA2@test.com',
        'password' => bcrypt('password'),
        'role' => 'user',
        'agent_id' => $agentA->id,
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $agentB = User::create([
        'name' => 'Agent B',
        'email' => 'agentB2@test.com',
        'password' => bcrypt('password'),
        'role' => 'agen',
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $groupUserB = User::create([
        'name' => 'Rombongan B',
        'email' => 'rombonganB2@test.com',
        'password' => bcrypt('password'),
        'role' => 'user',
        'agent_id' => $agentB->id,
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $memberA = JamaahMember::create([
        'user_id' => $groupUserA->id,
        'name' => 'Ahmad Fauzi',
        'nik' => '1234567890123456',
        'nomor_paspor' => 'A8877665',
        'jenis_kelamin' => 'Laki-laki',
    ]);

    $memberB = JamaahMember::create([
        'user_id' => $groupUserB->id,
        'name' => 'Budi Santoso',
        'nik' => '9876543210987654',
        'nomor_paspor' => 'B1122334',
        'jenis_kelamin' => 'Laki-laki',
    ]);

    // Act as Agent A
    $this->actingAs($agentA);

    // Agent A searches for Ahmad -> should find him
    $response = $this->getJson(route('admin.jamaah-members.search', ['search' => 'Ahmad']));
    $response->assertStatus(200);
    $data = $response->json();
    expect(count($data))->toBe(1);
    expect($data[0]['name'])->toBe('Ahmad Fauzi');

    // Agent A searches for Budi (who is registered under Agent B) -> should NOT find him
    $response = $this->getJson(route('admin.jamaah-members.search', ['search' => 'Budi']));
    $response->assertStatus(200);
    $data = $response->json();
    expect(count($data))->toBe(0);
});
