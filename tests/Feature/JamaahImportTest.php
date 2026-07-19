<?php

use App\Models\User;
use App\Models\Package;
use App\Models\Booking;
use App\Models\Order;
use App\Models\JamaahMember;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;

uses(RefreshDatabase::class);

test('admin can import jamaah members from csv/excel and associate with package and agents', function () {
    $admin = User::create([
        'name' => 'Admin Test',
        'email' => 'admin@test.com',
        'password' => bcrypt('password'),
        'role' => 'admin',
        'is_active' => true,
    ]);

    // Create a package
    $package = Package::create([
        'code' => 'PKG001',
        'name' => 'Januari 2026 + Turkey',
        'program_days' => 12,
        'departure_date' => '2026-01-15',
        'airline' => 'Saudi Arabian Airlines',
        'price' => 30000000,
        'hotel_makkah' => 'Pullman Zamzam',
        'hotel_madinah' => 'Al Haram',
        'total_seats' => 45,
        'available_seats' => 45,
        'is_active' => true,
    ]);

    // Create an agent user
    $agent = User::create([
        'name' => 'Gus Mawardi',
        'email' => 'mawardi@test.com',
        'password' => bcrypt('password'),
        'role' => 'agen',
        'is_active' => true,
    ]);
    $agent->profile()->create([
        'no_wa' => '08123456789',
        'tempat_lahir' => 'Pasuruan',
        'tgl_lahir' => '1980-01-01',
        'alamat' => 'Pasuruan',
    ]);

    // Create a CSV mock of the manifest file
    $content = "NO,AGENT,NAME,SEX,AGE,PLACE,DATE,PASSPORT,ISSUED,EXPIRED,OFFICE,PP,VM,VP\n" .
               "1,GUS MAWARDI,NIKMATUS SHOLIKHAH,P,41,PASURUAN,7 Feb 1984,E5086884,19 Okt 2023,19 Okt 2033,MALANG,2,2,2\n" .
               "2,ERWIN 1,YAYUK SRI WAHYUNINGSIH,P,,MALANG,12 OCT 1978,E1135696,21 OCT 2022,21 OCT 2032,MALANG,-,-,-\n";

    $file = UploadedFile::fake()->createWithContent('manifest.csv', $content);

    $response = $this->actingAs($admin)
        ->post(route('admin.jamaah.import'), [
            'package_id' => $package->id,
            'file' => $file,
        ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    // Verify NIKMATUS SHOLIKHAH was created and linked to agent Gus Mawardi
    $member1 = JamaahMember::where('name', 'NIKMATUS SHOLIKHAH')->first();
    expect($member1)->not->toBeNull();
    expect($member1->jenis_kelamin)->toBe('Perempuan');
    expect($member1->tempat_lahir)->toBe('PASURUAN');
    expect($member1->tgl_lahir)->toBe('1984-02-07');
    expect($member1->nomor_paspor)->toBe('E5086884');
    expect($member1->paspor_issued)->toBe('2023-10-19');
    expect($member1->paspor_expiry)->toBe('2033-10-19');
    expect($member1->paspor_office)->toBe('MALANG');
    expect($member1->pp)->toBe('2');
    expect($member1->vm)->toBe('2');
    expect($member1->vp)->toBe('2');

    // Should have order for Gus Mawardi
    $order = Order::where('package_id', $package->id)->where('agent_id', $agent->id)->first();
    expect($order)->not->toBeNull();
    expect($order->total_pax)->toBe(1);

    // Should have booking for member1 linked to order
    $booking1 = Booking::where('jamaah_member_id', $member1->id)->where('package_id', $package->id)->first();
    expect($booking1)->not->toBeNull();
    expect($booking1->order_id)->toBe($order->id);

    // Verify YAYUK SRI WAHYUNINGSIH was created (no agent matches ERWIN 1, so it should default to Pusat/Mandiri with no order_id)
    $member2 = JamaahMember::where('name', 'YAYUK SRI WAHYUNINGSIH')->first();
    expect($member2)->not->toBeNull();
    expect($member2->jenis_kelamin)->toBe('Perempuan');
    expect($member2->tempat_lahir)->toBe('MALANG');
    expect($member2->tgl_lahir)->toBe('1978-10-12');
    expect($member2->nomor_paspor)->toBe('E1135696');
    expect($member2->pp)->toBe('-');

    // Booking for member2 should have null order_id
    $booking2 = Booking::where('jamaah_member_id', $member2->id)->where('package_id', $package->id)->first();
    expect($booking2)->not->toBeNull();
    expect($booking2->order_id)->toBeNull();
});
