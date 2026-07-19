<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->boolean('is_seat_reduced')->default(false);
        });

        // Update existing bookings where status_dokumen is 'lengkap' to be true
        DB::table('bookings')
            ->where('status_dokumen', 'lengkap')
            ->update(['is_seat_reduced' => true]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn('is_seat_reduced');
        });
    }
};
