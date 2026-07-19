<?php

use App\Models\User;
use App\Models\JamaahMember;
use App\Models\Recommendation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

test('agent can search their own jamaah for recommendations', function () {
    $agent = User::create([
        'name' => 'Test Agent',
        'email' => 'agent@test.com',
        'password' => bcrypt('password'),
        'role' => 'agen',
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $groupUser = User::create([
        'name' => 'Group User',
        'email' => 'group@test.com',
        'password' => bcrypt('password'),
        'role' => 'user',
        'agent_id' => $agent->id,
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $member = JamaahMember::create([
        'user_id' => $groupUser->id,
        'name' => 'Budi Santoso',
        'nik' => '1234567890123456',
        'nomor_paspor' => 'OLD123',
        'jenis_kelamin' => 'Laki-laki',
    ]);

    $this->actingAs($agent);

    $response = $this->getJson(route('admin.recommendations.search-jamaah', ['search' => 'Budi']));
    $response->assertStatus(200);
    $data = $response->json();

    expect(count($data))->toBe(1);
    expect($data[0]['name'])->toBe('Budi Santoso');
});

test('agent can submit passport recommendation', function () {
    Storage::fake('public');

    $agent = User::create([
        'name' => 'Test Agent',
        'email' => 'agent@test.com',
        'password' => bcrypt('password'),
        'role' => 'agen',
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $groupUser = User::create([
        'name' => 'Group User',
        'email' => 'group@test.com',
        'password' => bcrypt('password'),
        'role' => 'user',
        'agent_id' => $agent->id,
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $member = JamaahMember::create([
        'user_id' => $groupUser->id,
        'name' => 'Budi Santoso',
        'nik' => '1234567890123456',
        'nomor_paspor' => 'OLD123',
        'jenis_kelamin' => 'Laki-laki',
    ]);

    $this->actingAs($agent);

    $file = UploadedFile::fake()->create('passport.jpg', 100);

    $response = $this->post(route('admin.recommendations.store'), [
        'jamaah_member_id' => $member->id,
        'nomor_paspor' => 'NEW987',
        'nama_paspor' => 'BUDI SANTOSO HERNANDEZ',
        'keterangan' => 'Ubah nama sesuai paspor terbaru.',
        'paspor_file' => $file,
    ]);

    $response->assertRedirect();
    
    $recommendation = Recommendation::first();
    expect($recommendation)->not->toBeNull();
    expect($recommendation->nomor_paspor)->toBe('NEW987');
    expect($recommendation->nama_paspor)->toBe('BUDI SANTOSO HERNANDEZ');
    expect($recommendation->status)->toBe('pending');
    
    Storage::disk('public')->assertExists($recommendation->paspor_file);
});

test('admin can approve passport recommendation and update jamaah details', function () {
    Storage::fake('public');

    $agent = User::create([
        'name' => 'Test Agent',
        'email' => 'agent@test.com',
        'password' => bcrypt('password'),
        'role' => 'agen',
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $groupUser = User::create([
        'name' => 'Group User',
        'email' => 'group@test.com',
        'password' => bcrypt('password'),
        'role' => 'user',
        'agent_id' => $agent->id,
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $member = JamaahMember::create([
        'user_id' => $groupUser->id,
        'name' => 'Budi Santoso',
        'nik' => '1234567890123456',
        'nomor_paspor' => 'OLD123',
        'jenis_kelamin' => 'Laki-laki',
    ]);

    $recommendation = Recommendation::create([
        'agent_id' => $agent->id,
        'jamaah_member_id' => $member->id,
        'nomor_paspor' => 'NEW987',
        'nama_paspor' => 'BUDI SANTOSO HERNANDEZ',
        'keterangan' => 'Ubah nama.',
        'paspor_file' => 'recommendations/passport.jpg',
        'status' => 'pending',
    ]);

    $admin = User::create([
        'name' => 'Test Admin',
        'email' => 'admin@test.com',
        'password' => bcrypt('password'),
        'role' => 'admin',
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $this->actingAs($admin);

    $response = $this->post(route('admin.recommendations.approve', $recommendation->id));
    $response->assertRedirect();

    $recommendation->refresh();
    expect($recommendation->status)->toBe('approved');

    $member->refresh();
    expect($member->nomor_paspor)->toBe('NEW987');
    expect($member->name)->toBe('BUDI SANTOSO HERNANDEZ');
    expect($member->paspor_file)->toBe('recommendations/passport.jpg');
});

test('admin can reject passport recommendation with reason', function () {
    $agent = User::create([
        'name' => 'Test Agent',
        'email' => 'agent@test.com',
        'password' => bcrypt('password'),
        'role' => 'agen',
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $groupUser = User::create([
        'name' => 'Group User',
        'email' => 'group@test.com',
        'password' => bcrypt('password'),
        'role' => 'user',
        'agent_id' => $agent->id,
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $member = JamaahMember::create([
        'user_id' => $groupUser->id,
        'name' => 'Budi Santoso',
        'nik' => '1234567890123456',
        'nomor_paspor' => 'OLD123',
        'jenis_kelamin' => 'Laki-laki',
    ]);

    $recommendation = Recommendation::create([
        'agent_id' => $agent->id,
        'jamaah_member_id' => $member->id,
        'nomor_paspor' => 'NEW987',
        'nama_paspor' => 'BUDI SANTOSO HERNANDEZ',
        'keterangan' => 'Ubah nama.',
        'paspor_file' => 'recommendations/passport.jpg',
        'status' => 'pending',
    ]);

    $admin = User::create([
        'name' => 'Test Admin',
        'email' => 'admin@test.com',
        'password' => bcrypt('password'),
        'role' => 'admin',
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $this->actingAs($admin);

    $response = $this->post(route('admin.recommendations.reject', $recommendation->id), [
        'keterangan_admin' => 'File paspor tidak terbaca/buram.',
    ]);
    $response->assertRedirect();

    $recommendation->refresh();
    expect($recommendation->status)->toBe('rejected');
    expect($recommendation->keterangan_admin)->toBe('File paspor tidak terbaca/buram.');

    $member->refresh();
    expect($member->nomor_paspor)->toBe('OLD123'); // Unchanged
});

test('user can view printable recommendation letter', function () {
    $agent = User::create([
        'name' => 'Test Agent',
        'email' => 'agent@test.com',
        'password' => bcrypt('password'),
        'role' => 'agen',
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $groupUser = User::create([
        'name' => 'Group User',
        'email' => 'group@test.com',
        'password' => bcrypt('password'),
        'role' => 'user',
        'agent_id' => $agent->id,
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $member = JamaahMember::create([
        'user_id' => $groupUser->id,
        'name' => 'Budi Santoso',
        'nik' => '1234567890123456',
        'nomor_paspor' => 'OLD123',
        'jenis_kelamin' => 'Laki-laki',
    ]);

    $recommendation = Recommendation::create([
        'agent_id' => $agent->id,
        'jamaah_member_id' => $member->id,
        'nomor_paspor' => 'NEW987',
        'nama_paspor' => 'BUDI SANTOSO HERNANDEZ',
        'keterangan' => 'Ubah nama.',
        'paspor_file' => 'recommendations/passport.jpg',
        'status' => 'approved',
    ]);

    $this->actingAs($agent);

    // View unsigned (kosongan)
    $response = $this->get(route('admin.recommendations.print', $recommendation->id));
    $response->assertStatus(200);
    $response->assertSee('BUDI SANTOSO HERNANDEZ');
    $response->assertDontSee('STEMPEL CABANG.png');

    // View signed (tertanda tangan)
    $response = $this->get(route('admin.recommendations.print', ['id' => $recommendation->id, 'signed' => 1]));
    $response->assertStatus(200);
    $response->assertSee('STEMPEL CABANG.png');
});

