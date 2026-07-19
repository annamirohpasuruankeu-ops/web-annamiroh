<?php

use App\Models\User;
use App\Models\JamaahMember;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('admin and agents can access the jamaah database route', function () {
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

    // Test Admin
    $this->actingAs($admin);
    $response = $this->get(route('admin.jamaah-database'));
    $response->assertStatus(200);

    // Test Agent
    $this->actingAs($agent);
    $response = $this->get(route('admin.jamaah-database'));
    $response->assertStatus(200);
});

test('regular user cannot access the jamaah database route', function () {
    $user = User::create([
        'name' => 'Regular User',
        'email' => 'user@test.com',
        'password' => bcrypt('password'),
        'role' => 'user',
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $this->actingAs($user);
    $response = $this->get(route('admin.jamaah-database'));
    $response->assertStatus(403);
});

test('admin can update jamaah profile email, nohp, and upload ktp and kk files', function () {
    $admin = User::create([
        'name' => 'Test Admin',
        'email' => 'admin@test.com',
        'password' => bcrypt('password'),
        'role' => 'admin',
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $member = JamaahMember::create([
        'user_id' => $admin->id,
        'name' => 'John Doe',
        'jenis_kelamin' => 'Laki-laki',
        'tempat_lahir' => 'Jakarta',
        'tgl_lahir' => '1990-01-01',
    ]);

    $this->actingAs($admin);

    $ktpFile = \Illuminate\Http\UploadedFile::fake()->create('ktp.jpg', 100);
    $kkFile = \Illuminate\Http\UploadedFile::fake()->create('kk.pdf', 150);

    $response = $this->post(route('admin.jamaah.update', $member->id), [
        'name' => 'John Doe Updated',
        'jenis_kelamin' => 'Laki-laki',
        'tempat_lahir' => 'Jakarta',
        'tgl_lahir' => '1990-01-01',
        'email' => 'john.doe@test.com',
        'nohp' => '08123456789',
        'ktp_file' => $ktpFile,
        'kk_file' => $kkFile,
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    $member->refresh();
    expect($member->name)->toBe('John Doe Updated');
    expect($member->email)->toBe('john.doe@test.com');
    expect($member->nohp)->toBe('08123456789');
    expect($member->ktp_file)->not->toBeNull();
    expect($member->kk_file)->not->toBeNull();
});
