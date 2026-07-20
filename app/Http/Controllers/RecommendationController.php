<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Recommendation;
use App\Models\JamaahMember;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

class RecommendationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (!in_array($user->role, ['admin', 'admin_manifest', 'agen'])) {
            abort(403, 'Unauthorized access.');
        }

        $search = $request->input('search');
        $status = $request->input('status'); // all, pending, approved, rejected

        $query = Recommendation::with(['agent', 'jamaahMember'])
            ->orderBy('created_at', 'desc');

        // Scoping by agent
        if ($user->role === 'agen') {
            $query->where('agent_id', $user->id);
        }

        // Apply search filter (pilgrim name, agent name, or passport number)
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nomor_paspor', 'like', "%{$search}%")
                  ->orWhere('nama_paspor', 'like', "%{$search}%")
                  ->orWhereHas('jamaahMember', function ($jq) use ($search) {
                      $jq->where('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('agent', function ($aq) use ($search) {
                      $aq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Apply status filter
        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        $recommendations = $query->paginate(10)->withQueryString();

        // Add computed file URL for the React frontend
        $recommendations->getCollection()->transform(function ($rec) {
            $rec->paspor_file_url = $rec->paspor_file ? asset('storage-file/' . $rec->paspor_file) : null;
            return $rec;
        });

        // Statistics counts
        if ($user->role === 'agen') {
            $totalCount = Recommendation::where('agent_id', $user->id)->count();
            $pendingCount = Recommendation::where('agent_id', $user->id)->where('status', 'pending')->count();
            $approvedCount = Recommendation::where('agent_id', $user->id)->where('status', 'approved')->count();
            $rejectedCount = Recommendation::where('agent_id', $user->id)->where('status', 'rejected')->count();
        } else {
            $totalCount = Recommendation::count();
            $pendingCount = Recommendation::where('status', 'pending')->count();
            $approvedCount = Recommendation::where('status', 'approved')->count();
            $rejectedCount = Recommendation::where('status', 'rejected')->count();
        }

        return Inertia::render('admin/recommendations', [
            'recommendations' => $recommendations,
            'summary' => [
                'total' => $totalCount,
                'pending' => $pendingCount,
                'approved' => $approvedCount,
                'rejected' => $rejectedCount,
            ],
            'filters' => [
                'search' => $search,
                'status' => $status ?: 'all',
            ],
            'userRole' => $user->role,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        if (!in_array($user->role, ['admin', 'admin_manifest'], true)) {
            abort(403, 'Hanya agen yang dapat mengajukan rekomendasi.');
        }

        $request->validate([
            'jamaah_member_id' => 'required|exists:jamaah_members,id',
            'nomor_paspor' => 'required|string|max:50',
            'nama_paspor' => 'required|string|max:255',
            'keterangan' => 'nullable|string',
            'paspor_file' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        $path = $request->file('paspor_file')->store('recommendations', 'public');

        Recommendation::create([
            'agent_id' => $user->id,
            'jamaah_member_id' => $request->jamaah_member_id,
            'nomor_paspor' => $request->nomor_paspor,
            'nama_paspor' => $request->nama_paspor,
            'keterangan' => $request->keterangan,
            'paspor_file' => $path,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Rekomendasi paspor berhasil diajukan dan sedang menunggu persetujuan admin.');
    }

    public function approve(Request $request, $id)
    {
        $user = $request->user();
        if (!in_array($user->role, ['admin', 'admin_manifest'])) {
            abort(403, 'Hanya admin yang dapat menyetujui pengajuan.');
        }

        $recommendation = Recommendation::findOrFail($id);
        
        if ($recommendation->status !== 'pending') {
            return back()->withErrors(['message' => 'Pengajuan ini sudah diproses sebelumnya.']);
        }

        $recommendation->update([
            'status' => 'approved',
        ]);

        $jamaahMember = JamaahMember::find($recommendation->jamaah_member_id);
        if ($jamaahMember) {
            $jamaahMember->update([
                'nomor_paspor' => $recommendation->nomor_paspor,
                'name' => $recommendation->nama_paspor,
                'paspor_file' => $recommendation->paspor_file,
            ]);
        }

        return back()->with('success', 'Rekomendasi paspor disetujui, data jamaah berhasil diperbarui.');
    }

    public function reject(Request $request, $id)
    {
        $user = $request->user();
        if (!in_array($user->role, ['admin', 'admin_manifest'])) {
            abort(403, 'Hanya admin yang dapat menolak pengajuan.');
        }

        $recommendation = Recommendation::findOrFail($id);

        if ($recommendation->status !== 'pending') {
            return back()->withErrors(['message' => 'Pengajuan ini sudah diproses sebelumnya.']);
        }

        $request->validate([
            'keterangan_admin' => 'nullable|string',
        ]);

        $recommendation->update([
            'status' => 'rejected',
            'keterangan_admin' => $request->input('keterangan_admin'),
        ]);

        return back()->with('success', 'Pengajuan rekomendasi paspor berhasil ditolak.');
    }

    public function searchJamaah(Request $request)
    {
        $user = $request->user();
        if (!in_array($user->role, ['admin', 'admin_manifest', 'agen'])) {
            abort(403);
        }

        $search = $request->input('search');

        $query = JamaahMember::query();

        // Scope by agent if the current user is an agent (so they can search for their own / registered under their account)
        if ($user->role === 'agen') {
            $query->whereHas('user', function ($q) use ($user) {
                $q->where('agent_id', $user->id)
                  ->orWhere('id', $user->id);
            });
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('nik', 'like', "%{$search}%")
                  ->orWhere('nomor_paspor', 'like', "%{$search}%");
            });
        }

        $members = $query->limit(20)->get()->map(function ($member) {
            return [
                'id' => $member->id,
                'name' => $member->name,
                'nomor_paspor' => $member->nomor_paspor,
                'jenis_kelamin' => $member->jenis_kelamin,
            ];
        });

        return response()->json($members);
    }

    public function print(Request $request, $id)
    {
        $user = $request->user();
        if (!in_array($user->role, ['admin', 'admin_manifest', 'agen'])) {
            abort(403);
        }

        $recommendation = Recommendation::with(['jamaahMember.user.profile', 'agent'])->findOrFail($id);

        if ($user->role === 'agen' && $recommendation->agent_id !== $user->id) {
            abort(403, 'Unauthorized.');
        }

        $signed = $request->query('signed') == 1;

        // Generate dynamic letter number: sequence/AN-NAMIROH/SR/MONTH_ROMAN/YEAR
        $sequence = sprintf("%03d", $recommendation->id);
        $romanMonths = [
            1 => 'I', 2 => 'II', 3 => 'III', 4 => 'IV', 5 => 'V', 6 => 'VI',
            7 => 'VII', 8 => 'VIII', 9 => 'IX', 10 => 'X', 11 => 'XI', 12 => 'XII'
        ];
        $monthRoman = $romanMonths[$recommendation->created_at->month] ?? 'I';
        $year = $recommendation->created_at->year;
        $nomorSurat = "{$sequence}/AN-NAMIROH/SR/{$monthRoman}/{$year}";

        // Format DOB
        $dob = $recommendation->jamaahMember && $recommendation->jamaahMember->tgl_lahir 
            ? \Carbon\Carbon::parse($recommendation->jamaahMember->tgl_lahir)->format('d-m-Y')
            : '-';

        return view('print-recommendation', [
            'recommendation' => $recommendation,
            'nomorSurat' => $nomorSurat,
            'dob' => $dob,
            'signed' => $signed,
        ]);
    }
}
