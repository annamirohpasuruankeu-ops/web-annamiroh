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
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('program_days');
            $table->date('departure_date');
            $table->string('airline');
            $table->string('airline_route')->nullable();
            $table->decimal('price', 15, 2);
            $table->string('hotel_makkah');
            $table->string('hotel_madinah');
            $table->json('included')->nullable();
            $table->json('not_included')->nullable();
            $table->json('bonus')->nullable();
            $table->integer('total_seats');
            $table->integer('available_seats');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};
