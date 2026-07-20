<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE users MODIFY role ENUM('pusat','admin','admin_paket','admin_manifest','admin_keuangan','agen','user') NOT NULL DEFAULT 'user'");
        }

        Schema::table('packages', function (Blueprint $table) {
            $table->string('manifest_status', 20)->default('draft')->after('is_active');
            $table->unsignedInteger('manifest_version')->default(0)->after('manifest_status');
            $table->foreignId('manifest_locked_by')->nullable()->after('manifest_version')->constrained('users')->nullOnDelete();
            $table->timestamp('manifest_locked_at')->nullable()->after('manifest_locked_by');
        });

        Schema::create('manifest_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('package_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('version');
            $table->string('status', 20)->default('final');
            $table->json('snapshot');
            $table->unsignedInteger('jamaah_count')->default(0);
            $table->foreignId('finalized_by')->constrained('users')->restrictOnDelete();
            $table->timestamp('finalized_at');
            $table->foreignId('invalidated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('invalidated_at')->nullable();
            $table->text('invalidation_reason')->nullable();
            $table->timestamps();

            $table->unique(['package_id', 'version']);
        });

        Schema::create('manifest_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('package_id')->constrained()->cascadeOnDelete();
            $table->foreignId('manifest_version_id')->nullable()->constrained('manifest_versions')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->restrictOnDelete();
            $table->string('action', 30);
            $table->text('reason')->nullable();
            $table->string('file_name')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('manifest_activities');
        Schema::dropIfExists('manifest_versions');

        Schema::table('packages', function (Blueprint $table) {
            $table->dropForeign(['manifest_locked_by']);
            $table->dropColumn(['manifest_status', 'manifest_version', 'manifest_locked_by', 'manifest_locked_at']);
        });

        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE users MODIFY role ENUM('pusat','admin','agen','user') NOT NULL DEFAULT 'user'");
        }
    }
};
