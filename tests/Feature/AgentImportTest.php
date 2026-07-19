<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;

uses(RefreshDatabase::class);

test('admin can import agents from excel/csv and they can login using no_hp', function () {
    $admin = User::create([
        'name' => 'Admin Test',
        'email' => 'admin@test.com',
        'password' => bcrypt('password'),
        'role' => 'admin',
        'is_active' => true,
    ]);

    // Create a fake CSV file representing the Excel format
    $content = "ID_AGEN,NAMA_AGEN,ALAMAT,NO_HP\n" .
               "A001,Adam (Ust) Jember,bunut,81252777871\n" .
               "A002,Alice Jember,jalan raya,081252777872\n";

    $file = UploadedFile::fake()->createWithContent('agents.csv', $content);

    $response = $this->actingAs($admin)
        ->post(route('admin.agents.import'), [
            'file' => $file,
        ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    // Verify agents were created
    $agent1 = User::where('agent_code', 'A001')->first();
    expect($agent1)->not->toBeNull();
    expect($agent1->name)->toBe('Adam (Ust) Jember');
    expect($agent1->email)->toBe('a001@annamirah.com');
    expect($agent1->role)->toBe('agen');
    
    // Check their profile was created correctly
    expect($agent1->profile)->not->toBeNull();
    expect($agent1->profile->no_wa)->toBe('081252777871'); // should be normalized from 81252777871
    expect($agent1->profile->alamat)->toBe('bunut');

    $agent2 = User::where('agent_code', 'A002')->first();
    expect($agent2)->not->toBeNull();
    expect($agent2->name)->toBe('Alice Jember');
    expect($agent2->email)->toBe('a002@annamirah.com');
    expect($agent2->profile->no_wa)->toBe('081252777872');
    expect($agent2->profile->alamat)->toBe('jalan raya');

    // Log out admin first to test login
    auth()->logout();

    // Test that the agent can login using their phone number (no_wa) as both username and password
    // Fortify expects the email input to hold either email or phone number
    $loginResponse = $this->post(route('login'), [
        'email' => '081252777871',
        'password' => '081252777871',
    ]);

    $loginResponse->assertRedirect();
    $this->assertAuthenticatedAs($agent1);
});
