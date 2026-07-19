<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasColumn('packages', 'code')) {
            Schema::table('packages', function (Blueprint $table) {
                $table->string('code')->nullable()->after('id');
            });
        }

        // Seed the default package
        \App\Models\Package::firstOrCreate(
            ['code' => 'BELUM_ATUR_JADWAL'],
            [
                'name' => 'Belum Atur Jadwal',
                'program_days' => 0,
                'departure_date' => '3000-01-01',
                'airline' => '-',
                'price' => 0,
                'hotel_makkah' => '-',
                'hotel_madinah' => '-',
                'total_seats' => 99999,
                'available_seats' => 99999,
                'is_active' => true,
            ]
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->dropColumn('code');
        });
    }
};
