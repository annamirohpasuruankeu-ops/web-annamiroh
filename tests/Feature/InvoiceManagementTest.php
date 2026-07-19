<?php

use App\Models\User;
use App\Models\Invoice;
use App\Models\FinanceRecord;
use Illuminate\Http\UploadedFile;
use function Pest\Laravel\{actingAs, get, post};

beforeEach(function () {
    $this->admin = User::factory()->create(['role' => 'admin']);
    $this->agent = User::factory()->create(['role' => 'agen', 'name' => 'Agus Surabaya']);
    $this->otherAgent = User::factory()->create(['role' => 'agen', 'name' => 'Suci (Bu)']);

    // Seed a package for matching
    $this->package = \App\Models\Package::create([
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

test('only authorized users can access invoices index', function () {
    // Guest
    get(route('admin.invoices.index'))
        ->assertRedirect('/login');

    // Customer User
    $customer = User::factory()->create(['role' => 'user']);
    actingAs($customer)
        ->get(route('admin.invoices.index'))
        ->assertStatus(403);

    // Agent
    actingAs($this->agent)
        ->get(route('admin.invoices.index'))
        ->assertStatus(200);

    // Admin
    actingAs($this->admin)
        ->get(route('admin.invoices.index'))
        ->assertStatus(200);
});

test('only admin and pusat can import invoices', function () {
    $file = UploadedFile::fake()->createWithContent('tagihan.csv', "Nama Agen,Tanggal Keberangkatan,GRAND_TOTAL\nAgus Surabaya,\"2026-06-22, 12HR G1\",1000\n");

    // Agent cannot import
    actingAs($this->agent)
        ->post(route('admin.invoices.import'), ['file' => $file])
        ->assertStatus(403);

    // Admin can import
    actingAs($this->admin)
        ->post(route('admin.invoices.import'), ['file' => $file])
        ->assertRedirect();
});

test('import deletes old records and parses headers and rows correctly', function () {
    // Seed an old invoice matching the imported package
    Invoice::create([
        'invoice_code' => 'INV-OLD',
        'grand_total' => 5000000,
        'package_id' => $this->package->id,
    ]);

    // Create CSV content simulating columns
    $csvContent = "ID_TAGIHAN,Nama Agen,Tanggal Keberangkatan,GRAND_TOTAL,KETERANGAN,ITEM1_DESC,ITEM1_VOL,ITEM1_HARGA,ITEM1_JUMLAH,DISKON1_DESC,DISKON1_NOM\n";
    $csvContent .= "INV-1767107-519671,Agus Surabaya,\"2026-06-22, 12HR G1\",25000000,Notes Here,Quad,1,25000000,25000000,Diskon Awal,1000000\n";
    $csvContent .= "INV-1767107-606296,Suci (Bu),\"2026-06-22, 12HR G1\",77100000,,Quad,3,25700000,77100000,,\n";
    $csvContent .= ",Unknown Agent,2026-06-22,15000000,,Quad,1,15000000,15000000,,\n";

    $file = UploadedFile::fake()->createWithContent('tagihan.csv', $csvContent);

    actingAs($this->admin)
        ->post(route('admin.invoices.import'), [
            'file' => $file,
        ])
        ->assertRedirect();

    // Verify old invoice is deleted
    expect(Invoice::where('invoice_code', 'INV-OLD')->first())->toBeNull();

    // Verify Row 1: Mapped to Agus Surabaya agent and the package
    $inv1 = Invoice::where('invoice_code', 'INV-1767107-519671')->first();
    expect($inv1)->not->toBeNull();
    expect($inv1->agent_id)->toBe($this->agent->id);
    expect($inv1->package_id)->toBe($this->package->id);
    expect((float)$inv1->grand_total)->toBe(25000000.0);
    expect($inv1->keterangan)->toBe('Notes Here');
    expect($inv1->items)->toBeArray();
    expect($inv1->items[0]['desc'])->toBe('Quad');
    expect((int)$inv1->items[0]['vol'])->toBe(1);
    expect((float)$inv1->items[0]['harga'])->toBe(25000000.0);
    expect((float)$inv1->items[0]['sub'])->toBe(25000000.0);
    expect($inv1->discounts)->toBeArray();
    expect($inv1->discounts[0]['desc'])->toBe('Diskon Awal');
    expect((float)$inv1->discounts[0]['nominal'])->toBe(1000000.0);
    expect($inv1->raw_agent_name)->toBeNull();
    expect($inv1->raw_departure_date_package)->toBeNull();

    // Verify Row 2: Mapped to Suci (Bu) agent and the package
    $inv2 = Invoice::where('invoice_code', 'INV-1767107-606296')->first();
    expect($inv2)->not->toBeNull();
    expect($inv2->agent_id)->toBe($this->otherAgent->id);
    expect($inv2->package_id)->toBe($this->package->id);
    expect((float)$inv2->grand_total)->toBe(77100000.0);
    expect($inv2->raw_agent_name)->toBeNull();
    expect($inv2->raw_departure_date_package)->toBeNull();

    // Verify Row 3: Unmapped agent, raw name extracted, package unmapped, and code auto-generated
    $inv3 = Invoice::where('raw_agent_name', 'Unknown Agent')->first();
    expect($inv3)->not->toBeNull();
    expect($inv3->invoice_code)->not->toBeNull();
    expect($inv3->invoice_code)->toStartWith('INV-');
    expect($inv3->agent_id)->toBeNull();
    expect($inv3->package_id)->toBeNull();
    expect($inv3->raw_departure_date_package)->toBe('2026-06-22');
});

test('importing package A deletes old invoices of package A but preserves package B', function () {
    // Create package B
    $packageB = \App\Models\Package::create([
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

    // Seed existing invoices for both packages
    Invoice::create([
        'invoice_code' => 'INV-PKG-A-OLD',
        'package_id' => $this->package->id,
        'grand_total' => 25000000,
    ]);

    Invoice::create([
        'invoice_code' => 'INV-PKG-B-OLD',
        'package_id' => $packageB->id,
        'grand_total' => 30000000,
    ]);

    // Import file containing ONLY package A data
    $csvContent = "ID_TAGIHAN,Nama Agen,Tanggal Keberangkatan,GRAND_TOTAL\n";
    $csvContent .= "INV-PKG-A-NEW,Agus Surabaya,\"2026-06-22, 12HR G1\",25000000\n";

    $file = UploadedFile::fake()->createWithContent('tagihan.csv', $csvContent);

    actingAs($this->admin)
        ->post(route('admin.invoices.import'), [
            'file' => $file,
        ])
        ->assertRedirect();

    // Verify package A old invoice is deleted
    expect(Invoice::where('invoice_code', 'INV-PKG-A-OLD')->first())->toBeNull();

    // Verify package A new invoice is created
    expect(Invoice::where('invoice_code', 'INV-PKG-A-NEW')->first())->not->toBeNull();

    // Verify package B invoice is preserved
    expect(Invoice::where('invoice_code', 'INV-PKG-B-OLD')->first())->not->toBeNull();
});

test('agents can only see their own invoices', function () {
    // Seed invoices for both agents
    $invAgus = Invoice::create([
        'invoice_code' => 'INV-AGUS',
        'agent_id' => $this->agent->id,
        'grand_total' => 20000000,
    ]);

    $invSuci = Invoice::create([
        'invoice_code' => 'INV-SUCI',
        'agent_id' => $this->otherAgent->id,
        'grand_total' => 30000000,
    ]);

    // Request as Agus
    $response = actingAs($this->agent)
        ->get(route('admin.invoices.index'));
    
    $response->assertStatus(200);
    $invoicesProp = $response->original->getData()['page']['props']['invoices']['data'];
    
    // Assert Agus only sees his invoice
    $codes = collect($invoicesProp)->pluck('invoice_code');
    expect($codes)->toContain('INV-AGUS');
    expect($codes)->not->toContain('INV-SUCI');
});

test('invoice summary calculates expenses and reduces remaining balance', function () {
    // Agus tagihan
    Invoice::create([
        'invoice_code' => 'INV-AGUS',
        'agent_id' => $this->agent->id,
        'grand_total' => 20000000,
    ]);

    // Agus payments (PEMASUKAN)
    FinanceRecord::create([
        'agent_id' => $this->agent->id,
        'transaction_date' => '2026-07-01',
        'category_bank' => 'BCA',
        'amount' => 5000000,
        'type' => 'PEMASUKAN',
    ]);

    // Agus expenses (PENGELUARAN)
    FinanceRecord::create([
        'agent_id' => $this->agent->id,
        'transaction_date' => '2026-07-02',
        'category_bank' => 'BCA',
        'amount' => 2000000,
        'type' => 'PENGELUARAN',
    ]);

    // Admin request
    $response = actingAs($this->admin)
        ->get(route('admin.invoices.index'));
    
    $response->assertStatus(200);
    $summary = $response->original->getData()['page']['props']['summary'];
    
    // Find Agus in summary
    $agusSummary = collect($summary)->firstWhere('agent_id', $this->agent->id);
    expect($agusSummary)->not->toBeNull();
    expect($agusSummary['total_tagihan'])->toEqual(20000000.0);
    expect($agusSummary['total_terbayar'])->toEqual(5000000.0);
    expect($agusSummary['total_pengeluaran'])->toEqual(2000000.0);
    expect($agusSummary['uang_bayar'])->toEqual(3000000.0); // 5M - 2M = 3M
    expect($agusSummary['kurang'])->toEqual(17000000.0); // 20M - (5M - 2M) = 17M

    // Agent request
    $agentResponse = actingAs($this->agent)
        ->get(route('admin.invoices.index'));
    
    $agentResponse->assertStatus(200);
    $individualSummary = $agentResponse->original->getData()['page']['props']['individualSummary'];
    expect($individualSummary)->not->toBeNull();
    expect($individualSummary['total_tagihan'])->toEqual(20000000.0);
    expect($individualSummary['total_terbayar'])->toEqual(5000000.0);
    expect($individualSummary['total_pengeluaran'])->toEqual(2000000.0);
    expect($individualSummary['uang_bayar'])->toEqual(3000000.0);
    expect($individualSummary['kurang'])->toEqual(17000000.0);
});

