<?php

use App\Models\User;
use App\Models\Package;
use App\Models\FinanceRecord;
use Illuminate\Http\UploadedFile;
use function Pest\Laravel\{actingAs, get, post, put, delete};

beforeEach(function () {
    // Create admin user
    $this->admin = User::factory()->create(['role' => 'admin']);
    // Create agen users
    $this->agent1 = User::factory()->create(['role' => 'agen', 'name' => 'Irfan Surabaya']);
    $this->agent2 = User::factory()->create(['role' => 'agen', 'name' => 'Heru Kalbar']);
    
    // Create package
    $this->package = Package::create([
        'name' => 'Paket Premium 12 Hari',
        'code' => '12HR G1',
        'departure_date' => '2026-06-22',
        'price' => 35000000,
        'program_days' => 12,
        'airline' => 'Garuda',
        'hotel_makkah' => 'Hilton',
        'hotel_madinah' => 'Pullman',
        'total_seats' => 45,
        'available_seats' => 45,
        'is_active' => true,
    ]);
});

test('guests and regular agents cannot access finance management', function () {
    // Guest
    get(route('admin.finance.index'))
        ->assertRedirect('/login');

    // Agent
    $agentUser = User::factory()->create(['role' => 'agen']);
    actingAs($agentUser)
        ->get(route('admin.finance.index'))
        ->assertStatus(403);
});

test('admins can view finance management page', function () {
    actingAs($this->admin)
        ->get(route('admin.finance.index'))
        ->assertStatus(200);
});

test('admins can perform CRUD operations on finance records', function () {
    // Create
    actingAs($this->admin)
        ->post(route('admin.finance.store'), [
            'agent_id' => $this->agent1->id,
            'package_id' => $this->package->id,
            'transaction_date' => '2026-04-15',
            'category_bank' => 'BCA',
            'amount' => 15000000,
            'type' => 'PEMASUKAN',
            'proof_link' => 'https://drive.google.com/test',
        ])
        ->assertRedirect();

    $record = FinanceRecord::where('category_bank', 'BCA')->first();
    expect($record)->not->toBeNull();
    expect($record->agent_id)->toBe($this->agent1->id);
    expect($record->package_id)->toBe($this->package->id);
    expect((float)$record->amount)->toBe(15000000.0);
    expect($record->type)->toBe('PEMASUKAN');

    $record = FinanceRecord::first();

    // Update
    actingAs($this->admin)
        ->put(route('admin.finance.update', $record->id), [
            'agent_id' => $this->agent2->id,
            'package_id' => $this->package->id,
            'transaction_date' => '2026-04-16',
            'category_bank' => 'MANDIRI',
            'amount' => 20000000,
            'type' => 'PENGELUARAN',
            'proof_link' => 'https://drive.google.com/updated',
        ])
        ->assertRedirect();

    $record->refresh();
    expect($record->agent_id)->toBe($this->agent2->id);
    expect($record->category_bank)->toBe('MANDIRI');
    expect((float)$record->amount)->toBe(20000000.0);
    expect($record->type)->toBe('PENGELUARAN');

    // Delete
    actingAs($this->admin)
        ->delete(route('admin.finance.destroy', $record->id))
        ->assertRedirect();

    expect(FinanceRecord::find($record->id))->toBeNull();
});

