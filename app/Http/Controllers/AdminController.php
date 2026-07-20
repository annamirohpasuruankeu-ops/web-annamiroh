<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Package;
use App\Models\Booking;
use App\Models\Order;
use App\Models\PopupPromo;
use App\Models\Gallery;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller
{
    public function index(Request $request)
    {
        // Simple role check (Pusat can view, Admin can manage)
        if ($request->user()->role !== 'admin' && $request->user()->role !== 'pusat') {
            abort(403, 'Unauthorized access.');
        }

        $search = $request->input('search');
        $status = $request->input('status'); // all, full, warning, available
        $sortBy = $request->input('sort_by', 'departure_date_asc'); // departure_date_asc, departure_date_desc, available_seats_asc, available_seats_desc, percentage_desc, percentage_asc

        $query = Package::where('is_active', true)->where(function ($q) {
            $q->where('code', '!=', 'BELUM_ATUR_JADWAL')->orWhereNull('code');
        });

        // Apply Search
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        // Apply Status Filter
        if ($status === 'full') {
            $query->where('available_seats', 0);
        } elseif ($status === 'warning') {
            $query->where('available_seats', '>', 0)->where('available_seats', '<=', 5);
        } elseif ($status === 'available') {
            $query->where('available_seats', '>', 5);
        }

        // Add bookings count
        $query->withCount('bookings');

        // Apply Sorting
        if ($sortBy === 'departure_date_asc') {
            $query->orderBy('departure_date', 'asc');
        } elseif ($sortBy === 'departure_date_desc') {
            $query->orderBy('departure_date', 'desc');
        } elseif ($sortBy === 'available_seats_asc') {
            $query->orderBy('available_seats', 'asc');
        } elseif ($sortBy === 'available_seats_desc') {
            $query->orderBy('available_seats', 'desc');
        } elseif ($sortBy === 'percentage_desc') {
            $query->orderByRaw('(total_seats - available_seats) / total_seats DESC');
        } elseif ($sortBy === 'percentage_asc') {
            $query->orderByRaw('(total_seats - available_seats) / total_seats ASC');
        }

        // Calculate summary metrics on all active packages (excluding BELUM_ATUR_JADWAL placeholder)
        $allActivePackages = Package::where('is_active', true)->where(function ($q) {
            $q->where('code', '!=', 'BELUM_ATUR_JADWAL')->orWhereNull('code');
        })->get();
        $totalActiveCount = $allActivePackages->count();
        $totalSeats = $allActivePackages->sum('total_seats');
        $availableSeats = $allActivePackages->sum('available_seats');
        $bookedSeats = $totalSeats - $availableSeats;

        $totalJamaah = \App\Models\JamaahMember::count();
        $totalAgents = User::where('role', 'agen')->count();

        // Paginate active packages (15 per page)
        $packages = $query->paginate(15)->withQueryString();

        return Inertia::render('admin/index', [
            'packages' => $packages,
            'summary' => [
                'total_active' => $totalActiveCount,
                'total_seats' => $totalSeats,
                'booked_seats' => $bookedSeats,
                'available_seats' => $availableSeats,
                'total_jamaah' => $totalJamaah,
                'total_agents' => $totalAgents,
            ],
            'filters' => [
                'search' => $search,
                'status' => $status,
                'sort_by' => $sortBy,
            ],
            'userRole' => $request->user()->role,
        ]);
    }

    public function packages(Request $request)
    {
        $role = $request->user()->role;
        if (!in_array($role, ['admin', 'pusat', 'agen']))
            abort(403);
        $search = $request->input('search');

        $query = Package::withCount('bookings')->orderBy('created_at', 'desc');

        if ($role === 'agen') {
            $query->where('is_active', true);
        }

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }
        return Inertia::render('admin/packages', [
            'packages' => $query->paginate(10)->withQueryString(),
            'filters' => ['search' => $search],
            'userRole' => $role
        ]);
    }

    public function jamaah(Request $request)
    {
        $role = $request->user()->role;
        if (!in_array($role, ['admin', 'pusat', 'agen'])) {
            abort(403);
        }

        $search = $request->input('search');
        $packageId = $request->input('package_id');
        $agentId = $request->input('agent_id');

        $query = \App\Models\JamaahMember::whereHas('bookings')
            ->with(['user.agent', 'bookings.package'])
            ->orderBy('created_at', 'desc');

        if ($role === 'agen') {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('agent_id', $request->user()->id)
                    ->orWhere('id', $request->user()->id);
            });
        } elseif ($agentId && in_array($role, ['admin', 'pusat'])) {
            $query->whereHas('user', function ($q) use ($agentId) {
                $q->where('agent_id', $agentId)
                    ->orWhere('id', $agentId);
            });
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('nomor_paspor', 'like', "%{$search}%")
                    ->orWhere('tempat_lahir', 'like', "%{$search}%");
            });
        }

        if ($packageId) {
            $query->whereHas('bookings', function ($q) use ($packageId) {
                $q->where('package_id', $packageId);
            });
        }

        // Calculate statistics for manifest
        if ($role === 'agen') {
            $totalJamaahCount = \App\Models\JamaahMember::whereHas('user', function ($q) use ($request) {
                $q->where('agent_id', $request->user()->id)
                    ->orWhere('id', $request->user()->id);
            })->whereHas('bookings')->count();

            $passportFilledCount = \App\Models\JamaahMember::whereHas('user', function ($q) use ($request) {
                $q->where('agent_id', $request->user()->id)
                    ->orWhere('id', $request->user()->id);
            })->whereHas('bookings')->whereNotNull('nomor_paspor')->where('nomor_paspor', '!=', '')->count();
        } else {
            $totalJamaahCount = \App\Models\JamaahMember::whereHas('bookings')->count();
            $passportFilledCount = \App\Models\JamaahMember::whereHas('bookings')->whereNotNull('nomor_paspor')->where('nomor_paspor', '!=', '')->count();
        }

        $activePackages = Package::withCount('bookings')->where('is_active', true)->get();

        $agents = [];
        if (in_array($role, ['admin', 'pusat'])) {
            $agents = User::where('role', 'agen')->orderBy('name')->get(['id', 'name']);
        }

        return Inertia::render('admin/jamaah', [
            'jamaahs' => $query->paginate(10)->withQueryString(),
            'packages' => Package::where('available_seats', '>', 0)->get(),
            'activePackages' => $activePackages,
            'agents' => $agents,
            'totalJamaahCount' => $totalJamaahCount,
            'passportFilledCount' => $passportFilledCount,
            'filters' => [
                'search' => $search,
                'package_id' => $packageId,
                'agent_id' => $agentId,
            ]
        ]);
    }

    public function exportJamaah(Request $request)
    {
        $role = $request->user()->role;
        if (!in_array($role, ['admin', 'pusat', 'agen'])) {
            abort(403);
        }

        $search = $request->input('search');
        $packageId = $request->input('package_id');
        $agentId = $request->input('agent_id');

        $query = \App\Models\JamaahMember::whereHas('bookings')
            ->with(['user.agent', 'bookings.package'])
            ->orderBy('created_at', 'desc');

        if ($role === 'agen') {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('agent_id', $request->user()->id)
                    ->orWhere('id', $request->user()->id);
            });
        } elseif ($agentId && in_array($role, ['admin', 'pusat'])) {
            $query->whereHas('user', function ($q) use ($agentId) {
                $q->where('agent_id', $agentId)
                    ->orWhere('id', $agentId);
            });
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('nomor_paspor', 'like', "%{$search}%")
                    ->orWhere('tempat_lahir', 'like', "%{$search}%");
            });
        }

        if ($packageId) {
            $query->whereHas('bookings', function ($q) use ($packageId) {
                $q->where('package_id', $packageId);
            });
        }

        $records = $query->get();

        $mapped = $records->map(function ($item) {
            $agentName = 'Pusat/Mandiri';
            if ($item->user) {
                if ($item->user->role === 'agen') {
                    $agentName = $item->user->name;
                } elseif ($item->user->agent) {
                    $agentName = $item->user->agent->name;
                }
            }

            $packageName = $item->bookings->first()?->package?->name ?: 'Belum Assign';

            $item->computed_agent_name = $agentName;
            $item->computed_package_name = $packageName;

            return $item;
        });

        $sorted = $mapped->sortBy(function ($item) {
            return [
                $item->computed_package_name,
                $item->computed_agent_name,
                $item->name
            ];
        });

        $html = '<html xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:x="urn:schemas-microsoft-com:office:excel"
