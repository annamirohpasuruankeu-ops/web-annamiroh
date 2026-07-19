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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('package_id')->constrained()->cascadeOnDelete();
            $table->foreignId('agent_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete(); // Associated group user account
            $table->integer('total_pax')->default(1);
            $table->text('keterangan')->nullable();
            $table->string('status_kunci')->default('open'); // open, locked
            $table->timestamps();
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->foreignId('order_id')->nullable()->constrained('orders')->nullOnDelete();
        });

        Schema::table('jamaah_members', function (Blueprint $table) {
            $table->string('nomor_paspor')->nullable();
            $table->date('paspor_issued')->nullable();
            $table->date('paspor_expiry')->nullable();
            $table->string('paspor_office')->nullable();
            $table->string('pp')->nullable();
            $table->string('vm')->nullable();
            $table->string('vp')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jamaah_members', function (Blueprint $table) {
            $table->dropColumn(['nomor_paspor', 'paspor_issued', 'paspor_expiry', 'paspor_office', 'pp', 'vm', 'vp']);
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->dropForeign(['order_id']);
            $table->dropColumn('order_id');
        });

        Schema::dropIfExists('orders');
    }
};
