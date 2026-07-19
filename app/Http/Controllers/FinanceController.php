<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Package;
use App\Models\FinanceRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FinanceController extends Controller
{
    public function index(Request $request)
    {
        $role = $request->user()->role;
        if (!in_array($role, ['admin', 'pusat'])) {
            abort(403, 'Unauthorized access.');
        }

        // Get filter inputs
        $search = $request->input('search');
        $type = $request->input('type');
        $agentId = $request->input('agent_id');
        $packageId = $request->input('package_id');
        $bank = $request->input('bank');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        // Base Query
        $query = FinanceRecord::with(['agent', 'package'])
            ->orderBy('transaction_date', 'desc')
            ->orderBy('created_at', 'desc');

        // Apply filters
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('agent', function ($sq) use ($search) {
                    $sq->where('name', 'like', "%{$search}%");
                })->orWhereHas('package', function ($sq) use ($search) {
                    $sq->where('name', 'like', "%{$search}%")
                      ->orWhere('code', 'like', "%{$search}%");
                })->orWhere('category_bank', 'like', "%{$search}%")
                  ->orWhere('raw_agent_name', 'like', "%{$search}%")
                  ->orWhere('raw_departure_date_package', 'like', "%{$search}%");
            });
        }

        if ($type) {
            $query->where('type', $type);
        }

        if ($agentId) {
            $query->where('agent_id', $agentId);
        }

        if ($packageId) {
            $query->where('package_id', $packageId);
        }

        if ($bank) {
            $query->where('category_bank', $bank);
        }

        if ($startDate) {
            $query->whereDate('transaction_date', '>=', $startDate);
        }

        if ($endDate) {
            $query->whereDate('transaction_date', '<=', $endDate);
        }

        // Clone query for calculating filtered totals before pagination
        $filteredQuery = clone $query;

        $records = $query->paginate(15)->withQueryString();

        // Calculate summary stats (on filtered query for maximum accuracy, or global? Let's do global of all transactions)
        $totalIncome = FinanceRecord::where('type', 'PEMASUKAN')->sum('amount');
        $totalExpense = FinanceRecord::where('type', 'PENGELUARAN')->sum('amount');
        $balance = $totalIncome - $totalExpense;

        // Filtered Totals
        $filteredIncome = (float)(clone $filteredQuery)->where('type', 'PEMASUKAN')->sum('amount');
        $filteredExpense = (float)(clone $filteredQuery)->where('type', 'PENGELUARAN')->sum('amount');
        $filteredNet = $filteredIncome - $filteredExpense;

        // Dropdowns data for filtering (only from imported data)
        $filterAgents = User::whereIn('id', function($q) use ($packageId) {
            $q->select('agent_id')
              ->from('finance_records')
              ->whereNotNull('agent_id');
            if ($packageId) {
                $q->where('package_id', $packageId);
            }
        })->orderBy('name', 'asc')->get(['id', 'name']);

        $filterPackages = Package::whereIn('id', function($q) use ($agentId) {
            $q->select('package_id')
              ->from('finance_records')
              ->whereNotNull('package_id');
            if ($agentId) {
                $q->where('agent_id', $agentId);
            }
        })->orderBy('departure_date', 'desc')->get(['id', 'name', 'code', 'departure_date']);

        // Dropdowns data
        $agents = User::where('role', 'agen')->orderBy('name', 'asc')->get(['id', 'name']);
        $packages = Package::orderBy('departure_date', 'desc')->get(['id', 'name', 'code', 'departure_date']);
        $banks = FinanceRecord::distinct()->whereNotNull('category_bank')->pluck('category_bank')->toArray();

        return Inertia::render('admin/finance', [
            'records' => $records,
            'agents' => $agents,
            'packages' => $packages,
            'filterAgents' => $filterAgents,
            'filterPackages' => $filterPackages,
            'banks' => $banks,
            'stats' => [
                'total_income' => (float)$totalIncome,
                'total_expense' => (float)$totalExpense,
                'balance' => (float)$balance,
                'filtered_income' => $filteredIncome,
                'filtered_expense' => $filteredExpense,
                'filtered_net' => $filteredNet,
            ],
            'filters' => $request->only(['search', 'type', 'agent_id', 'package_id', 'bank', 'start_date', 'end_date']),
        ]);
    }

    public function store(Request $request)
    {
        $role = $request->user()->role;
        if (!in_array($role, ['admin', 'pusat'])) {
            abort(403);
        }

        $validated = $request->validate([
            'agent_id' => 'nullable|exists:users,id',
            'package_id' => 'nullable|exists:packages,id',
            'transaction_date' => 'required|date',
            'category_bank' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'type' => 'required|in:PEMASUKAN,PENGELUARAN',
            'proof_link' => 'nullable|string',
        ]);

        FinanceRecord::create($validated);

        return back()->with('success', 'Transaksi keuangan berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $role = $request->user()->role;
        if (!in_array($role, ['admin', 'pusat'])) {
            abort(403);
        }

        $record = FinanceRecord::findOrFail($id);

        $validated = $request->validate([
            'agent_id' => 'nullable|exists:users,id',
            'package_id' => 'nullable|exists:packages,id',
            'transaction_date' => 'required|date',
            'category_bank' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'type' => 'required|in:PEMASUKAN,PENGELUARAN',
            'proof_link' => 'nullable|string',
        ]);

        // If manually linking, we can clear the raw warnings
        if ($request->has('agent_id')) {
            $record->raw_agent_name = null;
        }
        if ($request->has('package_id')) {
            $record->raw_departure_date_package = null;
        }

        $record->update($validated);

        return back()->with('success', 'Transaksi keuangan berhasil diperbarui.');
    }

    public function destroy(Request $request, $id)
    {
        $role = $request->user()->role;
        if (!in_array($role, ['admin', 'pusat'])) {
            abort(403);
        }

        $record = FinanceRecord::findOrFail($id);
        $record->delete();

        return back()->with('success', 'Transaksi keuangan berhasil dihapus.');
    }

    public function import(Request $request)
    {
        $role = $request->user()->role;
        if (!in_array($role, ['admin', 'pusat'])) {
            abort(403);
        }

        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv,txt|max:10240',
        ]);

        $file = $request->file('file');
        $path = $file->getRealPath();

        try {
            $spreadsheet = IOFactory::load($path);
            $sheet = $spreadsheet->getActiveSheet();
            $rows = $sheet->toArray(null, true, true, true);

            if (empty($rows)) {
                return back()->withErrors(['message' => 'File Excel kosong atau tidak terbaca.']);
            }

            // Find headers
            $headers = [];
            $firstRowIndex = null;

            // Search for the row containing header labels
            foreach ($rows as $rowIndex => $row) {
                foreach ($row as $colIndex => $cellValue) {
                    $cleaned = strtolower(trim($cellValue));
                    if (str_contains($cleaned, 'nama agen') || str_contains($cleaned, 'agen')) {
                        $headers['agent'] = $colIndex;
                    }
                    if (str_contains($cleaned, 'tanggal berangkat') || str_contains($cleaned, 'tgl berangkat') || str_contains($cleaned, 'berangkat') || str_contains($cleaned, 'kode paket') || str_contains($cleaned, 'kode')) {
                        $headers['departure'] = $colIndex;
                    }
                    if (str_contains($cleaned, 'tanggal transaksi') || str_contains($cleaned, 'tgl transaksi')) {
                        $headers['date'] = $colIndex;
                    }
                    if (str_contains($cleaned, 'kategori') || str_contains($cleaned, 'bank')) {
                        $headers['bank'] = $colIndex;
                    }
                    if (str_contains($cleaned, 'nominal') || str_contains($cleaned, 'jumlah') || str_contains($cleaned, 'nominal transaksi')) {
                        $headers['amount'] = $colIndex;
                    }
                    if (str_contains($cleaned, 'jenis')) {
                        $headers['type'] = $colIndex;
                    }
                    if (str_contains($cleaned, 'link') || str_contains($cleaned, 'bukti')) {
                        $headers['proof'] = $colIndex;
                    }
                }

                // If we found at least Agent and Nominal/Amount, this is the header row
                if (isset($headers['agent']) && (isset($headers['amount']) || isset($headers['bank']))) {
                    $firstRowIndex = $rowIndex;
                    break;
                }
            }

            if (!$firstRowIndex) {
                return back()->withErrors(['message' => 'Format kolom Excel tidak sesuai. Pastikan terdapat kolom "Nama Agen", "Tanggal Berangkat", "Tanggal Transaksi", "Kategori/Bank", "Nominal", "Jenis Transaksi", "Link Bukti".']);
            }

            $importedCount = 0;
            $unmappedAgents = 0;
            $unmappedPackages = 0;

            DB::beginTransaction();

            // Identify which packages / departures are being imported so we can clear only their old records
            $packageIdsToClear = [];
            $rawDeparturesToClear = [];
            $clearNullPackage = false;

            foreach ($rows as $rowIndex => $row) {
                if ($rowIndex <= $firstRowIndex) {
                    continue;
                }

                $rowAgentName = isset($headers['agent']) ? $row[$headers['agent']] : null;
                $rowDeparture = isset($headers['departure']) ? $row[$headers['departure']] : null;
                $rowAmount = isset($headers['amount']) ? $row[$headers['amount']] : null;

                if (empty($rowAgentName) && empty($rowDeparture) && empty($rowAmount)) {
                    continue;
                }

                if (!empty($rowDeparture)) {
                    $cleanedDeparture = trim($rowDeparture);
                    $package = Package::where('code', $cleanedDeparture)->first();
                    if ($package) {
                        $packageIdsToClear[] = $package->id;
                    } else {
                        $parts = explode(',', $cleanedDeparture);
                        $pkgCode = trim($parts[1] ?? $parts[0] ?? '');
                        $packageFallback = Package::where('code', $pkgCode)->first();
                        if ($packageFallback) {
                            $packageIdsToClear[] = $packageFallback->id;
                        } else {
                            $rawDeparturesToClear[] = $cleanedDeparture;
                        }
                    }
                } else {
                    $clearNullPackage = true;
                }
            }

            $packageIdsToClear = array_unique(array_filter($packageIdsToClear));
            $rawDeparturesToClear = array_unique(array_filter($rawDeparturesToClear));

            // Clear existing finance records only for the packages being imported
            if (!empty($packageIdsToClear) || !empty($rawDeparturesToClear) || $clearNullPackage) {
                FinanceRecord::query()->where(function ($q) use ($packageIdsToClear, $rawDeparturesToClear, $clearNullPackage) {
                    if (!empty($packageIdsToClear)) {
                        $q->orWhereIn('package_id', $packageIdsToClear);
                    }
                    if (!empty($rawDeparturesToClear)) {
                        $q->orWhereIn('raw_departure_date_package', $rawDeparturesToClear);
                    }
                    if ($clearNullPackage) {
                        $q->orWhere(function ($sq) {
                            $sq->whereNull('package_id')->whereNull('raw_departure_date_package');
                        });
                    }
                })->delete();
            }

            foreach ($rows as $rowIndex => $row) {
                // Skip header row and any row before it
                if ($rowIndex <= $firstRowIndex) {
                    continue;
                }

                // Read values based on header indices
                $rowAgentName = isset($headers['agent']) ? $row[$headers['agent']] : null;
                $rowDeparture = isset($headers['departure']) ? $row[$headers['departure']] : null;
                $rowDate = isset($headers['date']) ? $row[$headers['date']] : null;
                $rowBank = isset($headers['bank']) ? $row[$headers['bank']] : null;
                $rowAmount = isset($headers['amount']) ? $row[$headers['amount']] : null;
                $rowType = isset($headers['type']) ? $row[$headers['type']] : null;
                $rowProof = isset($headers['proof']) ? $row[$headers['proof']] : null;

                // Skip completely empty rows
                if (empty($rowAgentName) && empty($rowDeparture) && empty($rowAmount)) {
                    continue;
                }

                // --- SMART AUTO-SHIFT LOGIC FOR MISALIGNED ROWS ---
                // If the transaction date is empty, but the Kategori/Bank column looks like a date (e.g. Row 1 shifted right)
                if (empty($rowDate) && !empty($rowBank) && preg_match('/^\d{4}-\d{2}-\d{2}$/', trim($rowBank))) {
                    // Shift columns left
                    $rowDate = $rowBank;
                    $rowBank = $rowAmount;
                    $rowAmount = $rowType;
                    $rowType = $rowProof;

                    // Fetch proof link from the next alphabetical column (e.g. if proof was G, get H)
                    if (isset($headers['proof'])) {
                        $proofColAscii = ord($headers['proof']);
                        $nextColChar = chr($proofColAscii + 1);
                        $rowProof = isset($row[$nextColChar]) ? $row[$nextColChar] : null;
                    }
                }

                // --- PARSE VALUES ---
                // Clean Agent Name
                $agentId = null;
                $rawAgentName = null;
                if (!empty($rowAgentName)) {
                    $cleanedAgentName = trim($rowAgentName);
                    // Match Agent in User model with role 'agen'
                    $agent = User::where('role', 'agen')
                        ->where(function($q) use ($cleanedAgentName) {
                            $q->whereRaw('LOWER(name) = ?', [strtolower($cleanedAgentName)])
                              ->orWhere('name', 'like', "%{$cleanedAgentName}%");
                        })->first();

                    if ($agent) {
                        $agentId = $agent->id;
                    } else {
                        $rawAgentName = $cleanedAgentName;
                        $unmappedAgents++;
                    }
                }

                // Clean Package
                $packageId = null;
                $rawDeparture = null;
                if (!empty($rowDeparture)) {
                    $cleanedDeparture = trim($rowDeparture);
                    
                    // Match Package in Package model solely by code
                    $package = Package::where('code', $cleanedDeparture)->first();

                    if ($package) {
                        $packageId = $package->id;
                    } else {
                        // Try fallback if the cell has "date,code" format
                        $parts = explode(',', $cleanedDeparture);
                        $pkgCode = trim($parts[1] ?? $parts[0] ?? '');
                        
                        $packageFallback = Package::where('code', $pkgCode)->first();
                        if ($packageFallback) {
                            $packageId = $packageFallback->id;
                        } else {
                            $rawDeparture = $cleanedDeparture;
                            $unmappedPackages++;
                        }
                    }
                }

                // Parse transaction date
                $transactionDate = now()->format('Y-m-d');
                if (!empty($rowDate)) {
                    $cleanedDate = trim($rowDate);
                    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $cleanedDate)) {
                        $transactionDate = $cleanedDate;
                    } else {
                        try {
                            $transactionDate = date('Y-m-d', strtotime($cleanedDate));
                        } catch (\Exception $e) {}
                    }
                }

                // Parse amount (remove currency formatting, dots, commas)
                $amount = 0;
                if (!empty($rowAmount)) {
                    $cleanedAmount = preg_replace('/[^0-9.]/', '', $rowAmount);
                    $amount = (float)$cleanedAmount;
                }

                // Parse transaction type (default to PEMASUKAN)
                $type = 'PEMASUKAN';
                if (!empty($rowType)) {
                    $cleanedType = strtoupper(trim($rowType));
                    if (str_contains($cleanedType, 'PENGELUARAN') || str_contains($cleanedType, 'OUT')) {
                        $type = 'PENGELUARAN';
                    }
                }

                // Save record
                FinanceRecord::create([
                    'agent_id' => $agentId,
                    'package_id' => $packageId,
                    'transaction_date' => $transactionDate,
                    'category_bank' => trim($rowBank ?? 'CASH'),
                    'amount' => $amount,
                    'type' => $type,
                    'proof_link' => !empty($rowProof) ? trim($rowProof) : null,
                    'raw_agent_name' => $rawAgentName,
                    'raw_departure_date_package' => $rawDeparture,
                ]);

                $importedCount++;
            }

            DB::commit();

            $msg = "Berhasil mengimpor {$importedCount} baris data keuangan.";
            if ($unmappedAgents > 0 || $unmappedPackages > 0) {
                $msg .= " Terdapat {$unmappedAgents} Agen dan {$unmappedPackages} Paket yang tidak teridentifikasi dan memerlukan pemetaan manual.";
            }

            return back()->with('success', $msg);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Import keuangan failed: ' . $e->getMessage());
            return back()->withErrors(['message' => 'Gagal membaca file: ' . $e->getMessage()]);
        }
    }
}