test('admins can import finance records from CSV including shifted alignment rows', function () {
    // Create an existing record that should be deleted upon import
    FinanceRecord::create([
        'agent_id' => $this->agent1->id,
        'package_id' => $this->package->id,
        'transaction_date' => '2026-01-01',
        'category_bank' => 'OLD_BANK',
        'amount' => 500000,
        'type' => 'PEMASUKAN',
    ]);

    // Generate CSV content simulating row 1 shifted alignment and row 2 normal alignment
    $csvContent = "Nama Agen,Tanggal Berangkat,Tanggal Transaksi,Kategori/Bank,Nominal,Jenis Transaksi,Link Bukti\n";
    // Row 1: Irfan Surabaya, normal row
    $csvContent .= "Irfan Surabaya,\"2026-06-22, 12HR G1\",2025-11-24,BCA,15000000,PEMASUKAN,https://google.com/proof1\n";
    // Row 2: Heru Kalbar, shifted row (empty date cell shifts everything right)
    $csvContent .= "Heru Kalbar,\"2026-06-22, 12HR G1\",,2026-04-15,BRI,16000000,PEMASUKAN,https://google.com/proof2\n";
    // Row 3: Unknown Agent, unmapped row
    $csvContent .= "Unknown Agent,\"2029-01-01, INVALID_CODE\",2026-04-30,MANDIRI,30000000,PEMASUKAN,\n";

    $file = UploadedFile::fake()->createWithContent('keuangan.csv', $csvContent);

    actingAs($this->admin)
        ->post(route('admin.finance.import'), [
            'file' => $file,
        ])
        ->assertRedirect();

    // Verify old record was deleted
    expect(FinanceRecord::where('category_bank', 'OLD_BANK')->first())->toBeNull();

    // Verify Row 1: Mapped correctly
    $row1 = FinanceRecord::where('category_bank', 'BCA')->first();
    expect($row1)->not->toBeNull();
    expect($row1->agent_id)->toBe($this->agent1->id);
    expect($row1->package_id)->toBe($this->package->id);
    expect($row1->transaction_date->format('Y-m-d'))->toBe('2025-11-24');
    expect((float)$row1->amount)->toBe(15000000.0);
    expect($row1->type)->toBe('PEMASUKAN');
    expect($row1->proof_link)->toBe('https://google.com/proof1');
    expect($row1->raw_agent_name)->toBeNull();
    expect($row1->raw_departure_date_package)->toBeNull();

    // Verify Row 2: Repaired by auto-shift logic and mapped correctly
    $row2 = FinanceRecord::where('category_bank', 'BRI')->first();
    expect($row2)->not->toBeNull();
    expect($row2->agent_id)->toBe($this->agent2->id);
    expect($row2->package_id)->toBe($this->package->id);
    expect($row2->transaction_date->format('Y-m-d'))->toBe('2026-04-15');
    expect((float)$row2->amount)->toBe(16000000.0);
    expect($row2->type)->toBe('PEMASUKAN');
    expect($row2->proof_link)->toBe('https://google.com/proof2');
    expect($row2->raw_agent_name)->toBeNull();
    expect($row2->raw_departure_date_package)->toBeNull();

    // Verify Row 3: Imported but has null mapping and raw strings saved
    $row3 = FinanceRecord::where('category_bank', 'MANDIRI')->first();
    expect($row3)->not->toBeNull();
    expect($row3->agent_id)->toBeNull();
    expect($row3->package_id)->toBeNull();
    expect($row3->transaction_date->format('Y-m-d'))->toBe('2026-04-30');
    expect((float)$row3->amount)->toBe(30000000.0);
    expect($row3->type)->toBe('PEMASUKAN');
    expect($row3->raw_agent_name)->toBe('Unknown Agent');
    expect($row3->raw_departure_date_package)->toBe('2029-01-01, INVALID_CODE');
});

test('importing package A deletes old finance records of package A but preserves package B', function () {
    // Create package B
    $packageB = Package::create([
        'name' => 'Paket B',
        'code' => 'PK-B',
        'departure_date' => '2026-07-20',
        'price' => 30000000,
        'program_days' => 10,
        'airline' => 'Saudia',
        'hotel_makkah' => 'Grand Zamzam',
        'hotel_madinah' => 'Frontel',
        'total_seats' => 45,
        'available_seats' => 45,
        'is_active' => true,
    ]);

    // Seed existing finance records for both packages
    FinanceRecord::create([
        'agent_id' => $this->agent1->id,
        'package_id' => $this->package->id,
        'transaction_date' => '2026-01-01',
        'category_bank' => 'BANK_A',
        'amount' => 500000,
        'type' => 'PEMASUKAN',
    ]);

    FinanceRecord::create([
        'agent_id' => $this->agent1->id,
        'package_id' => $packageB->id,
        'transaction_date' => '2026-01-01',
        'category_bank' => 'BANK_B',
        'amount' => 600000,
        'type' => 'PEMASUKAN',
    ]);

    // Generate CSV content containing ONLY package A data
    $csvContent = "Nama Agen,Tanggal Berangkat,Tanggal Transaksi,Kategori/Bank,Nominal,Jenis Transaksi,Link Bukti\n";
    $csvContent .= "Irfan Surabaya,\"2026-06-22, 12HR G1\",2025-11-24,NEW_BANK_A,15000000,PEMASUKAN,\n";

    $file = UploadedFile::fake()->createWithContent('keuangan.csv', $csvContent);

    actingAs($this->admin)
        ->post(route('admin.finance.import'), [
            'file' => $file,
        ])
        ->assertRedirect();

    // Verify package A old finance record is deleted
    expect(FinanceRecord::where('category_bank', 'BANK_A')->first())->toBeNull();

    // Verify package A new finance record is created
    expect(FinanceRecord::where('category_bank', 'NEW_BANK_A')->first())->not->toBeNull();

    // Verify package B finance record is preserved
    expect(FinanceRecord::where('category_bank', 'BANK_B')->first())->not->toBeNull();
});

