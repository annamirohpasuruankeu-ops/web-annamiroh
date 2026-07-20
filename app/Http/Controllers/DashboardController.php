<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Package;
use App\Models\Booking;
use App\Models\Order;
use App\Models\User;
use App\Support\ManifestLock;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (in_array($user->role, ['admin', 'pusat', 'admin_paket', 'admin_manifest', 'admin_keuangan'], true)) {
            return redirect('/admin');
        }
        if ($user->role === 'agen') {
            return redirect('/admin/orders');
        }

        $user->load('profile', 'bookings.package', 'jamaahMembers');
        
        $bookPackage = null;
        if ($request->has('book_package_id')) {
            $bookPackage = Package::find($request->book_package_id);
        }
        
        $availablePackages = Package::where('available_seats', '>', 0)->get();
        
        return Inertia::render('dashboard', [
            'userData' => $user,
            'bookPackage' => $bookPackage,
            'availablePackages' => $availablePackages,
        ]);
    }

    public function storeBooking(Request $request)
    {
        $request->validate([
            'package_id' => 'required|exists:packages,id',
            'jamaah_member_ids' => 'required|array|min:1',
            'jamaah_member_ids.*' => 'exists:jamaah_members,id',
        ]);

        $user = $request->user();
        $package = Package::findOrFail($request->package_id);
        ManifestLock::ensurePackageEditable($package);

        // Verify all selected members belong to the authenticated user
        $members = $user->jamaahMembers()->whereIn('id', $request->jamaah_member_ids)->get();
        if ($members->count() !== count($request->jamaah_member_ids)) {
            abort(403, 'Unauthorized member selection.');
        }

        // Filter out already booked members
        $unbookedMembers = [];
        foreach ($members as $member) {
            $exists = Booking::where('user_id', $user->id)
                ->where('jamaah_member_id', $member->id)
                ->where('package_id', $package->id)
                ->exists();
            if (!$exists) {
                $unbookedMembers[] = $member;
            }
        }

        if (empty($unbookedMembers)) {
            return redirect()->route('dashboard')->withErrors(['message' => 'Seluruh anggota rombongan yang dipilih sudah terdaftar di paket ini.']);
        }

        $requestedSeats = count($unbookedMembers);
        if ($package->available_seats < $requestedSeats) {
            return back()->withErrors(['message' => 'Kursi tidak mencukupi untuk jumlah jamaah yang dipilih.']);
        }

        // Determine agent: user's agent_id, or first admin/pusat user
        $agentId = $user->agent_id ?: User::whereIn('role', ['admin', 'pusat'])->first()?->id;
        if (!$agentId) {
            $agentId = User::first()?->id;
        }

        // Create the parent Order
        $order = Order::create([
            'package_id' => $package->id,
            'agent_id' => $agentId,
            'user_id' => $user->id,
            'total_pax' => $requestedSeats,
            'keterangan' => 'Pendaftaran Mandiri',
            'status_kunci' => 'open',
        ]);

        $createdCount = 0;
        foreach ($unbookedMembers as $member) {
            $statusDokumen = ($member->ktp_file && $member->kk_file && $member->paspor_file && $member->vaksin_file) ? 'lengkap' : 'belum_lengkap';
            
            Booking::create([
                'user_id' => $user->id,
                'jamaah_member_id' => $member->id,
                'package_id' => $package->id,
                'status_pembayaran' => 'pending',
                'status_dokumen' => $statusDokumen,
                'order_id' => $order->id,
            ]);
            $createdCount++;
        }

        return redirect()->route('dashboard')->with('success', "Pemesanan paket {$package->name} untuk {$createdCount} jamaah berhasil dibuat.");
    }

    public function uploadDocuments(Request $request)
    {
        $request->validate([
            'document_type' => 'required|in:paspor,ktp,kk,vaksin',
            'file' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        $user = $request->user();
        $profile = $user->profile;

        if (!$profile) {
            $profile = $user->profile()->create([]);
        }

        $type = $request->document_type;
        $field = $type . '_file';

        $path = $request->file('file')->store('documents', 'public');

        $profile->update([
            $field => $path,
        ]);

        return back()->with('success', 'Dokumen berhasil diunggah.');
    }

    public function storeJamaahMember(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'nik' => 'required|string|max:50',
            'jenis_kelamin' => 'required|in:Laki-laki,Perempuan',
            'hubungan_keluarga' => 'required|string',
            'tempat_lahir' => 'required|string',
            'tgl_lahir' => 'required|date',
            'email' => 'nullable|email|max:255',
            'nohp' => 'nullable|string|max:20',
            'nomor_paspor' => 'nullable|string|max:50',
            'paspor_issued' => 'nullable|date',
            'paspor_expiry' => 'nullable|date',
            'paspor_office' => 'nullable|string|max:100',
            'pp' => 'nullable|string|in:Pusat,Pasuruan,Mandiri,-',
            'vm' => 'nullable|string|in:Pusat,Pasuruan,Mandiri,-',
            'vp' => 'nullable|string|in:Pusat,Pasuruan,Mandiri,-',
        ]);

        // Default status values
        $validated['pp'] = $validated['pp'] ?? '-';
        $validated['vm'] = $validated['vm'] ?? '-';
        $validated['vp'] = $validated['vp'] ?? '-';

        // Automatically enroll into active package manifest if user has an active booking order
        $latestOrder = \App\Models\Order::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->first();

        if ($latestOrder) {
            ManifestLock::ensurePackageEditable($latestOrder->package_id);
        }

        $member = $request->user()->jamaahMembers()->create($validated);

        if ($latestOrder) {
            $exists = \App\Models\Booking::where('order_id', $latestOrder->id)
                ->where('jamaah_member_id', $member->id)
                ->exists();

            if (!$exists) {
                // Increment order's total_pax (triggers available_seats decrement in Order model boot hook)
                $latestOrder->increment('total_pax', 1);

                $statusDokumen = ($member->ktp_file && $member->kk_file && $member->paspor_file && $member->vaksin_file) ? 'lengkap' : 'belum_lengkap';

                \App\Models\Booking::create([
                    'user_id' => $request->user()->id,
                    'jamaah_member_id' => $member->id,
                    'package_id' => $latestOrder->package_id,
                    'status_pembayaran' => 'belum_bayar',
                    'status_dokumen' => $statusDokumen,
                    'order_id' => $latestOrder->id,
                ]);
            }
        }

        return back()->with('success', 'Anggota keluarga berhasil ditambahkan dan dimasukkan ke dalam manifest.');
    }

    public function updateJamaahMember(Request $request, $id)
    {
        $member = $request->user()->jamaahMembers()->findOrFail($id);
        ManifestLock::ensureMemberEditable($member);

        $validated = $request->validate([
            'name' => 'required|string',
            'nik' => 'required|string|max:50',
            'jenis_kelamin' => 'required|in:Laki-laki,Perempuan',
            'hubungan_keluarga' => 'required|string',
            'tempat_lahir' => 'required|string',
            'tgl_lahir' => 'required|date',
            'email' => 'nullable|email|max:255',
            'nohp' => 'nullable|string|max:20',
            'nomor_paspor' => 'nullable|string|max:50',
            'paspor_issued' => 'nullable|date',
            'paspor_expiry' => 'nullable|date',
            'paspor_office' => 'nullable|string|max:100',
            'pp' => 'nullable|string|in:Pusat,Pasuruan,Mandiri,-',
            'vm' => 'nullable|string|in:Pusat,Pasuruan,Mandiri,-',
            'vp' => 'nullable|string|in:Pusat,Pasuruan,Mandiri,-',
        ]);

        // Default status values
        $validated['pp'] = $validated['pp'] ?? '-';
        $validated['vm'] = $validated['vm'] ?? '-';
        $validated['vp'] = $validated['vp'] ?? '-';

        $member->update($validated);

        return back()->with('success', 'Data anggota keluarga berhasil diperbarui.');
    }

    public function uploadMemberDocument(Request $request, $id)
    {
        $request->validate([
            'document_type' => 'required|in:paspor,ktp,kk,vaksin',
            'file' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        $member = $request->user()->jamaahMembers()->findOrFail($id);
        ManifestLock::ensureMemberEditable($member);

        $type = $request->document_type;
        $field = $type . '_file';

        $path = $request->file('file')->store('documents', 'public');

        $member->update([
            $field => $path,
        ]);

        return back()->with('success', 'Dokumen anggota berhasil diunggah.');
    }
}
