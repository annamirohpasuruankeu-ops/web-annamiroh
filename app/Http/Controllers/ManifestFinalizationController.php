<?php

namespace App\Http\Controllers;

use App\Models\ManifestActivity;
use App\Models\ManifestVersion;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ManifestFinalizationController extends Controller
{
    public function index(Request $request)
    {
        $role = $request->user()->role;
        abort_unless(in_array($role, ['admin', 'admin_manifest', 'pusat'], true), 403);

        $query = Package::query()
            ->with(['manifestLockedBy:id,name', 'currentManifestVersion.finalizedBy:id,name'])
            ->withCount(['bookings as jamaah_count' => fn ($q) => $q->whereNotNull('jamaah_member_id')])
            ->orderBy('departure_date');

        if ($role === 'pusat') {
            $query->where('manifest_status', 'final');
        }

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where(fn ($q) => $q->where('name', 'like', "%{$search}%")->orWhere('code', 'like', "%{$search}%"));
        }

        $packages = $query->get()->map(function (Package $package) {
            $latestDownload = ManifestActivity::with('user:id,name')
                ->where('package_id', $package->id)
                ->where('action', 'downloaded')
                ->latest()
                ->first();

            $downloadCount = ManifestActivity::where('package_id', $package->id)
                ->where('manifest_version_id', $package->currentManifestVersion?->id)
                ->where('action', 'downloaded')
                ->count();

            return [
                'id' => $package->id,
                'code' => $package->code,
                'name' => $package->name,
                'departure_date' => optional($package->departure_date)->format('Y-m-d'),
                'jamaah_count' => $package->currentManifestVersion?->jamaah_count ?? $package->jamaah_count,
                'status' => $package->manifest_status,
                'version' => $package->manifest_version,
                'locked_by' => $package->manifestLockedBy?->name,
                'locked_at' => optional($package->manifest_locked_at)->toIso8601String(),
                'download_count' => $downloadCount,
                'last_downloaded_by' => $latestDownload?->user?->name,
                'last_downloaded_at' => optional($latestDownload?->created_at)->toIso8601String(),
            ];
        });

        $activities = ManifestActivity::with(['user:id,name,role', 'version:id,version'])
            ->when($role === 'pusat', fn ($q) => $q->where('user_id', $request->user()->id)->where('action', 'downloaded'))
            ->latest()
            ->limit(100)
            ->get()
            ->map(fn ($activity) => [
                'id' => $activity->id,
                'package_id' => $activity->package_id,
                'action' => $activity->action,
                'user_name' => $activity->user?->name,
                'user_role' => $activity->user?->role,
                'version' => $activity->version?->version,
                'reason' => $activity->reason,
                'file_name' => $activity->file_name,
                'created_at' => $activity->created_at->toIso8601String(),
            ]);

        return Inertia::render('admin/manifest-finalization', [
            'packages' => $packages,
            'activities' => $activities,
            'filters' => $request->only('search'),
            'canManage' => in_array($role, ['admin', 'admin_manifest'], true),
            'pageTitle' => $role === 'pusat' ? 'Manifest Final' : 'Finalisasi Manifest',
        ]);
    }

    public function lock(Request $request, Package $package)
    {
        abort_unless(in_array($request->user()->role, ['admin', 'admin_manifest'], true), 403);

        DB::transaction(function () use ($request, $package) {
            $package = Package::whereKey($package->id)->lockForUpdate()->firstOrFail();
            abort_if($package->manifest_status === 'final', 422, 'Manifest paket ini sudah dikunci.');

            $snapshot = $this->buildSnapshot($package);
            abort_if(count($snapshot['jamaah']) === 0, 422, 'Manifest belum memiliki data jamaah.');

            $versionNumber = $package->manifest_version + 1;
            $version = ManifestVersion::create([
                'package_id' => $package->id,
                'version' => $versionNumber,
                'status' => 'final',
                'snapshot' => $snapshot,
                'jamaah_count' => count($snapshot['jamaah']),
                'finalized_by' => $request->user()->id,
                'finalized_at' => now(),
            ]);

            $package->update([
                'manifest_status' => 'final',
                'manifest_version' => $versionNumber,
                'manifest_locked_by' => $request->user()->id,
                'manifest_locked_at' => now(),
            ]);

            ManifestActivity::create([
                'package_id' => $package->id,
                'manifest_version_id' => $version->id,
                'user_id' => $request->user()->id,
                'action' => 'locked',
                'metadata' => ['jamaah_count' => count($snapshot['jamaah'])],
            ]);
        });

        return back()->with('success', 'Manifest berhasil dikunci dan menjadi versi final.');
    }

    public function unlock(Request $request, Package $package)
    {
        abort_unless(in_array($request->user()->role, ['admin', 'admin_manifest'], true), 403);
        $validated = $request->validate(['reason' => 'required|string|min:5|max:1000']);

        DB::transaction(function () use ($request, $package, $validated) {
            $package = Package::whereKey($package->id)->lockForUpdate()->firstOrFail();
            abort_unless($package->manifest_status === 'final', 422, 'Manifest belum berstatus final.');

            $version = ManifestVersion::where('package_id', $package->id)->where('status', 'final')->latest('version')->firstOrFail();
            $version->update([
                'status' => 'invalidated',
                'invalidated_by' => $request->user()->id,
                'invalidated_at' => now(),
                'invalidation_reason' => $validated['reason'],
            ]);

            $package->update([
                'manifest_status' => 'draft',
                'manifest_locked_by' => null,
                'manifest_locked_at' => null,
            ]);

            ManifestActivity::create([
                'package_id' => $package->id,
                'manifest_version_id' => $version->id,
                'user_id' => $request->user()->id,
                'action' => 'unlocked',
                'reason' => $validated['reason'],
            ]);
        });

        return back()->with('success', 'Kunci manifest berhasil dibuka. Versi sebelumnya ditandai tidak berlaku.');
    }

    public function download(Request $request, Package $package)
    {
        abort_unless(in_array($request->user()->role, ['admin', 'admin_manifest', 'pusat'], true), 403);
        abort_unless($package->manifest_status === 'final', 404, 'Manifest final tidak tersedia.');

        $version = ManifestVersion::where('package_id', $package->id)->where('status', 'final')->latest('version')->firstOrFail();
        $snapshot = $version->snapshot;
        $filename = 'manifest_'.preg_replace('/[^A-Za-z0-9_-]/', '_', $package->code ?: $package->name).'_v'.$version->version.'.xls';

        ManifestActivity::create([
            'package_id' => $package->id,
            'manifest_version_id' => $version->id,
            'user_id' => $request->user()->id,
            'action' => 'downloaded',
            'file_name' => $filename,
        ]);

        return response($this->renderExcel($snapshot))
            ->header('Content-Type', 'application/vnd.ms-excel; charset=UTF-8')
            ->header('Content-Disposition', "attachment; filename=\"{$filename}\"")
            ->header('Cache-Control', 'no-store, no-cache, must-revalidate');
    }

    private function buildSnapshot(Package $package): array
    {
        $bookings = $package->bookings()
            ->whereNotNull('jamaah_member_id')
            ->with(['jamaahMember.user.agent', 'order.agent'])
            ->get()
            ->unique('jamaah_member_id');

        $rows = $bookings->map(function ($booking) {
            $member = $booking->jamaahMember;
            $agent = $booking->order?->agent;
            if (!$agent && $member?->user) {
                $agent = $member->user->role === 'agen' ? $member->user : $member->user->agent;
            }

            return [
                'agent_name' => $agent?->name ?? 'Pusat/Mandiri',
                'name' => $member?->name,
                'sex' => $member?->jenis_kelamin === 'Laki-laki' ? 'L' : ($member?->jenis_kelamin === 'Perempuan' ? 'P' : '-'),
                'birth_date' => $member?->tgl_lahir,
                'birth_place' => $member?->tempat_lahir,
                'passport_number' => $member?->nomor_paspor,
                'passport_issued' => $member?->paspor_issued,
                'passport_expiry' => $member?->paspor_expiry,
                'passport_office' => $member?->paspor_office,
                'pp' => $member?->pp,
                'vm' => $member?->vm,
                'vp' => $member?->vp,
                'passport_file' => $member?->paspor_file,
                'vaccine_file' => $member?->vaksin_file,
            ];
        })->sortBy(fn ($row) => [$row['agent_name'], $row['name']])->values()->all();

        return [
            'package' => [
                'id' => $package->id,
                'code' => $package->code,
                'name' => $package->name,
                'departure_date' => optional($package->departure_date)->format('Y-m-d'),
            ],
            'jamaah' => $rows,
        ];
    }

    private function renderExcel(array $snapshot): string
    {
        $date = !empty($snapshot['package']['departure_date'])
            ? date('d/m/Y', strtotime($snapshot['package']['departure_date']))
            : '-';
        $escape = fn ($value) => htmlspecialchars((string) ($value ?? ''), ENT_QUOTES, 'UTF-8');
        $html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><style>table{border-collapse:collapse;font-family:Arial,sans-serif;font-size:12pt}th{background:#f2f2f2;font-weight:bold;text-align:center;border:1px solid #000;padding:5px;font-size:12pt}td{border:1px solid #000;padding:5px;vertical-align:middle;font-size:12pt}.center{text-align:center}.title{font-weight:bold;border:0;font-size:12pt}.blank{border:0}</style></head><body><table><tr><td class="title" colspan="16">Tanggal Keberangkatan: '.$escape($date).'</td></tr><tr><td class="blank" colspan="16">&nbsp;</td></tr><tr><th>No</th><th>Nama Agen (Urut)</th><th>Nama Lengkap</th><th>Sex</th><th>Age</th><th>Place</th><th>Date Birth</th><th>No Paspor</th><th>Issued</th><th>Expired</th><th>Office</th><th>PP</th><th>VM</th><th>VP</th><th>Link Paspor</th><th>Link Vaksin</th></tr>';
        $counters = [];
        foreach ($snapshot['jamaah'] as $index => $row) {
            $agent = $row['agent_name'] ?: 'Pusat/Mandiri';
            $counters[$agent] = ($counters[$agent] ?? 0) + 1;
            $birth = $row['birth_date'] ? date('d/m/Y', strtotime($row['birth_date'])) : '';
            $issued = $row['passport_issued'] ? date('d/m/Y', strtotime($row['passport_issued'])) : '';
            $expiry = $row['passport_expiry'] ? date('d/m/Y', strtotime($row['passport_expiry'])) : '';
            $age = $row['birth_date'] ? date_diff(date_create($row['birth_date']), date_create('today'))->y : '';
            $passportLink = $row['passport_file'] ? '<a href="'.$escape(asset('storage-file/'.$row['passport_file'])).'">Link Paspor</a>' : '-';
            $vaccineLink = $row['vaccine_file'] ? '<a href="'.$escape(asset('storage-file/'.$row['vaccine_file'])).'">Link Vaksin</a>' : '-';
            $html .= '<tr><td class="center">'.($index + 1).'</td><td>'.$escape($agent.' ('.$counters[$agent].')').'</td><td>'.$escape($row['name']).'</td><td class="center">'.$escape($row['sex']).'</td><td class="center">'.$escape($age).'</td><td>'.$escape($row['birth_place']).'</td><td class="center">'.$escape($birth).'</td><td>'.$escape($row['passport_number']).'</td><td class="center">'.$escape($issued).'</td><td class="center">'.$escape($expiry).'</td><td>'.$escape($row['passport_office']).'</td><td class="center">'.$escape($row['pp'] ?: '-').'</td><td class="center">'.$escape($row['vm'] ?: '-').'</td><td class="center">'.$escape($row['vp'] ?: '-').'</td><td class="center">'.$passportLink.'</td><td class="center">'.$vaccineLink.'</td></tr>';
        }

        return $html.'</table></body></html>';
    }
}