test('admins receive correct filtered totals when filtering by agent or package', function () {
    // Record 1: Agent 1, PEMASUKAN, 100000
    FinanceRecord::create([
        'agent_id' => $this->agent1->id,
        'package_id' => $this->package->id,
        'transaction_date' => '2026-04-15',
        'category_bank' => 'BCA',
        'amount' => 100000,
        'type' => 'PEMASUKAN',
    ]);

    // Record 2: Agent 1, PENGELUARAN, 30000
    FinanceRecord::create([
        'agent_id' => $this->agent1->id,
        'package_id' => $this->package->id,
        'transaction_date' => '2026-04-16',
        'category_bank' => 'BCA',
        'amount' => 30000,
        'type' => 'PENGELUARAN',
    ]);

    // Record 3: Agent 2, PEMASUKAN, 200000
    FinanceRecord::create([
        'agent_id' => $this->agent2->id,
        'package_id' => null,
        'transaction_date' => '2026-04-17',
        'category_bank' => 'BRI',
        'amount' => 200000,
        'type' => 'PEMASUKAN',
    ]);

    // Get for Agent 1
    actingAs($this->admin)
        ->get(route('admin.finance.index', ['agent_id' => $this->agent1->id]))
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->where('stats.filtered_income', 100000)
            ->where('stats.filtered_expense', 30000)
            ->where('stats.filtered_net', 70000)
            ->where('stats.total_income', 300000)
            ->where('stats.total_expense', 30000)
        );
});

test('admins can import finance records matching package solely by code', function () {
    $csvContent = "Nama Agen,Kode Paket,Tanggal Transaksi,Kategori/Bank,Nominal,Jenis Transaksi,Link Bukti\n" .
                  "Irfan Surabaya,12HR G1,2025-11-24,BCA,15000000,PEMASUKAN,\n";

    $file = UploadedFile::fake()->createWithContent('keuangan_code.csv', $csvContent);

    actingAs($this->admin)
        ->post(route('admin.finance.import'), [
            'file' => $file,
        ])
        ->assertRedirect();

    $record = FinanceRecord::where('category_bank', 'BCA')->first();
    expect($record)->not->toBeNull();
    expect($record->package_id)->toBe($this->package->id);
    expect($record->raw_departure_date_package)->toBeNull();
});

test('finance dropdown filters dynamically filter based on active selections and imported data', function () {
    // Record 1: Agent 1, Package
    FinanceRecord::create([
        'agent_id' => $this->agent1->id,
        'package_id' => $this->package->id,
        'transaction_date' => '2026-04-15',
        'category_bank' => 'BCA',
        'amount' => 100000,
        'type' => 'PEMASUKAN',
    ]);

    // Record 2: Agent 2, null package
    FinanceRecord::create([
        'agent_id' => $this->agent2->id,
        'package_id' => null,
        'transaction_date' => '2026-04-17',
        'category_bank' => 'BRI',
        'amount' => 200000,
        'type' => 'PEMASUKAN',
    ]);

    // Scenario 1: No filters active
    actingAs($this->admin)
        ->get(route('admin.finance.index'))
        ->assertInertia(fn ($page) => $page
            ->has('filterAgents', 2)
            ->has('filterPackages', 1)
        );

    // Scenario 2: Agent 1 selected -> Filtered packages should only contain package
    actingAs($this->admin)
        ->get(route('admin.finance.index', ['agent_id' => $this->agent1->id]))
        ->assertInertia(fn ($page) => $page
            ->has('filterPackages', 1)
            ->where('filterPackages.0.id', $this->package->id)
        );

    // Scenario 3: Agent 2 selected -> Filtered packages should be empty
    actingAs($this->admin)
        ->get(route('admin.finance.index', ['agent_id' => $this->agent2->id]))
        ->assertInertia(fn ($page) => $page
            ->has('filterPackages', 0)
        );

    // Scenario 4: Package selected -> Filtered agents should only contain Agent 1
    actingAs($this->admin)
        ->get(route('admin.finance.index', ['package_id' => $this->package->id]))
        ->assertInertia(fn ($page) => $page
            ->has('filterAgents', 1)
            ->where('filterAgents.0.id', $this->agent1->id)
        );
});
