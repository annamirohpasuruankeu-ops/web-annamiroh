<?php

namespace App\Support;

use App\Models\JamaahMember;
use App\Models\Package;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ManifestLock
{
    public static function ensurePackageEditable(Package|int|null $package): void
    {
        if (!$package) {
            return;
        }

        $package = $package instanceof Package ? $package : Package::find($package);

        if ($package?->manifest_status === 'final') {
            throw new HttpException(423, 'Manifest paket ini sudah final dan dikunci. Buka kunci manifest terlebih dahulu.');
        }
    }

    public static function ensureMemberEditable(JamaahMember|int $member): void
    {
        $member = $member instanceof JamaahMember ? $member : JamaahMember::findOrFail($member);

        $lockedPackage = $member->bookings()
            ->whereHas('package', fn ($query) => $query->where('manifest_status', 'final'))
            ->with('package:id,name')
            ->first()?->package;

        if ($lockedPackage) {
            throw new HttpException(423, "Data jamaah termasuk dalam manifest final paket {$lockedPackage->name}.");
        }
    }
}