xmlns="http://www.w3.org/TR/REC-html40">
<head>
    <meta http-equiv="Content-type" content="text/html;charset=utf-8" />
    <style>
        table {
            border-collapse: collapse;
            font-family: Arial, sans-serif;
            font-size: 11px;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
            text-align: center;
            border: 1px solid #000000;
            padding: 5px;
        }
        td {
            border: 1px solid #000000;
            padding: 5px;
            vertical-align: middle;
        }
        .text-center {
            text-align: center;
        }
        .link {
            color: #0000FF;
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Tanggal Keberangkatan</th>
                <th>Nama Agen (Urut)</th>
                <th>Nama Lengkap</th>
                <th>Sex</th>
                <th>Age</th>
                <th>Place</th>
                <th>Date Birth</th>
                <th>No Paspor</th>
                <th>Issued</th>
                <th>Expired</th>
                <th>Office</th>
                <th>PP</th>
                <th>VM</th>
                <th>VP</th>
                <th>Link Paspor</th>
                <th>Link Vaksin</th>
            </tr>
        </thead>
        <tbody>';

        $no = 1;
        $agentCounters = [];
        foreach ($sorted as $item) {
            $agentName = $item->computed_agent_name;
            $agentCounters[$agentName] = ($agentCounters[$agentName] ?? 0) + 1;
            $agentNameWithOrder = $agentName . ' (' . $agentCounters[$agentName] . ')';

            $age = '';
            if ($item->tgl_lahir) {
                try {
                    $age = (new \DateTime($item->tgl_lahir))->diff(new \DateTime())->y;
                } catch (\Exception $e) {
                }
            }

            $sex = $item->jenis_kelamin === 'Laki-laki' ? 'L' : ($item->jenis_kelamin === 'Perempuan' ? 'P' : '-');

            $dateBirth = $item->tgl_lahir ? date('d/m/Y', strtotime($item->tgl_lahir)) : '';
            $issued = $item->paspor_issued ? date('d/m/Y', strtotime($item->paspor_issued)) : '';
            $expired = $item->paspor_expiry ? date('d/m/Y', strtotime($item->paspor_expiry)) : '';

            $pasporLink = $item->paspor_file ? '<a href="' . asset('storage-file/' . $item->paspor_file) . '" class="link">Link Paspor</a>' : '-';
            $vaksinLink = $item->vaksin_file ? '<a href="' . asset('storage-file/' . $item->vaksin_file) . '" class="link">Link Vaksin</a>' : '-';

            $html .= '<tr>
                <td class="text-center">' . $no++ . '</td>
                <td>' . htmlspecialchars($item->computed_package_name) . '</td>
                <td>' . htmlspecialchars($agentNameWithOrder) . '</td>
                <td>' . htmlspecialchars($item->name) . '</td>
                <td class="text-center">' . htmlspecialchars($sex) . '</td>
                <td class="text-center">' . htmlspecialchars($age) . '</td>
                <td>' . htmlspecialchars($item->tempat_lahir ?: '') . '</td>
                <td class="text-center">' . htmlspecialchars($dateBirth) . '</td>
                <td>' . htmlspecialchars($item->nomor_paspor ?: '') . '</td>
                <td class="text-center">' . htmlspecialchars($issued) . '</td>
                <td class="text-center">' . htmlspecialchars($expired) . '</td>
                <td>' . htmlspecialchars($item->paspor_office ?: '') . '</td>
                <td class="text-center">' . htmlspecialchars($item->pp ?: '-') . '</td>
                <td class="text-center">' . htmlspecialchars($item->vm ?: '-') . '</td>
                <td class="text-center">' . htmlspecialchars($item->vp ?: '-') . '</td>
                <td class="text-center">' . $pasporLink . '</td>
                <td class="text-center">' . $vaksinLink . '</td>
            </tr>';
        }

        $html .= '</tbody>
    </table>
</body>
</html>';

        $filename = "manifest_keberangkatan_" . date('Ymd_His') . ".xls";

        return response($html)
            ->header('Content-Type', 'application/vnd.ms-excel')
            ->header('Content-Disposition', "attachment; filename=\"{$filename}\"")
            ->header('Pragma', 'no-cache')
            ->header('Expires', '0');
    }

    public function jamaahDatabase(Request $request)
    {
        $role = $request->user()->role;
        if (!in_array($role, ['admin', 'pusat', 'agen'])) {
            abort(403);
        }

        $search = $request->input('search');

        $query = \App\Models\JamaahMember::with(['user.agent'])
            ->orderBy('created_at', 'desc');

        if ($role === 'agen') {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('agent_id', $request->user()->id)
                    ->orWhere('id', $request->user()->id);
            });
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('nomor_paspor', 'like', "%{$search}%")
                    ->orWhere('tempat_lahir', 'like', "%{$search}%");
            });
        }

        // Calculate statistics for entire database
        if ($role === 'agen') {
            $totalJamaahCount = \App\Models\JamaahMember::whereHas('user', function ($q) use ($request) {
                $q->where('agent_id', $request->user()->id)
                    ->orWhere('id', $request->user()->id);
            })->count();

            $passportFilledCount = \App\Models\JamaahMember::whereHas('user', function ($q) use ($request) {
                $q->where('agent_id', $request->user()->id)
                    ->orWhere('id', $request->user()->id);
            })->whereNotNull('nomor_paspor')->where('nomor_paspor', '!=', '')->count();
        } else {
            $totalJamaahCount = \App\Models\JamaahMember::count();
            $passportFilledCount = \App\Models\JamaahMember::whereNotNull('nomor_paspor')->where('nomor_paspor', '!=', '')->count();
        }

        return Inertia::render('admin/jamaah-database', [
            'jamaahs' => $query->paginate(10)->withQueryString(),
            'totalJamaahCount' => $totalJamaahCount,
            'passportFilledCount' => $passportFilledCount,
            'filters' => [
                'search' => $search,
            ]
        ]);
    }

    public function manageMembers(Request $request, $id)
    {
        $role = $request->user()->role;
        if (!in_array($role, ['admin', 'agen']))
            abort(403);

        $jamaah = User::with('profile', 'jamaahMembers', 'bookings.package', 'bookings.jamaahMember')->findOrFail($id);

        if ($role === 'agen' && $jamaah->agent_id !== $request->user()->id) {
            abort(403, 'Unauthorized.');
        }

        return Inertia::render('admin/jamaah-members', [
            'jamaah' => $jamaah,
        ]);
    }

    public function bookings(Request $request)
    {
        $role = $request->user()->role;
        if (!in_array($role, ['admin', 'pusat', 'agen']))
            abort(403);

        $search = $request->input('search');
        $packageId = $request->input('package_id');

        $query = Booking::with('user', 'package', 'jamaahMember')->orderBy('created_at', 'desc');

        // If user is agent, only get their own jamaah's bookings
        if ($role === 'agen') {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('agent_id', $request->user()->id)
                    ->orWhere('id', $request->user()->id);
            });
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($uq) use ($search) {
                    $uq->where('name', 'like', "%{$search}%");
                })->orWhereHas('package', function ($pq) use ($search) {
                    $pq->where('name', 'like', "%{$search}%");
                })->orWhereHas('jamaahMember', function ($mq) use ($search) {
                    $mq->where('name', 'like', "%{$search}%");
                });
            });
        }

        if ($packageId) {
            $query->where('package_id', $packageId);
        }

        // Fetch active packages and count bookings (scoped to agent if applicable)
        if ($role === 'agen') {
            $activePackages = Package::withCount([
                'bookings' => function ($q) use ($request) {
                    $q->whereHas('user', function ($uq) use ($request) {
                        $uq->where('agent_id', $request->user()->id)
                            ->orWhere('id', $request->user()->id);
                    });
                }
            ])->where('is_active', true)->get();
        } else {
            $activePackages = Package::withCount('bookings')->where('is_active', true)->get();
        }

        return Inertia::render('admin/bookings', [
            'bookings' => $query->paginate(10)->withQueryString(),
            'activePackages' => $activePackages,
            'filters' => [
                'search' => $search,
                'package_id' => $packageId,
            ]
        ]);
    }

    public function updateBooking(Request $request, $id)
    {
        if ($request->user()->role !== 'admin' && $request->user()->role !== 'pusat')
            abort(403);

        $booking = Booking::with('package', 'user.profile', 'jamaahMember', 'user.jamaahMembers')->findOrFail($id);

        $validated = $request->validate([
            'amount_paid' => 'nullable|numeric|min:0',
            'bukti_pembayaran' => 'nullable|file|max:2048|mimes:jpg,jpeg,png,pdf'
        ]);

        $amountPaid = $validated['amount_paid'] ?? 0;

        $statusPembayaran = 'pending';
        if ($amountPaid > 0) {
            $statusPembayaran = $amountPaid >= $booking->package->price ? 'lunas' : 'dp';
        }

        $member = $booking->jamaahMember ?: ($booking->user ? $booking->user->jamaahMembers()->first() : null);
        $statusDokumen = ($member && $member->ktp_file && $member->kk_file && $member->paspor_file && $member->vaksin_file) ? 'lengkap' : 'belum_lengkap';

        $updateData = [
            'status_pembayaran' => $statusPembayaran,
            'status_dokumen' => $statusDokumen,
            'amount_paid' => $amountPaid,
        ];

        if ($request->hasFile('bukti_pembayaran')) {
            if ($booking->bukti_pembayaran) {
                Storage::disk('public')->delete($booking->bukti_pembayaran);
            }
            $path = $request->file('bukti_pembayaran')->store('bukti_pembayaran', 'public');
            $updateData['bukti_pembayaran'] = $path;
        }

        $booking->update($updateData);

        return back()->with('success', 'Transaksi berhasil diperbarui dan status otomatis disesuaikan.');
    }

    public function assignJamaah(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            abort(403, 'Only admins can assign jamaah.');
        }

        $request->validate([
            'user_id' => 'required|exists:users,id',
            'package_id' => 'required|exists:packages,id',
            'jamaah_member_ids' => 'nullable|array',
            'jamaah_member_ids.*' => 'exists:jamaah_members,id',
        ]);

        $package = Package::findOrFail($request->package_id);

        if ($package->available_seats <= 0) {
            return back()->withErrors(['message' => 'Paket sudah penuh. Tidak ada seat tersisa.']);
        }

        $user = User::with('jamaahMembers')->findOrFail($request->user_id);

        if ($user->jamaahMembers->isEmpty()) {
            return back()->withErrors(['message' => 'Jamaah tidak memiliki anggota keluarga/data pribadi.']);
        }

        $memberIdsToAssign = $request->input('jamaah_member_ids');
        if (empty($memberIdsToAssign)) {
            $members = $user->jamaahMembers;
        } else {
            $members = $user->jamaahMembers->filter(function ($m) use ($memberIdsToAssign) {
                return in_array($m->id, $memberIdsToAssign);
            });
        }

        if ($members->isEmpty()) {
            return back()->withErrors(['message' => 'Silakan pilih minimal satu anggota rombongan untuk didaftarkan.']);
        }

        $assignedCount = 0;
        foreach ($members as $member) {
            $exists = Booking::where('user_id', $user->id)
                ->where('jamaah_member_id', $member->id)
                ->where('package_id', $request->package_id)
                ->exists();

            if (!$exists) {
                $statusDokumen = ($member->ktp_file && $member->kk_file && $member->paspor_file && $member->vaksin_file) ? 'lengkap' : 'belum_lengkap';
                Booking::create([
                    'user_id' => $request->user_id,
                    'jamaah_member_id' => $member->id,
                    'package_id' => $request->package_id,
                    'status_pembayaran' => 'pending',
                    'status_dokumen' => $statusDokumen
                ]);
                $assignedCount++;
            }
        }

        if ($assignedCount === 0) {
            return back()->withErrors(['message' => 'Seluruh anggota rombongan yang dipilih sudah terdaftar di paket ini.']);
        }

        return back()->with('success', "Berhasil memasukkan {$assignedCount} anggota jamaah ke paket.");
    }

    public function agents(Request $request)
    {
        if ($request->user()->role !== 'admin' && $request->user()->role !== 'pusat')
            abort(403);

        $search = $request->input('search');
        $query = User::with('profile')->withCount('agentJamaahMembers as jamaah_count')->where('role', 'agen')->orderBy('created_at', 'desc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('agent_code', 'like', "%{$search}%")
                    ->orWhereHas('profile', function ($q) use ($search) {
                        $q->where('no_wa', 'like', "%{$search}%");
                    });
            });
        }

        return Inertia::render('admin/agents', [
            'agents' => $query->paginate(10)->withQueryString(),
            'filters' => ['search' => $search]
        ]);
    }

    public function storeAgent(Request $request)
    {
        if ($request->user()->role !== 'admin')
            abort(403);
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'no_wa' => 'required|string',
            'alamat' => 'required|string',
            'agent_code' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => \Illuminate\Support\Facades\Hash::make($validated['password']),
            'role' => 'agen',
            'agent_code' => $validated['agent_code'] ?? null,
        ]);

        $user->profile()->create([
            'no_wa' => $validated['no_wa'],
            'alamat' => $validated['alamat'],
        ]);

        return back()->with('success', 'Agen berhasil ditambahkan.');
    }

    public function importAgents(Request $request)
    {
        if ($request->user()->role !== 'admin')
            abort(403);

        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv'
        ]);

        $file = $request->file('file');
        $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($file->getRealPath());
        $sheet = $spreadsheet->getActiveSheet();
        $highestRow = $sheet->getHighestRow();

        $imported = 0;
        $skipped = 0;

        for ($rowNum = 2; $rowNum <= $highestRow; $rowNum++) {
            $idAgen = trim($sheet->getCell("A{$rowNum}")->getFormattedValue());
            $namaAgen = trim($sheet->getCell("B{$rowNum}")->getFormattedValue());
            $alamat = trim($sheet->getCell("C{$rowNum}")->getFormattedValue());
            $noHpRaw = trim($sheet->getCell("D{$rowNum}")->getFormattedValue());

            if (empty($namaAgen)) {
                $skipped++;
                continue;
            }

            // Normalize phone number (strip non-digits)
            $noHp = preg_replace('/[^0-9]/', '', $noHpRaw);

            // Normalize Indonesian mobile number prefix (strip country code prefix or replace 8xxx with 08xxx)
            if (strlen($noHp) >= 9 && strlen($noHp) <= 13) {
                if (str_starts_with($noHp, '8')) {
                    $noHp = '0' . $noHp;
                } elseif (str_starts_with($noHp, '628')) {
                    $noHp = '0' . substr($noHp, 2);
                }
            }

            if (empty($noHp)) {
                $skipped++;
                continue;
            }

            // Generate email based on ID_AGEN or phone number
            $email = strtolower($idAgen ?: $noHp) . '@annamirah.com';

            // Check if email already exists, or user with this no_wa already exists
            $existingUser = User::where('email', $email)
                ->orWhereHas('profile', function ($q) use ($noHp) {
                    $q->where('no_wa', $noHp);
                })
                ->first();

            if ($existingUser) {
                $existingUser->update([
                    'name' => $namaAgen,
                    'agent_code' => $idAgen ?: $existingUser->agent_code,
                ]);
                $existingUser->profile()->updateOrCreate(
                    ['user_id' => $existingUser->id],
                    [
                        'no_wa' => $noHp,
                        'alamat' => $alamat
                    ]
                );
                $imported++;
                continue;
            }

            // Create new agent user
            // Set password to the bcrypt hash of NO_HP (which they will use to login)
            $user = User::create([
                'name' => $namaAgen,
                'email' => $email,
                'password' => \Illuminate\Support\Facades\Hash::make($noHp),
                'role' => 'agen',
                'agent_code' => $idAgen,
                'is_active' => true,
            ]);

            $user->profile()->create([
                'no_wa' => $noHp,
                'alamat' => $alamat,
            ]);

            $imported++;
        }

        return back()->with('success', "Berhasil mengimpor {$imported} agen. {$skipped} baris dilewati.");
    }

    public function updateAgent(Request $request, $id)
    {
        if ($request->user()->role !== 'admin')
            abort(403);
        $agent = User::where('role', 'agen')->findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email,' . $agent->id,
            'password' => 'nullable|string|min:8',
            'no_wa' => 'required|string',
            'alamat' => 'required|string',
            'agent_code' => 'nullable|string',
        ]);

        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'agent_code' => $validated['agent_code'] ?? null,
        ];

        if (!empty($validated['password'])) {
            $data['password'] = \Illuminate\Support\Facades\Hash::make($validated['password']);
        }

        $agent->update($data);

        $agent->profile()->updateOrCreate(
            ['user_id' => $agent->id],
            [
                'no_wa' => $validated['no_wa'],
                'alamat' => $validated['alamat']
            ]
        );

        return back()->with('success', 'Data Agen berhasil diperbarui.');
    }

    public function removeJamaah(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            abort(403, 'Only admins can remove jamaah.');
        }

        $booking = Booking::findOrFail($id);
        $booking->delete();

        return back()->with('success', 'Jamaah berhasil dihapus dari paket dan seat dikembalikan.');
    }

    public function storePackage(Request $request)
    {
        if ($request->user()->role !== 'admin')
            abort(403);
        $validated = $request->validate([
            'name' => 'required|string',
            'code' => 'nullable|string|max:50',
            'program_days' => 'required|integer',
            'departure_date' => 'required|date',
            'airline' => 'required|string',
            'airline_route' => 'nullable|string|max:255',
            'price' => 'required|numeric',
            'harga_agen' => 'required|numeric',
            'hotel_makkah' => 'required|string',
            'hotel_madinah' => 'required|string',
            'total_seats' => 'required|integer',
            'free_items' => 'nullable|string',
            'includes' => 'nullable|string',
            'excludes' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'is_active' => 'boolean',
            'is_best_seller' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('packages', 'public');
        }

        $validated['available_seats'] = $validated['total_seats'];
        $validated['is_active'] = $request->input('is_active', true);
        $validated['is_best_seller'] = $request->input('is_best_seller', false);
        Package::create($validated);
        return back()->with('success', 'Paket berhasil ditambahkan.');
    }

    public function updatePackage(Request $request, $id)
    {
        if ($request->user()->role !== 'admin')
            abort(403);
        $package = Package::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string',
            'code' => 'nullable|string|max:50',
            'program_days' => 'required|integer',
            'departure_date' => 'required|date',
            'airline' => 'required|string',
            'airline_route' => 'nullable|string|max:255',
            'price' => 'required|numeric',
            'harga_agen' => 'required|numeric',
            'hotel_makkah' => 'required|string',
            'hotel_madinah' => 'required|string',
            'total_seats' => 'required|integer',
            'free_items' => 'nullable|string',
            'includes' => 'nullable|string',
            'excludes' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'is_active' => 'boolean',
            'is_best_seller' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($package->image) {
                Storage::disk('public')->delete($package->image);
            }
            $validated['image'] = $request->file('image')->store('packages', 'public');
        } else {
            unset($validated['image']);
        }

        $validated['is_active'] = $request->input('is_active', true);
        $validated['is_best_seller'] = $request->input('is_best_seller', false);

        $diff = $validated['total_seats'] - $package->total_seats;
        $validated['available_seats'] = $package->available_seats + $diff;

        $package->update($validated);
        return back()->with('success', 'Paket berhasil diperbarui.');
    }

    public function storeJamaah(Request $request)
    {
        $role = $request->user()->role;
        if (!in_array($role, ['admin', 'agen']))
            abort(403);

        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'no_wa' => 'required|string',
            'alamat' => 'required|string',
            'nik' => 'nullable|string',
            'jenis_kelamin' => 'required|string',
            'hubungan_keluarga' => 'required|string',
            'tempat_lahir' => 'required|string',
            'tgl_lahir' => 'required|date',
            'package_id' => 'nullable|exists:packages,id',
            'ktp_file' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'kk_file' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'paspor_file' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'vaksin_file' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => \Illuminate\Support\Facades\Hash::make('12345678'), // Default pass
            'role' => 'user',
            'agent_id' => $role === 'agen' ? $request->user()->id : null,
        ]);

        $user->profile()->create([
            'no_wa' => $validated['no_wa'],
            'tempat_lahir' => $validated['tempat_lahir'],
            'tgl_lahir' => $validated['tgl_lahir'],
            'alamat' => $validated['alamat'],
        ]);

        $memberData = [
            'name' => $validated['name'],
            'nik' => $validated['nik'],
            'jenis_kelamin' => $validated['jenis_kelamin'],
            'hubungan_keluarga' => $validated['hubungan_keluarga'],
            'tempat_lahir' => $validated['tempat_lahir'],
            'tgl_lahir' => $validated['tgl_lahir'],
            'email' => $validated['email'],
            'nohp' => $validated['no_wa'],
        ];

        // Handle file uploads
        if ($request->hasFile('ktp_file')) {
            $memberData['ktp_file'] = $request->file('ktp_file')->store('documents', 'public');
        }
        if ($request->hasFile('kk_file')) {
            $memberData['kk_file'] = $request->file('kk_file')->store('documents', 'public');
        }
        if ($request->hasFile('paspor_file')) {
            $memberData['paspor_file'] = $request->file('paspor_file')->store('documents', 'public');
        }
        if ($request->hasFile('vaksin_file')) {
            $memberData['vaksin_file'] = $request->file('vaksin_file')->store('documents', 'public');
        }

        $member = $user->jamaahMembers()->create($memberData);

        if (!empty($validated['package_id'])) {
            $statusDokumen = (isset($memberData['ktp_file']) && isset($memberData['kk_file']) && isset($memberData['paspor_file']) && isset($memberData['vaksin_file'])) ? 'lengkap' : 'belum_lengkap';
            Booking::create([
                'user_id' => $user->id,
                'jamaah_member_id' => $member->id,
                'package_id' => $validated['package_id'],
                'status_pembayaran' => 'pending',
                'status_dokumen' => $statusDokumen
            ]);
        }

        return back()->with('success', 'Jamaah berhasil didaftarkan. Password default: 12345678');
    }

    public function updateJamaah(Request $request, $id)
    {
        $role = $request->user()->role;
        if (!in_array($role, ['admin', 'agen']))
            abort(403);

        $member = \App\Models\JamaahMember::findOrFail($id);

        if ($role === 'agen' && $member->user?->agent_id !== $request->user()->id) {
            abort(403, 'Unauthorized.');
        }

        $validated = $request->validate([
            'name' => 'required|string',
            'jenis_kelamin' => 'required|string',
            'tempat_lahir' => 'nullable|string',
            'tgl_lahir' => 'nullable|date',
            'nomor_paspor' => 'nullable|string',
            'paspor_issued' => 'nullable|date',
            'paspor_expiry' => 'nullable|date',
            'paspor_office' => 'nullable|string',
            'pp' => 'nullable|string',
            'vm' => 'nullable|string',
            'vp' => 'nullable|string',
            'email' => 'nullable|email',
            'nohp' => 'nullable|string',
            'paspor_file' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'vaksin_file' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'ktp_file' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'kk_file' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        $memberData = array_diff_key($validated, array_flip(['paspor_file', 'vaksin_file', 'ktp_file', 'kk_file']));

        $member->update($memberData);

        if ($request->hasFile('paspor_file')) {
            $member->update([
                'paspor_file' => $request->file('paspor_file')->store('documents', 'public')
            ]);
        }
        if ($request->hasFile('vaksin_file')) {
            $member->update([
                'vaksin_file' => $request->file('vaksin_file')->store('documents', 'public')
            ]);
        }
        if ($request->hasFile('ktp_file')) {
            $member->update([
                'ktp_file' => $request->file('ktp_file')->store('documents', 'public')
            ]);
        }
        if ($request->hasFile('kk_file')) {
            $member->update([
                'kk_file' => $request->file('kk_file')->store('documents', 'public')
            ]);
        }

        // Auto-update booking status_dokumen if applicable
        $booking = $member->bookings()->first();
        if ($booking) {
            $statusDokumen = ($member->ktp_file && $member->kk_file && $member->paspor_file && $member->vaksin_file) ? 'lengkap' : 'belum_lengkap';
            $booking->update(['status_dokumen' => $statusDokumen]);
        }

        return back()->with('success', 'Data Jamaah berhasil diperbarui.');
    }

    public function storeMember(Request $request, $userId)
    {
        $role = $request->user()->role;
        if (!in_array($role, ['admin', 'agen']))
            abort(403);

        $jamaah = User::findOrFail($userId);

        $validated = $request->validate([
            'name' => 'required|string',
            'nik' => 'nullable|string',
            'jenis_kelamin' => 'required|in:Laki-laki,Perempuan',
            'hubungan_keluarga' => 'required|string',
            'tempat_lahir' => 'required|string',
            'tgl_lahir' => 'required|date',
        ]);

        $member = $jamaah->jamaahMembers()->create($validated);

        // Auto-book the new family member if the main user is already booked
        $activeBooking = Booking::where('user_id', $userId)->first();
        if ($activeBooking) {
            Booking::create([
                'user_id' => $userId,
                'jamaah_member_id' => $member->id,
                'package_id' => $activeBooking->package_id,
                'status_pembayaran' => 'pending',
                'status_dokumen' => 'belum_lengkap'
            ]);
        }

        return back()->with('success', 'Anggota rombongan berhasil ditambahkan.');
    }

    public function uploadMemberDocument(Request $request, $memberId)
    {
        $role = $request->user()->role;
        if (!in_array($role, ['admin', 'agen']))
            abort(403);

        $request->validate([
            'document_type' => 'required|in:paspor,ktp,kk,vaksin',
            'file' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        $member = \App\Models\JamaahMember::findOrFail($memberId);

        $type = $request->document_type;
        $field = $type . '_file';

        $path = $request->file('file')->store('documents', 'public');

        $member->update([
            $field => $path,
        ]);

        return back()->with('success', 'Dokumen anggota berhasil diunggah.');
    }

    public function toggleUserStatus(Request $request, $id)
    {
        $role = $request->user()->role;
        if (!in_array($role, ['admin', 'pusat']))
            abort(403);

        $user = User::findOrFail($id);

        // Prevent toggling admin/pusat accounts
        if (in_array($user->role, ['admin', 'pusat'])) {
            return back()->withErrors(['message' => 'Tidak dapat mengubah status akun admin/pusat.']);
        }

        $user->update(['is_active' => !$user->is_active]);

        $status = $user->is_active ? 'diaktifkan' : 'dinonaktifkan';
        return back()->with('success', "Akun {$user->name} berhasil {$status}.");
    }

    public function toggleBookingSeat(Request $request, $id)
    {
        $role = $request->user()->role;
        if (!in_array($role, ['admin', 'pusat']))
            abort(403);

        $booking = Booking::with('package')->findOrFail($id);

        // If they want to reduce the seat, make sure available_seats is > 0
        if (!$booking->is_seat_reduced && $booking->package->available_seats <= 0) {
            return back()->withErrors(['message' => 'Gagal mengurangi seat: Paket sudah penuh.']);
        }

        $booking->update([
            'is_seat_reduced' => !$booking->is_seat_reduced
        ]);

        $status = $booking->is_seat_reduced ? 'dikurangi' : 'dikembalikan';
        return back()->with('success', "Seat paket untuk transaksi ini berhasil {$status}.");
    }

    public function invoice(Request $request, $id)
    {
        $role = $request->user()->role;
        if (!in_array($role, ['admin', 'pusat', 'agen'])) {
            abort(403);
        }

        $booking = Booking::with(['user.profile', 'package', 'jamaahMember'])->findOrFail($id);

        if ($role === 'agen' && $booking->user->agent_id !== $request->user()->id) {
            abort(403, 'Unauthorized.');
        }

        return Inertia::render('admin/invoice', [
            'booking' => $booking
        ]);
    }

   public function registrationForm(Request $request, $id)
{
    // 1. Ambil data booking beserta relasinya
    $booking = Booking::with(['user.profile', 'package', 'jamaahMember'])->findOrFail($id);
    $role = $request->user()->role;

    // 2. Jika bukan admin/pusat, kita cek apakah ini milik agen tersebut
    if ($role === 'agen') {
        // Logika fleksibel: 
        // Izinkan jika booking milik jamaah yang agen_id-nya adalah dia
        // ATAU jika booking tersebut memang milik si Agen sendiri
        $isMyJamaah = ($booking->user->agent_id === $request->user()->id);
        $isMyOwnBooking = ($booking->user_id === $request->user()->id);

        if (!$isMyJamaah && !$isMyOwnBooking) {
            // Jika kedua kondisi di atas salah, baru kita blokir
            abort(403, 'Unauthorized. Anda tidak memiliki akses ke data jamaah ini.');
        }
    }

    return Inertia::render('admin/registration-form', [
        'booking' => $booking
    ]);
}
    // ==========================================
    // POPUP PROMO MANAGEMENT
    // ==========================================

    public function popupPromos(Request $request)
    {
        if ($request->user()->role !== 'admin' && $request->user()->role !== 'pusat')
            abort(403);

        $popupPromos = PopupPromo::orderBy('created_at', 'desc')->get();

        return Inertia::render('admin/popup-promos', [
            'popupPromos' => $popupPromos,
        ]);
    }

    public function storePopupPromo(Request $request)
    {
        if ($request->user()->role !== 'admin')
            abort(403);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'button_text' => 'nullable|string|max:100',
            'button_link' => 'nullable|string|max:500',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('popup_promos', 'public');
        }

        $isActive = $request->input('is_active', false);
        $validated['is_active'] = $isActive;

        // If activating, deactivate all others first
        if ($isActive) {
            PopupPromo::where('is_active', true)->update(['is_active' => false]);
        }

        PopupPromo::create($validated);

        return back()->with('success', 'Popup promo berhasil ditambahkan.');
    }

    public function updatePopupPromo(Request $request, $id)
    {
        if ($request->user()->role !== 'admin')
            abort(403);

        $popup = PopupPromo::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'button_text' => 'nullable|string|max:100',
            'button_link' => 'nullable|string|max:500',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($popup->image) {
                Storage::disk('public')->delete($popup->image);
            }
            $validated['image'] = $request->file('image')->store('popup_promos', 'public');
        } else {
            unset($validated['image']);
        }

        $isActive = $request->input('is_active', $popup->is_active);
        $validated['is_active'] = $isActive;

        // If activating, deactivate all others first
        if ($isActive && !$popup->is_active) {
            PopupPromo::where('is_active', true)->where('id', '!=', $id)->update(['is_active' => false]);
        }

        $popup->update($validated);

        return back()->with('success', 'Popup promo berhasil diperbarui.');
    }

    public function togglePopupPromo(Request $request, $id)
    {
        if ($request->user()->role !== 'admin')
            abort(403);

        $popup = PopupPromo::findOrFail($id);

        if (!$popup->is_active) {
            // Activating this popup — deactivate all others
            PopupPromo::where('is_active', true)->update(['is_active' => false]);
            $popup->update(['is_active' => true]);
            return back()->with('success', "Popup \"{$popup->title}\" berhasil diaktifkan.");
        } else {
            // Deactivating
            $popup->update(['is_active' => false]);
            return back()->with('success', "Popup \"{$popup->title}\" berhasil dinonaktifkan.");
        }
    }

    // ==========================================
    // GALLERY MANAGEMENT
    // ==========================================

    public function galleries(Request $request)
    {
        if ($request->user()->role !== 'admin' && $request->user()->role !== 'pusat')
            abort(403);

        $galleries = Gallery::orderBy('order', 'asc')->orderBy('created_at', 'desc')->get();

        return Inertia::render('admin/galleries', [
            'galleries' => $galleries,
        ]);
    }

    public function storeGallery(Request $request)
    {
        if ($request->user()->role !== 'admin')
            abort(403);

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'image' => 'required|image|max:3072',
            'is_active' => 'boolean',
            'order' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('galleries', 'public');
        }

        $validated['is_active'] = $request->input('is_active', true);
        $validated['order'] = $request->input('order', 0);

        Gallery::create($validated);

        return back()->with('success', 'Foto galeri berhasil ditambahkan.');
    }

    public function updateGallery(Request $request, $id)
    {
        if ($request->user()->role !== 'admin')
            abort(403);

        $gallery = Gallery::findOrFail($id);

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:3072',
            'is_active' => 'boolean',
            'order' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            if ($gallery->image) {
                Storage::disk('public')->delete($gallery->image);
            }
            $validated['image'] = $request->file('image')->store('galleries', 'public');
        } else {
            unset($validated['image']);
        }

        $validated['is_active'] = $request->input('is_active', $gallery->is_active);
        $validated['order'] = $request->input('order', $gallery->order);

        $gallery->update($validated);

        return back()->with('success', 'Foto galeri berhasil diperbarui.');
    }

    public function toggleGallery(Request $request, $id)
    {
        if ($request->user()->role !== 'admin')
            abort(403);

        $gallery = Gallery::findOrFail($id);
        $gallery->update(['is_active' => !$gallery->is_active]);

        $status = $gallery->is_active ? 'ditampilkan' : 'disembunyikan';
        return back()->with('success', "Foto galeri \"{$gallery->title}\" berhasil {$status}.");
    }

    public function destroyGallery(Request $request, $id)
    {
        if ($request->user()->role !== 'admin')
            abort(403);

        $gallery = Gallery::findOrFail($id);

        if ($gallery->image) {
            Storage::disk('public')->delete($gallery->image);
        }

        $gallery->delete();

        return back()->with('success', 'Foto galeri berhasil dihapus.');
    }

    public function financialReport(Request $request)
    {
        $role = $request->user()->role;
        if (!in_array($role, ['admin', 'pusat'])) {
            abort(403, 'Unauthorized access.');
        }

        // Get filter inputs
        $search = $request->input('search');
        $packageId = $request->input('package_id');
        $paymentStatus = $request->input('payment_status');

        // 1. Calculate global financial stats
        $totalIncome = Booking::sum('amount_paid');

        $totalPotential = Booking::join('packages', 'bookings.package_id', '=', 'packages.id')
            ->sum('packages.price');

        $totalReceivables = max(0, $totalPotential - $totalIncome);

        $statusLunasCount = Booking::where('status_pembayaran', 'lunas')->count();
        $statusDpCount = Booking::where('status_pembayaran', 'dp')->count();
        $statusPendingCount = Booking::where('status_pembayaran', 'pending')->count();
        $totalBookingsCount = Booking::count();

        // 2. Performance per package
        $packages = Package::withCount('bookings')
            ->get()
            ->map(function ($pkg) {
                $targetRevenue = $pkg->bookings_count * $pkg->price;
                $realRevenue = Booking::where('package_id', $pkg->id)->sum('amount_paid');
                $receivables = max(0, $targetRevenue - $realRevenue);

                return [
                    'id' => $pkg->id,
                    'name' => $pkg->name,
                    'price' => $pkg->price,
                    'departure_date' => $pkg->departure_date,
                    'bookings_count' => $pkg->bookings_count,
                    'target_revenue' => $targetRevenue,
                    'real_revenue' => $realRevenue,
                    'receivables' => $receivables,
                ];
            });

        // 3. Detailed transaction list
        $query = Booking::with(['user', 'jamaahMember', 'package'])
            ->orderBy('created_at', 'desc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($sq) use ($search) {
                    $sq->where('name', 'like', "%{$search}%");
                })->orWhereHas('jamaahMember', function ($sq) use ($search) {
                    $sq->where('name', 'like', "%{$search}%");
                });
            });
        }

        if ($packageId) {
            $query->where('package_id', $packageId);
        }

        if ($paymentStatus) {
            $query->where('status_pembayaran', $paymentStatus);
        }

        $bookings = $query->paginate(15)->withQueryString();
        $allPackages = Package::select('id', 'name')->get();

        return Inertia::render('admin/financial-report', [
            'bookings' => $bookings,
            'allPackages' => $allPackages,
            'stats' => [
                'total_income' => (float) $totalIncome,
                'total_potential' => (float) $totalPotential,
                'total_receivables' => (float) $totalReceivables,
                'status_lunas_count' => $statusLunasCount,
                'status_dp_count' => $statusDpCount,
                'status_pending_count' => $statusPendingCount,
                'total_bookings_count' => $totalBookingsCount,
            ],
            'packageSummary' => $packages,
            'filters' => [
                'search' => $search,
                'package_id' => $packageId,
                'payment_status' => $paymentStatus,
            ],
        ]);
    }

    public function exportFinancialReport(Request $request)
    {
        $role = $request->user()->role;
        if (!in_array($role, ['admin', 'pusat'])) {
            abort(403, 'Unauthorized access.');
        }

        $search = $request->input('search');
        $packageId = $request->input('package_id');
        $paymentStatus = $request->input('payment_status');

        $query = Booking::with(['user', 'jamaahMember', 'package'])
            ->orderBy('created_at', 'desc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($sq) use ($search) {
                    $sq->where('name', 'like', "%{$search}%");
                })->orWhereHas('jamaahMember', function ($sq) use ($search) {
                    $sq->where('name', 'like', "%{$search}%");
                });
            });
        }

        if ($packageId) {
            $query->where('package_id', $packageId);
        }

        if ($paymentStatus) {
            $query->where('status_pembayaran', $paymentStatus);
        }

        $bookings = $query->get();

        $filename = "laporan_keuangan_" . date('Ymd_His') . ".csv";

        $headers = [
            "Content-type" => "text/csv; charset=UTF-8",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $columns = [
            'ID Booking',
            'Nama Jamaah',
            'Hubungan Keluarga',
            'Email Akun',
            'Paket Keberangkatan',
            'Harga Paket (IDR)',
            'Uang Masuk (IDR)',
            'Sisa Piutang (IDR)',
            'Status Pembayaran',
            'Tanggal Pemesanan'
        ];

        $callback = function () use ($bookings, $columns) {
            $file = fopen('php://output', 'w');
            // Add UTF-8 BOM for Excel compatibility
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));
            fputcsv($file, $columns);

            foreach ($bookings as $b) {
                $totalPaid = (float) ($b->amount_paid ?? 0);
                $pkgPrice = (float) ($b->package ? $b->package->price : 0);
                $due = max(0, $pkgPrice - $totalPaid);

                fputcsv($file, [
                    '#' . str_pad($b->id, 5, '0', STR_PAD_LEFT),
                    $b->jamaahMember ? $b->jamaahMember->name : ($b->user ? $b->user->name : '-'),
                    $b->jamaahMember ? $b->jamaahMember->hubungan_keluarga : 'Akun Utama',
                    $b->user ? $b->user->email : '-',
                    $b->package ? $b->package->name : '-',
                    $pkgPrice,
                    $totalPaid,
                    $due,
                    strtoupper($b->status_pembayaran),
                    $b->created_at ? $b->created_at->format('Y-m-d H:i:s') : '-',
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function orders(Request $request)
    {
        $role = $request->user()->role;
        if (!in_array($role, ['admin', 'pusat', 'agen'])) {
            abort(403);
        }

        $searchAgent = $request->input('agent_id');
        $searchPackage = $request->input('package_id');

        $query = Order::with(['package', 'agent', 'bookings.jamaahMember', 'groupUser'])
            ->where('total_pax', '>', 0)
            ->orderBy('created_at', 'desc');

        if ($role === 'agen') {
            $query->where('agent_id', $request->user()->id);
        } else {
            if ($searchAgent) {
                $query->where('agent_id', $searchAgent);
            }
        }

        if ($searchPackage) {
            $query->where('package_id', $searchPackage);
        }

        $ordersList = $query->get()->map(function ($order) {
            // Count booked / inputted pilgrims under this order
            $inputted = $order->bookings->count();
            $missing = max(0, $order->total_pax - $inputted);

            // Count how many of the inputted pilgrims are incomplete
            $incomplete = 0;
            foreach ($order->bookings as $booking) {
                $member = $booking->jamaahMember;
                $docsCount = 0;
                if ($member) {
                    if ($member->ktp_file)
                        $docsCount++;
                    if ($member->kk_file)
                        $docsCount++;
                    if ($member->paspor_file)
                        $docsCount++;
                    if ($member->vaksin_file)
                        $docsCount++;
                }
                if ($docsCount < 4) {
                    $incomplete++;
                }
            }

            return [
                'id' => $order->id,
                'package_id' => $order->package_id,
                'package_name' => $order->package ? $order->package->name : '-',
                'departure_date' => $order->package ? $order->package->departure_date : null,
                'agent_id' => $order->agent_id,
                'agent_name' => $order->agent ? $order->agent->name : '-',
                'total_pax' => $order->total_pax,
                'keterangan' => $order->keterangan,
                'status_kunci' => $order->status_kunci,
                'inputted_pax' => $inputted,
                'missing_pax' => $missing,
                'incomplete_pax' => $incomplete,
                'created_at' => $order->created_at,
            ];
        });

        if ($role === 'agen') {
            $totalJamaahRegistered = Order::where('agent_id', $request->user()->id)->sum('total_pax');
        } else {
            $totalJamaahRegistered = Order::sum('total_pax');
        }

        $activePackages = Package::where('is_active', true)->get();
        $agents = User::where('role', 'agen')->get();

        return Inertia::render('admin/orders', [
            'orders' => $ordersList,
            'packages' => Package::all(),
            'activePackages' => $activePackages,
            'agents' => $agents,
            'totalJamaahRegistered' => $totalJamaahRegistered,
            'userRole' => $role,
            'filters' => [
                'agent_id' => $searchAgent,
                'package_id' => $searchPackage,
            ]
        ]);
    }

    public function storeOrder(Request $request)
    {
        $role = $request->user()->role;
        if (!in_array($role, ['admin', 'agen'])) {
            abort(403);
        }

        $validated = $request->validate([
            'package_id' => 'required|exists:packages,id',
            'agent_id' => $role === 'admin' ? 'required|exists:users,id' : 'nullable',
            'total_pax' => 'required|integer|min:1',
            'keterangan' => 'nullable|string',
        ]);

        $agentId = $role === 'admin' ? $validated['agent_id'] : $request->user()->id;
        $agent = User::findOrFail($agentId);

        $order = Order::create([
            'package_id' => $validated['package_id'],
            'agent_id' => $agentId,
            'user_id' => $agentId,
            'total_pax' => $validated['total_pax'],
            'keterangan' => $validated['keterangan'] ?? null,
            'status_kunci' => 'open',
        ]);

        return back()->with('success', 'Order baru berhasil dibuat.');
    }

    public function updateOrder(Request $request, $id)
    {
        $role = $request->user()->role;
        if (!in_array($role, ['admin', 'agen'])) {
            abort(403);
        }

        $order = Order::findOrFail($id);

        if ($role === 'agen' && $order->agent_id !== $request->user()->id) {
            abort(403);
        }

        if ($order->status_kunci === 'locked' && $role !== 'admin') {
            return back()->withErrors(['message' => 'Order ini terkunci. Silakan hubungi admin untuk membukanya.']);
        }

        $validated = $request->validate([
            'package_id' => 'required|exists:packages,id',
            'agent_id' => $role === 'admin' ? 'required|exists:users,id' : 'nullable',
            'total_pax' => 'required|integer|min:1',
            'keterangan' => 'nullable|string',
        ]);

        $filledPax = $order->bookings()->count();
        if ($validated['total_pax'] < $filledPax) {
            return back()->withErrors([
                'total_pax' => "Jumlah pax tidak boleh kurang dari jumlah jamaah yang sudah terisi ({$filledPax} jamaah)."
            ]);
        }

        $agentId = $role === 'admin' ? $validated['agent_id'] : $order->agent_id;

        if ($order->package_id !== (int) $validated['package_id']) {
            if ($order->package) {
                $order->package->increment('available_seats', $order->total_pax);
            }

            $order->package_id = $validated['package_id'];
            $order->total_pax = $validated['total_pax'];

            $newPkg = Package::findOrFail($validated['package_id']);
            $newPkg->decrement('available_seats', $validated['total_pax']);
        } else {
            $order->total_pax = $validated['total_pax'];
        }

        $order->agent_id = $agentId;
        $order->keterangan = $validated['keterangan'] ?? null;
        $order->save();

        return back()->with('success', 'Order berhasil diperbarui.');
    }

    public function toggleOrderLock(Request $request, $id)
    {
        if (!in_array($request->user()->role, ['admin', 'pusat'])) {
            abort(403);
        }

        $order = Order::findOrFail($id);
        $order->status_kunci = $order->status_kunci === 'open' ? 'locked' : 'open';
        $order->save();

        $status = $order->status_kunci === 'locked' ? 'dikunci' : 'dibuka';
        return back()->with('success', "Order #{$order->id} berhasil {$status}.");
    }

    public function isiJamaah(Request $request, $id)
    {
        $role = $request->user()->role;
        if (!in_array($role, ['admin', 'agen'])) {
            abort(403);
        }

        $order = Order::with(['package', 'agent', 'groupUser'])->findOrFail($id);

        if ($role === 'agen' && $order->agent_id !== $request->user()->id) {
            abort(403);
        }

        $bookings = Booking::with('jamaahMember')
            ->where('order_id', $order->id)
            ->get();

        $existingJamaahs = $bookings->map(function ($booking) {
            $member = $booking->jamaahMember;
            return [
                'booking_id' => $booking->id,
                'member_id' => $member ? $member->id : null,
                'name' => $member ? $member->name : '',
                'jenis_kelamin' => $member ? $member->jenis_kelamin : '',
                'tempat_lahir' => $member ? $member->tempat_lahir : '',
                'tgl_lahir' => $member ? $member->tgl_lahir : '',
                'nomor_paspor' => $member ? $member->nomor_paspor : '',
                'paspor_issued' => $member ? $member->paspor_issued : '',
                'paspor_expiry' => $member ? $member->paspor_expiry : '',
                'paspor_office' => $member ? $member->paspor_office : '',
                'pp' => $member ? $member->pp : '-',
                'vm' => $member ? $member->vm : '-',
                'vp' => $member ? $member->vp : '-',
                'paspor_file_url' => ($member && $member->paspor_file) ? asset('storage-file/' . $member->paspor_file) : null,
                'vaksin_file_url' => ($member && $member->vaksin_file) ? asset('storage-file/' . $member->vaksin_file) : null,
            ];
        })->toArray();

        $rows = [];
        for ($i = 0; $i < $order->total_pax; $i++) {
            if (isset($existingJamaahs[$i])) {
                $rows[] = $existingJamaahs[$i];
            } else {
                $rows[] = [
                    'booking_id' => null,
                    'member_id' => null,
                    'name' => '',
                    'jenis_kelamin' => '',
                    'tempat_lahir' => '',
                    'tgl_lahir' => '',
                    'nomor_paspor' => '',
                    'paspor_issued' => '',
                    'paspor_expiry' => '',
                    'paspor_office' => '',
                    'pp' => '-',
                    'vm' => '-',
                    'vp' => '-',
                    'paspor_file_url' => null,
                    'vaksin_file_url' => null,
                ];
            }
        }
        $packages = Package::where('is_active', true)
            ->where('id', '!=', $order->package_id)
            ->get();

        return Inertia::render('admin/isi-jamaah', [
            'order' => $order,
            'paxRows' => $rows,
            'packages' => $packages,
        ]);
    }

    public function saveJamaahGrid(Request $request, $id)
    {
        $role = $request->user()->role;
        if (!in_array($role, ['admin', 'agen'])) {
            abort(403);
        }

        $order = Order::findOrFail($id);

        if ($role === 'agen' && $order->agent_id !== $request->user()->id) {
            abort(403);
        }

        if ($order->status_kunci === 'locked' && $role !== 'admin') {
            return back()->withErrors(['message' => 'Order ini terkunci. Anda tidak dapat mengubah data jamaah.']);
        }

        $jamaahsData = $request->input('jamaahs', []);
        $groupUser = $order->groupUser;
        if (!$groupUser) {
            $groupUser = $order->agent ?: $request->user();
            $order->update(['user_id' => $groupUser->id]);
        }

        foreach ($jamaahsData as $index => $rowData) {
            if (empty($rowData['name'])) {
                if (!empty($rowData['booking_id'])) {
                    $bookingToDelete = Booking::find($rowData['booking_id']);
                    if ($bookingToDelete) {
                        $bookingToDelete->delete();
                    }
                }
                continue;
            }

            $member = null;
            if (!empty($rowData['member_id'])) {
                $member = \App\Models\JamaahMember::find($rowData['member_id']);
            }

            $memberData = [
                'user_id' => $groupUser->id,
                'name' => $rowData['name'],
                'jenis_kelamin' => $rowData['jenis_kelamin'] ?: null,
                'tempat_lahir' => $rowData['tempat_lahir'] ?: null,
                'tgl_lahir' => $rowData['tgl_lahir'] ?: null,
                'nomor_paspor' => $rowData['nomor_paspor'] ?: null,
                'paspor_issued' => $rowData['paspor_issued'] ?: null,
                'paspor_expiry' => $rowData['paspor_expiry'] ?: null,
                'paspor_office' => $rowData['paspor_office'] ?: null,
                'pp' => $rowData['pp'] ?: '-',
                'vm' => $rowData['vm'] ?: '-',
                'vp' => $rowData['vp'] ?: '-',
            ];

            if ($request->hasFile("paspor_file_{$index}")) {
                $memberData['paspor_file'] = $request->file("paspor_file_{$index}")->store('documents', 'public');
            }
            if ($request->hasFile("vaksin_file_{$index}")) {
                $memberData['vaksin_file'] = $request->file("vaksin_file_{$index}")->store('documents', 'public');
            }

            if ($member) {
                $member->update($memberData);
            } else {
                $member = \App\Models\JamaahMember::create($memberData);
            }

            $booking = null;
            if (!empty($rowData['booking_id'])) {
                $booking = Booking::find($rowData['booking_id']);
            }

            $statusDokumen = ($member->ktp_file && $member->kk_file && $member->paspor_file && $member->vaksin_file) ? 'lengkap' : 'belum_lengkap';

            if ($booking) {
                $booking->update([
                    'jamaah_member_id' => $member->id,
                    'status_dokumen' => $statusDokumen,
                ]);
            } else {
                Booking::create([
                    'order_id' => $order->id,
                    'user_id' => $groupUser->id,
                    'jamaah_member_id' => $member->id,
                    'package_id' => $order->package_id,
                    'status_pembayaran' => 'pending',
                    'status_dokumen' => $statusDokumen,
                ]);
            }
        }

        return redirect()->route('admin.orders')->with('success', 'Data Jamaah berhasil disimpan.');
    }

    public function moveBookingPackage(Request $request, $id)
    {
        $role = $request->user()->role;
        if (!in_array($role, ['admin', 'agen'])) {
            abort(403);
        }

        $booking = Booking::with(['order', 'jamaahMember'])->findOrFail($id);
        $sourceOrder = $booking->order;

        if (!$sourceOrder) {
            return back()->withErrors(['message' => 'Transaksi tidak terikat pada order booking mana pun.']);
        }

        if ($role === 'agen' && $sourceOrder->agent_id !== $request->user()->id) {
            abort(403);
        }

        if ($sourceOrder->status_kunci === 'locked' && $role !== 'admin') {
            return back()->withErrors(['message' => 'Order asal terkunci. Anda tidak dapat memindahkan jamaah.']);
        }

        $validated = $request->validate([
            'target_package_id' => 'required|exists:packages,id',
        ]);

        $targetPackageId = $validated['target_package_id'];

        if ($targetPackageId == $sourceOrder->package_id) {
            return back()->withErrors(['message' => 'Paket tujuan tidak boleh sama dengan paket asal.']);
        }

        $targetPackage = Package::findOrFail($targetPackageId);
        if ($targetPackage->available_seats <= 0) {
            return back()->withErrors(['message' => 'Paket tujuan sudah penuh. Tidak ada seat tersisa.']);
        }

        // DB Transaction to ensure atomicity
        \DB::transaction(function () use ($booking, $sourceOrder, $targetPackageId, $request) {
            // Find or create an open order for this agent under the target package
            $targetOrder = Order::where('package_id', $targetPackageId)
                ->where('agent_id', $sourceOrder->agent_id)
                ->where('status_kunci', 'open')
                ->first();

            if (!$targetOrder) {
                // Get agent user
                $agent = User::findOrFail($sourceOrder->agent_id);

                // Create a new target order
                $targetOrder = Order::create([
                    'package_id' => $targetPackageId,
                    'agent_id' => $sourceOrder->agent_id,
                    'total_pax' => 0, // Will be incremented to 1 right after
                    'keterangan' => 'Pindahan dari paket ' . ($sourceOrder->package ? $sourceOrder->package->name : ''),
                    'status_kunci' => 'open',
                ]);

                // Create a group user for the new order
                $groupUser = User::create([
                    'name' => "Rombongan " . $agent->name . " - Order #" . $targetOrder->id,
                    'email' => "order_" . $targetOrder->id . "_" . time() . "@annamirohtravel.com",
                    'password' => \Illuminate\Support\Facades\Hash::make('12345678'),
                    'role' => 'user',
                    'agent_id' => $sourceOrder->agent_id,
                ]);

                $targetOrder->update(['user_id' => $groupUser->id]);
            }

            // Increment the target order's total_pax by 1 (using save to trigger Eloquent updating hooks)
            $targetOrder->total_pax = $targetOrder->total_pax + 1;
            $targetOrder->save();

            // Decrement the source order's total_pax by 1
            $sourceOrder->total_pax = max(0, $sourceOrder->total_pax - 1);
            $sourceOrder->save();

            // Move the booking to the target order and target package and target group user
            $booking->update([
                'order_id' => $targetOrder->id,
                'package_id' => $targetPackageId,
                'user_id' => $targetOrder->user_id,
            ]);

            // Update the jamaah member's user_id (group user)
            if ($booking->jamaahMember) {
                $booking->jamaahMember->update([
                    'user_id' => $targetOrder->user_id,
                ]);
            }

            // Delete the source order if its total_pax has reached 0
            if ($sourceOrder->total_pax <= 0) {
                $sourceOrder->delete();
            }
        });

        return back()->with('success', 'Jamaah berhasil dipindahkan ke paket tujuan.');
    }

    public function searchJamaahMembers(Request $request)
    {
        $role = $request->user()->role;
        if (!in_array($role, ['admin', 'pusat', 'agen'])) {
            abort(403);
        }

        $search = $request->input('search');

        $query = \App\Models\JamaahMember::with('user');

        // Scope by agent if current user is an agent
        if ($role === 'agen') {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('agent_id', $request->user()->id)
                    ->orWhere('id', $request->user()->id);
            });
        }

        // Search logic
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('nik', 'like', "%{$search}%")
                    ->orWhere('nomor_paspor', 'like', "%{$search}%");
            });
        }

        // Return a max of 20 results for fast response
        $members = $query->limit(20)->get()->map(function ($member) {
            return [
                'id' => $member->id,
                'name' => $member->name,
                'jenis_kelamin' => $member->jenis_kelamin,
                'tempat_lahir' => $member->tempat_lahir,
                'tgl_lahir' => $member->tgl_lahir,
                'nomor_paspor' => $member->nomor_paspor,
                'paspor_issued' => $member->paspor_issued,
                'paspor_expiry' => $member->paspor_expiry,
                'paspor_office' => $member->paspor_office,
                'pp' => $member->pp,
                'vm' => $member->vm,
                'vp' => $member->vp,
                'paspor_file_url' => $member->paspor_file ? asset('storage-file/' . $member->paspor_file) : null,
                'vaksin_file_url' => $member->vaksin_file ? asset('storage-file/' . $member->vaksin_file) : null,
            ];
        });

        return response()->json($members);
    }

    public function importJamaah(Request $request)
    {
        $role = $request->user()->role;
        if (!in_array($role, ['admin', 'pusat'])) {
            abort(403);
        }

        $request->validate([
            'package_id' => 'required|exists:packages,id',
            'file' => 'required|file|mimes:xlsx,xls,csv,txt|max:10240',
        ]);

        $packageId = $request->input('package_id');
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
                    if ($cleaned === 'agent' || $cleaned === 'agen') {
                        $headers['agent'] = $colIndex;
                    }
                    if ($cleaned === 'name' || $cleaned === 'nama') {
                        $headers['name'] = $colIndex;
                    }
                    if ($cleaned === 'sex' || $cleaned === 'jenis_kelamin' || $cleaned === 'jk' || $cleaned === 'gender') {
                        $headers['sex'] = $colIndex;
                    }
                    if ($cleaned === 'age' || $cleaned === 'umur' || $cleaned === 'usia') {
                        $headers['age'] = $colIndex;
                    }
                    if ($cleaned === 'place' || $cleaned === 'tempat_lahir') {
                        $headers['place'] = $colIndex;
                    }
                    if ($cleaned === 'date' || $cleaned === 'tgl_lahir' || $cleaned === 'tanggal_lahir') {
                        $headers['date'] = $colIndex;
                    }
                    if ($cleaned === 'passport' || $cleaned === 'paspor' || $cleaned === 'no_paspor' || $cleaned === 'nomor_paspor') {
                        $headers['passport'] = $colIndex;
                    }
                    if ($cleaned === 'issued' || $cleaned === 'paspor_issued') {
                        $headers['issued'] = $colIndex;
                    }
                    if ($cleaned === 'expired' || $cleaned === 'paspor_expired' || $cleaned === 'expiry') {
                        $headers['expired'] = $colIndex;
                    }
                    if ($cleaned === 'office' || $cleaned === 'kantor_paspor' || $cleaned === 'paspor_office') {
                        $headers['office'] = $colIndex;
                    }
                    if ($cleaned === 'pp') {
                        $headers['pp'] = $colIndex;
                    }
                    if ($cleaned === 'vm') {
                        $headers['vm'] = $colIndex;
                    }
                    if ($cleaned === 'vp') {
                        $headers['vp'] = $colIndex;
                    }
                }

                // If we found name, this is the header row
                if (isset($headers['name'])) {
                    $firstRowIndex = $rowIndex;
                    break;
                }
            }

            if (!$firstRowIndex) {
                return back()->withErrors(['message' => 'Format kolom Excel tidak sesuai. Pastikan terdapat minimal kolom "NAME" atau "NAMA".']);
            }

            $agents = User::where('role', 'agen')->get();

            \Illuminate\Support\Facades\DB::beginTransaction();

            $importedCount = 0;

            foreach ($rows as $rowIndex => $row) {
                if ($rowIndex <= $firstRowIndex) {
                    continue;
                }

                $nameVal = isset($headers['name']) ? trim($row[$headers['name']]) : null;
                if (empty($nameVal) || is_numeric($nameVal)) {
                    continue; // Skip empty names or row numbering
                }

                $agentVal = isset($headers['agent']) ? trim($row[$headers['agent']]) : null;
                $sexVal = isset($headers['sex']) ? trim($row[$headers['sex']]) : null;
                $ageVal = isset($headers['age']) ? trim($row[$headers['age']]) : null;
                $placeVal = isset($headers['place']) ? trim($row[$headers['place']]) : null;
                $dateVal = isset($headers['date']) ? trim($row[$headers['date']]) : null;
                $passportVal = isset($headers['passport']) ? trim($row[$headers['passport']]) : null;
                $issuedVal = isset($headers['issued']) ? trim($row[$headers['issued']]) : null;
                $expiredVal = isset($headers['expired']) ? trim($row[$headers['expired']]) : null;
                $officeVal = isset($headers['office']) ? trim($row[$headers['office']]) : null;
                $ppVal = isset($headers['pp']) ? trim($row[$headers['pp']]) : null;
                $vmVal = isset($headers['vm']) ? trim($row[$headers['vm']]) : null;
                $vpVal = isset($headers['vp']) ? trim($row[$headers['vp']]) : null;

                // Match agent
                $agent = null;
                if (!empty($agentVal)) {
                    $agentNameClean = strtolower(trim($agentVal));
                    $agent = $agents->first(function ($a) use ($agentNameClean) {
                        return str_contains(strtolower($a->name), $agentNameClean) || str_contains($agentNameClean, strtolower($a->name));
                    });
                }

                // Determine gender
                $gender = null;
                if (!empty($sexVal)) {
                    $sexLower = strtolower($sexVal);
                    if ($sexLower === 'l' || str_contains($sexLower, 'laki')) {
                        $gender = 'Laki-laki';
                    } elseif ($sexLower === 'p' || str_contains($sexLower, 'perempuan')) {
                        $gender = 'Perempuan';
                    }
                }

                // Parse birth date and passport dates
                $birthDate = $this->parseExcelDate($dateVal);
                $pasporIssued = $this->parseExcelDate($issuedVal);
                $pasporExpiry = $this->parseExcelDate($expiredVal);

                // Locate or create user account for jamaah
                $member = \App\Models\JamaahMember::where('name', $nameVal)->first();
                if ($member) {
                    $user = $member->user;
                } else {
                    $emailClean = preg_replace('/[^a-z0-9]/', '', strtolower($nameVal));
                    $email = $emailClean . '_' . mt_rand(1000, 9999) . '@annamirah.com';

                    $user = User::create([
                        'name' => $nameVal,
                        'email' => $email,
                        'password' => \Illuminate\Support\Facades\Hash::make('12345678'),
                        'role' => 'user',
                        'agent_id' => $agent ? $agent->id : null,
                    ]);

                    $user->profile()->create([
                        'no_wa' => '-',
                        'tempat_lahir' => $placeVal,
                        'tgl_lahir' => $birthDate,
                        'alamat' => '-',
                    ]);
                }

                $memberData = [
                    'user_id' => $user->id,
                    'name' => $nameVal,
                    'jenis_kelamin' => $gender,
                    'tempat_lahir' => $placeVal ?: ($member ? $member->tempat_lahir : null),
                    'tgl_lahir' => $birthDate ?: ($member ? $member->tgl_lahir : null),
                    'nomor_paspor' => $passportVal ?: ($member ? $member->nomor_paspor : null),
                    'paspor_issued' => $pasporIssued ?: ($member ? $member->paspor_issued : null),
                    'paspor_expiry' => $pasporExpiry ?: ($member ? $member->paspor_expiry : null),
                    'paspor_office' => $officeVal ?: ($member ? $member->paspor_office : null),
                    'pp' => $ppVal ?: ($member ? $member->pp : '-'),
                    'vm' => $vmVal ?: ($member ? $member->vm : '-'),
                    'vp' => $vpVal ?: ($member ? $member->vp : '-'),
                ];

                if ($member) {
                    $member->update($memberData);
                } else {
                    $member = \App\Models\JamaahMember::create($memberData);
                }

                // Handle Booking and Order
                $booking = Booking::where('jamaah_member_id', $member->id)->where('package_id', $packageId)->first();
                if (!$booking) {
                    $orderId = null;
                    if ($agent) {
                        $order = Order::where('package_id', $packageId)->where('agent_id', $agent->id)->first();
                        if ($order) {
                            $order->increment('total_pax');
                        } else {
                            $order = Order::create([
                                'package_id' => $packageId,
                                'agent_id' => $agent->id,
                                'user_id' => $agent->id,
                                'total_pax' => 1,
                                'keterangan' => 'Imported via Excel Manifest',
                                'status_kunci' => 'open',
                            ]);
                        }
                        $orderId = $order->id;
                    }

                    Booking::create([
                        'order_id' => $orderId,
                        'user_id' => $user->id,
                        'jamaah_member_id' => $member->id,
                        'package_id' => $packageId,
                        'status_pembayaran' => 'pending',
                        'status_dokumen' => 'belum_lengkap',
                    ]);
                }

                $importedCount++;
            }

            \Illuminate\Support\Facades\DB::commit();

            return back()->with('success', "Berhasil mengimpor {$importedCount} jamaah.");

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            return back()->withErrors(['message' => 'Gagal mengimpor file Excel: ' . $e->getMessage()]);
        }
    }

    private function parseExcelDate($dateStr)
    {
        if (empty($dateStr))
            return null;
        $dateStr = trim($dateStr);

        // Translate Indonesian month names to English
        $indoMonths = ['jan', 'peb', 'pebr', 'mar', 'apr', 'mei', 'jun', 'jul', 'agu', 'agus', 'sep', 'okt', 'nop', 'des'];
        $engMonths = ['jan', 'feb', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'aug', 'sep', 'oct', 'nov', 'dec'];

        $lower = strtolower($dateStr);
        $lower = str_replace($indoMonths, $engMonths, $lower);

        try {
            return \Carbon\Carbon::parse($lower)->format('Y-m-d');
        } catch (\Exception $e) {
            $ts = strtotime($lower);
            if ($ts) {
                return date('Y-m-d', $ts);
            }
            return null;
        }
    }
}

