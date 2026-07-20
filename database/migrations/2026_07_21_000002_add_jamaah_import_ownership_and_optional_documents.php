<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('jamaah_members', function (Blueprint $table) {
            $table->string('paspor_second_file')->nullable()->after('paspor_file');
            $table->foreignId('imported_by')->nullable()->after('user_id')->constrained('users')->nullOnDelete();
            $table->string('import_agent_name')->nullable()->after('imported_by');
            $table->uuid('import_batch')->nullable()->after('import_agent_name')->index();
        });
    }

    public function down(): void
    {
        Schema::table('jamaah_members', function (Blueprint $table) {
            $table->dropForeign(['imported_by']);
            $table->dropIndex(['import_batch']);
            $table->dropColumn(['paspor_second_file', 'imported_by', 'import_agent_name', 'import_batch']);
        });
    }
};
