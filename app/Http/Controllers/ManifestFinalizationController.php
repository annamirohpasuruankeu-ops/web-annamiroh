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
        $filename = 'manifest_'.preg_replace('/[^A-Za-z0-9_-]/', '_', $package->code ?: $package->name).'_v'.$version->version.'.xlsx';
        $temporary = tempnam(sys_get_temp_dir(), 'manifest_final_').'.xlsx';
        (new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($this->renderExcel($snapshot)))->save($temporary);

        ManifestActivity::create([
            'package_id' => $package->id,
            'manifest_version_id' => $version->id,
            'user_id' => $request->user()->id,
            'action' => 'downloaded',
            'file_name' => $filename,
        ]);

        return response()->download($temporary, $filename, [
            'Cache-Control' => 'no-store, no-cache, must-revalidate',
        ])->deleteFileAfterSend(true);
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
                'passport_second_file' => $member?->paspor_second_file,
                'vaccine_file' => $member?->vaksin_file,
                'ktp_file' => $member?->ktp_file,
                'kk_file' => $member?->kk_file,
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

    private function renderExcel(array $snapshot): \PhpOffice\PhpSpreadsheet\Spreadsheet
    {
        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Manifest Final');
        $date = !empty($snapshot['package']['departure_date'])
            ? date('d/m/Y', strtotime($snapshot['package']['departure_date']))
            : '-';
        $sheet->mergeCells('A1:S1');
        $sheet->setCellValue('A1', 'Tanggal Keberangkatan: '.$date);
        $headers = ['No', 'Nama Agen (Urut)', 'Nama Lengkap', 'Sex', 'Age', 'Place', 'Date Birth', 'No Paspor', 'Issued', 'Expired', 'Office', 'PP', 'VM', 'VP', 'Paspor Utama', 'Paspor Lembar 2', 'Vaksin', 'KTP', 'KK'];
        $sheet->fromArray($headers, null, 'A3');
        $counters = [];
        foreach ($snapshot['jamaah'] as $index => $row) {
            $agent = $row['agent_name'] ?: 'Pusat/Mandiri';
            $counters[$agent] = ($counters[$agent] ?? 0) + 1;
            $birth = $row['birth_date'] ? date('d/m/Y', strtotime($row['birth_date'])) : '';
            $issued = $row['passport_issued'] ? date('d/m/Y', strtotime($row['passport_issued'])) : '';
            $expiry = $row['passport_expiry'] ? date('d/m/Y', strtotime($row['passport_expiry'])) : '';
            $age = $row['birth_date'] ? date_diff(date_create($row['birth_date']), date_create('today'))->y : '';
            $excelRow = $index + 4;
            $sheet->fromArray([
                $index + 1, $agent.' ('.$counters[$agent].')', $row['name'], $row['sex'], $age,
                $row['birth_place'], $birth, $row['passport_number'], $issued, $expiry,
                $row['passport_office'], $row['pp'] ?: '-', $row['vm'] ?: '-', $row['vp'] ?: '-',
                '-', '-', '-', '-', '-',
            ], null, 'A'.$excelRow);
            $documents = [
                'O' => $row['passport_file'] ?? null,
                'P' => $row['passport_second_file'] ?? null,
                'Q' => $row['vaccine_file'] ?? null,
                'R' => $row['ktp_file'] ?? null,
                'S' => $row['kk_file'] ?? null,
            ];
            foreach ($documents as $column => $path) {
                if (!$path) {
                    continue;
                }
                $cell = $sheet->getCell($column.$excelRow);
                $cell->setValue('Buka Berkas');
                $cell->getHyperlink()->setUrl(asset('storage-file/'.$path));
                $sheet->getStyle($column.$excelRow)->getFont()->setUnderline(true)->getColor()->setRGB('0563C1');
            }
        }
        $lastRow = max(3, count($snapshot['jamaah']) + 3);
        $sheet->getStyle('A1:S'.$lastRow)->getFont()->setName('Arial')->setSize(12);
        $sheet->getStyle('A3:S3')->getFont()->setBold(true);
        $sheet->getStyle('A3:S'.$lastRow)->getBorders()->getAllBorders()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);
        $sheet->getStyle('A3:S3')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setRGB('F2F2F2');
        foreach (range('A', 'S') as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }

        return $spreadsheet;
    }
}
