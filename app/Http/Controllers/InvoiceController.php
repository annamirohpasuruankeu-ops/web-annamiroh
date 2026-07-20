<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\User;
use App\Models\FinanceRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $role = $request->user()->role;
        if (!in_array($role, ['admin', 'admin_keuangan', 'agen'])) {
            abort(403);
        }

        $search = $request->input('search');
        $query = Invoice::with(['agent', 'package'])->orderBy('created_at', 'desc');

        if ($role === 'agen') {
            $query->where('agent_id', $request->user()->id);
        } else {
            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->whereHas('agent', function($aq) use ($search) {
                        $aq->where('name', 'like', "%{$search}%");
                    })->orWhere('invoice_code', 'like', "%{$search}%")
                      ->orWhere('order_text', 'like', "%{$search}%")
                      ->orWhere('raw_agent_name', 'like', "%{$search}%")
                      ->orWhere('raw_departure_date_package', 'like', "%{$search}%")
                      ->orWhereHas('package', function($pq) use ($search) {
                          $pq->where('name', 'like', "%{$search}%")
                            ->orWhere('code', 'like', "%{$search}%");
                      });
                });
            }
        }

        $invoices = $query->paginate(10)->withQueryString();

        // Calculate consolidated summary per agent for Admin/Pusat
        $summary = [];
        $individualSummary = null;

        if ($role === 'agen') {
            $agentId = $request->user()->id;
            $totalTagihan = Invoice::where('agent_id', $agentId)->sum('grand_total');
            $totalTerbayar = $totalTagihan > 0 ? FinanceRecord::where('agent_id', $agentId)->where('type', 'PEMASUKAN')->sum('amount') : 0;
            $totalPengeluaran = $totalTagihan > 0 ? FinanceRecord::where('agent_id', $agentId)->where('type', 'PENGELUARAN')->sum('amount') : 0;
            $uangBayar = $totalTerbayar - $totalPengeluaran;
            
            $individualSummary = [
                'total_tagihan' => floatval($totalTagihan),
                'total_terbayar' => floatval($totalTerbayar),
                'total_pengeluaran' => floatval($totalPengeluaran),
                'uang_bayar' => floatval($uangBayar),
                'kurang' => floatval($totalTagihan - $uangBayar),
            ];
        } else {
            $agents = User::where('role', 'agen')->orderBy('name', 'asc')->get();
            foreach ($agents as $agent) {
                $tagihan = Invoice::where('agent_id', $agent->id)->sum('grand_total');
                
                if ($tagihan > 0) {
                    $terbayar = FinanceRecord::where('agent_id', $agent->id)->where('type', 'PEMASUKAN')->sum('amount');
                    $pengeluaran = FinanceRecord::where('agent_id', $agent->id)->where('type', 'PENGELUARAN')->sum('amount');
                    $uangBayar = $terbayar - $pengeluaran;
                    $summary[] = [
                        'agent_id' => $agent->id,
                        'agent_name' => $agent->name,
                        'total_tagihan' => floatval($tagihan),
                        'total_terbayar' => floatval($terbayar),
                        'total_pengeluaran' => floatval($pengeluaran),
                        'uang_bayar' => floatval($uangBayar),
                        'kurang' => floatval($tagihan - $uangBayar),
                    ];
                }
            }

            // Include Pusat/Mandiri if any tagihan is unassigned
            $pusatTagihan = Invoice::whereNull('agent_id')->sum('grand_total');
            if ($pusatTagihan > 0) {
                $pusatTerbayar = FinanceRecord::whereNull('agent_id')->where('type', 'PEMASUKAN')->sum('amount');
                $pusatPengeluaran = FinanceRecord::whereNull('agent_id')->where('type', 'PENGELUARAN')->sum('amount');
                $pusatUangBayar = $pusatTerbayar - $pusatPengeluaran;
                $summary[] = [
                    'agent_id' => null,
                    'agent_name' => 'Pusat / Mandiri',
                    'total_tagihan' => floatval($pusatTagihan),
                    'total_terbayar' => floatval($pusatTerbayar),
                    'total_pengeluaran' => floatval($pusatPengeluaran),
                    'uang_bayar' => floatval($pusatUangBayar),
                    'kurang' => floatval($pusatTagihan - $pusatUangBayar),
                ];
            }
        }

        return Inertia::render('admin/invoices', [
            'invoices' => $invoices,
            'summary' => $summary,
            'individualSummary' => $individualSummary,
            'filters' => [
                'search' => $search,
            ]
        ]);
    }

    public function import(Request $request)
    {
        $role = $request->user()->role;
        if (!in_array($role, ['admin', 'admin_keuangan'])) {
            abort(403);
        }

        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv,txt|max:10240',
        ]);

        $file = $request->file('file');
        $path = $file->getRealPath();

        try {
            $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($path);
            $sheet = $spreadsheet->getActiveSheet();
            $rows = $sheet->toArray(null, true, true, true);

            if (empty($rows)) {
                return back()->withErrors(['message' => 'File Excel kosong atau tidak terbaca.']);
            }

            // Find headers
            $headers = [];
            $firstRowIndex = null;

            foreach ($rows as $rowIndex => $row) {
                foreach ($row as $colIndex => $cellValue) {
                    $cleaned = str_replace(' ', '_', strtolower(trim($cellValue)));
                    
                    // Match Agent / Nama Agen
                    if ($cleaned === 'nama_agen' || $cleaned === 'nama agen' || $cleaned === 'agent' || $cleaned === 'agen' || str_contains($cleaned, 'nama_agen') || str_contains($cleaned, 'nama agen') || str_contains($cleaned, 'agen')) {
                        $headers['agent'] = $colIndex;
                    }
                    
                    // Match Departure / Tanggal Keberangkatan / Tanggal Berangkat
                    if ($cleaned === 'tanggal_keberangkatan' || $cleaned === 'tanggal keberangkatan' || $cleaned === 'tanggal_berangkat' || $cleaned === 'tanggal berangkat' || $cleaned === 'tgl_berangkat' || $cleaned === 'tgl berangkat' || str_contains($cleaned, 'berangkat') || str_contains($cleaned, 'keberangkatan') || str_contains($cleaned, 'keber') || str_contains($cleaned, 'kode_paket') || str_contains($cleaned, 'kode paket') || str_contains($cleaned, 'kode')) {
                        $headers['departure'] = $colIndex;
                    }

                    if ($cleaned === 'id_tagihan' || $cleaned === 'id tagihan' || $cleaned === 'kode_tagihan' || $cleaned === 'kode tagihan' || $cleaned === 'invoice_code' || $cleaned === 'invoice code') {
                        $headers['id_tagihan'] = $colIndex;
                    }
                    
                    if ($cleaned === 'id_order' || $cleaned === 'id order' || $cleaned === 'order_text' || $cleaned === 'order text') {
                        $headers['id_order'] = $colIndex;
                    }
                    
                    if ($cleaned === 'grand_total' || $cleaned === 'grand total' || $cleaned === 'total') {
                        $headers['grand_total'] = $colIndex;
                    }
                    
                    if ($cleaned === 'keterangan') {
                        $headers['keterangan'] = $colIndex;
                    }
                    
                    // Match items
                    for ($i = 1; $i <= 8; $i++) {
                        if ($cleaned === "item{$i}_desc") {
                            $headers["item{$i}_desc"] = $colIndex;
                        }
                        if ($cleaned === "item{$i}_vol") {
                            $headers["item{$i}_vol"] = $colIndex;
                        }
                        if ($cleaned === "item{$i}_harga") {
                            $headers["item{$i}_harga"] = $colIndex;
                        }
                        if ($cleaned === "item{$i}_sub" || $cleaned === "item{$i}_jumlah") {
                            $headers["item{$i}_sub"] = $colIndex;
                        }
                    }

                    // Match discounts
                    for ($i = 1; $i <= 2; $i++) {
                        if ($cleaned === "diskon{$i}_desc") {
                            $headers["diskon{$i}_desc"] = $colIndex;
                        }
                        if ($cleaned === "diskon{$i}_nom") {
                            $headers["diskon{$i}_nom"] = $colIndex;
                        }
                    }
                }

                // If we found (agent OR id_tagihan OR id_order) and grand_total, this is the header row
                if ((isset($headers['agent']) || isset($headers['id_tagihan']) || isset($headers['id_order'])) && isset($headers['grand_total'])) {
                    $firstRowIndex = $rowIndex;
                    break;
                }
            }

            if (!$firstRowIndex) {
                return back()->withErrors(['message' => 'Format kolom Excel tidak sesuai. Pastikan terdapat kolom "Nama Agen" atau "ID_TAGIHAN", serta kolom "GRAND_TOTAL".']);
            }

            $agents = User::where('role', 'agen')->get()->sortByDesc(function($a) {
                return strlen($a->name);
            });

            \Illuminate\Support\Facades\DB::beginTransaction();

            // Identify which packages / departures are being imported so we can clear only their old records
            $packageIdsToClear = [];
            $rawDeparturesToClear = [];
            $clearNullPackage = false;

            foreach ($rows as $rowIndex => $row) {
                if ($rowIndex <= $firstRowIndex) {
                    continue;
                }

                $idTagihan = isset($headers['id_tagihan']) ? trim($row[$headers['id_tagihan']]) : null;
                $idOrder = isset($headers['id_order']) ? trim($row[$headers['id_order']]) : null;
                $rowAgentName = isset($headers['agent']) ? trim($row[$headers['agent']]) : null;
                $rowDeparture = isset($headers['departure']) ? trim($row[$headers['departure']]) : null;
                $grandTotalVal = isset($headers['grand_total']) ? trim($row[$headers['grand_total']]) : 0;

                if (empty($idTagihan) && empty($idOrder) && empty($rowAgentName) && empty($grandTotalVal)) {
                    continue;
                }

                if (!empty($rowDeparture)) {
                    $cleanedDeparture = trim($rowDeparture);
                    $package = \App\Models\Package::where('code', $cleanedDeparture)->first();
                    if ($package) {
                        $packageIdsToClear[] = $package->id;
                    } else {
                        $parts = explode(',', $cleanedDeparture);
                        $pkgCode = trim($parts[1] ?? $parts[0] ?? '');
                        $packageFallback = \App\Models\Package::where('code', $pkgCode)->first();
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

            // Clear existing invoices only for the packages being imported
            if (!empty($packageIdsToClear) || !empty($rawDeparturesToClear) || $clearNullPackage) {
                Invoice::query()->where(function ($q) use ($packageIdsToClear, $rawDeparturesToClear, $clearNullPackage) {
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

            $importedCount = 0;

            foreach ($rows as $rowIndex => $row) {
                if ($rowIndex <= $firstRowIndex) {
                    continue;
                }

                $idTagihan = isset($headers['id_tagihan']) ? trim($row[$headers['id_tagihan']]) : null;
                $idOrder = isset($headers['id_order']) ? trim($row[$headers['id_order']]) : null;
                $rowAgentName = isset($headers['agent']) ? trim($row[$headers['agent']]) : null;
                $rowDeparture = isset($headers['departure']) ? trim($row[$headers['departure']]) : null;
                $grandTotalVal = isset($headers['grand_total']) ? trim($row[$headers['grand_total']]) : 0;
                $keteranganVal = isset($headers['keterangan']) ? trim($row[$headers['keterangan']]) : null;

                if (empty($idTagihan) && empty($idOrder) && empty($rowAgentName) && empty($grandTotalVal)) {
                    continue;
                }

                $grandTotal = floatval(preg_replace('/[^0-9.]/', '', str_replace(',', '.', $grandTotalVal)));

                // --- AGENT RESOLUTION ---
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
                    }
                } elseif (!empty($idOrder)) {
                    // Fallback to old agent resolution via idOrder string parsing
                    $agent = $this->findAgentForOrder($idOrder, $agents);
                    if ($agent) {
                        $agentId = $agent->id;
                    } else {
                        $rawAgentName = $this->extractRawAgentName($idOrder);
                    }
                }

                // --- PACKAGE RESOLUTION ---
                $packageId = null;
                $rawDeparture = null;

                if (!empty($rowDeparture)) {
                    $cleanedDeparture = trim($rowDeparture);
                    
                    // Match Package in Package model solely by code
                    $package = \App\Models\Package::where('code', $cleanedDeparture)->first();

                    if ($package) {
                        $packageId = $package->id;
                    } else {
                        // Try fallback if the cell has "date,code" format
                        $parts = explode(',', $cleanedDeparture);
                        $pkgCode = trim($parts[1] ?? $parts[0] ?? '');
                        
                        $packageFallback = \App\Models\Package::where('code', $pkgCode)->first();
                        if ($packageFallback) {
                            $packageId = $packageFallback->id;
                        } else {
                            $rawDeparture = $cleanedDeparture;
                        }
                    }
                }

                // --- INVOICE CODE GENERATION ---
                if (empty($idTagihan)) {
                    $agentPart = $agent ? strtoupper(substr(preg_replace('/[^a-zA-Z]/', '', $agent->name), 0, 3)) : 'INV';
                    $idTagihan = $agentPart . '-' . date('ymd') . '-' . strtoupper(\Illuminate\Support\Str::random(5));
                }

                // --- ORDER TEXT (for display compatibility) ---
                $orderText = $idOrder;
                if (empty($orderText)) {
                    $agentLabel = $agent ? $agent->name : ($rawAgentName ?? 'Pusat/Mandiri');
                    $departureLabel = $rowDeparture ?? '';
                    $orderText = trim($agentLabel . ' ' . $departureLabel);
                }

                // Parse items
                $items = [];
                for ($i = 1; $i <= 8; $i++) {
                    $descKey = "item{$i}_desc";
                    $volKey = "item{$i}_vol";
                    $hargaKey = "item{$i}_harga";
                    $subKey = "item{$i}_sub";

                    $desc = isset($headers[$descKey]) ? trim($row[$headers[$descKey]]) : null;
                    if (!empty($desc)) {
                        $volVal = isset($headers[$volKey]) ? trim($row[$headers[$volKey]]) : 0;
                        $hargaVal = isset($headers[$hargaKey]) ? trim($row[$headers[$hargaKey]]) : 0;
                        $subVal = isset($headers[$subKey]) ? trim($row[$headers[$subKey]]) : 0;

                        $vol = intval(preg_replace('/[^0-9]/', '', $volVal));
                        $harga = floatval(preg_replace('/[^0-9.]/', '', str_replace(',', '.', $hargaVal)));
                        $sub = floatval(preg_replace('/[^0-9.]/', '', str_replace(',', '.', $subVal)));

                        $items[] = [
                            'desc' => $desc,
                            'vol' => $vol,
                            'harga' => $harga,
                            'sub' => $sub,
                        ];
                    }
                }

                // Parse discounts
                $discounts = [];
                for ($i = 1; $i <= 2; $i++) {
                    $descKey = "diskon{$i}_desc";
                    $nomKey = "diskon{$i}_nom";

                    $desc = isset($headers[$descKey]) ? trim($row[$headers[$descKey]]) : null;
                    if (!empty($desc)) {
                        $nomVal = isset($headers[$nomKey]) ? trim($row[$headers[$nomKey]]) : 0;
                        $nom = floatval(preg_replace('/[^0-9.]/', '', str_replace(',', '.', $nomVal)));

                        $discounts[] = [
                            'desc' => $desc,
                            'nominal' => $nom,
                        ];
                    }
                }

                Invoice::create([
                    'invoice_code' => $idTagihan,
                    'agent_id' => $agentId,
                    'package_id' => $packageId,
                    'order_text' => $orderText,
                    'grand_total' => $grandTotal,
                    'keterangan' => $keteranganVal,
                    'items' => empty($items) ? null : $items,
                    'discounts' => empty($discounts) ? null : $discounts,
                    'raw_agent_name' => $rawAgentName,
                    'raw_departure_date_package' => $rawDeparture,
                ]);

                $importedCount++;
            }

            \Illuminate\Support\Facades\DB::commit();

            return back()->with('success', "Berhasil mengimpor {$importedCount} tagihan.");

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            return back()->withErrors(['message' => 'Gagal mengimpor file Excel: ' . $e->getMessage()]);
        }
    }

    private function findAgentForOrder($idOrder, $agents)
    {
        if (empty($idOrder)) return null;

        $idOrderClean = preg_replace('/[^a-z0-9]/', '', strtolower($idOrder));

        foreach ($agents as $agent) {
            $agentNameClean = preg_replace('/[^a-z0-9]/', '', strtolower($agent->name));
            if (!empty($agentNameClean) && str_contains($idOrderClean, $agentNameClean)) {
                return $agent;
            }
        }

        foreach ($agents as $agent) {
            $agentName = strtolower(trim($agent->name));
            if (str_contains(strtolower($idOrder), $agentName)) {
                return $agent;
            }
        }

        return null;
    }

    private function extractRawAgentName($idOrder)
    {
        if (empty($idOrder)) return null;

        if (preg_match('/^(.*?)\b\d{4}-\d{2}-\d{2}\b/i', $idOrder, $matches)) {
            return trim($matches[1]);
        }
        if (preg_match('/^(.*?)\b\d{2}-\d{2}-\d{4}\b/i', $idOrder, $matches)) {
            return trim($matches[1]);
        }

        return substr($idOrder, 0, 50);
    }
}
