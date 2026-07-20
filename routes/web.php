<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PublicPackageController;
use Illuminate\Support\Facades\Storage;

// Fallback file publik untuk hosting yang tidak mendukung symbolic link.
// Jika storage-file berhasil menjadi link, web server akan melayani file secara langsung.
Route::get('/storage-file/{path}', function (string $path) {
    abort_if(str_contains($path, '..') || !Storage::disk('public')->exists($path), 404);

    return Storage::disk('public')->response($path);
})->where('path', '.*');

Route::get('/kategori-program/umroh-reguler', [PublicPackageController::class, 'index'])->name('packages.reguler');
Route::get('/paket-umroh/{package}', [PublicPackageController::class, 'show'])->name('packages.show');

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/register-agent', function () {
    return Inertia\Inertia::render('auth/register', [
        'passwordRules' => \Illuminate\Validation\Rules\Password::defaults()->toPasswordRulesString(),
        'registerAsAgent' => true,
        'packages' => \App\Models\Package::where('is_active', true)->get(),
    ]);
})->middleware('guest');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('dashboard/documents', [DashboardController::class, 'uploadDocuments'])->name('dashboard.documents');
    Route::post('dashboard/members', [DashboardController::class, 'storeJamaahMember'])->name('dashboard.members.store');
    Route::put('dashboard/members/{id}', [DashboardController::class, 'updateJamaahMember'])->name('dashboard.members.update');
    Route::post('dashboard/members/{id}/documents', [DashboardController::class, 'uploadMemberDocument'])->name('dashboard.members.documents');
    Route::post('dashboard/bookings', [DashboardController::class, 'storeBooking'])->name('dashboard.bookings.store');
    
    // Admin Routes
    Route::get('admin', [App\Http\Controllers\AdminController::class, 'index'])->name('admin.index');
    Route::get('admin/orders', [App\Http\Controllers\AdminController::class, 'orders'])->name('admin.orders');
    
    Route::post('admin/orders', [App\Http\Controllers\AdminController::class, 'storeOrder'])->name('admin.orders.store');
    Route::put('admin/orders/{id}', [App\Http\Controllers\AdminController::class, 'updateOrder'])->name('admin.orders.update');
    Route::patch('admin/orders/{id}/toggle-lock', [App\Http\Controllers\AdminController::class, 'toggleOrderLock'])->name('admin.orders.toggle-lock');
    Route::get('admin/orders/{id}/isi-jamaah', [App\Http\Controllers\AdminController::class, 'isiJamaah'])->name('admin.orders.isi-jamaah');
    Route::post('admin/orders/{id}/save-jamaah', [App\Http\Controllers\AdminController::class, 'saveJamaahGrid'])->name('admin.orders.save-jamaah');

    Route::get('admin/packages', [App\Http\Controllers\AdminController::class, 'packages'])->name('admin.packages');
    Route::post('admin/packages', [App\Http\Controllers\AdminController::class, 'storePackage'])->name('admin.packages.store');
    Route::put('admin/packages/{id}', [App\Http\Controllers\AdminController::class, 'updatePackage'])->name('admin.packages.update');
    
    Route::get('admin/agents', [App\Http\Controllers\AdminController::class, 'agents'])->name('admin.agents');
    Route::post('admin/agents', [App\Http\Controllers\AdminController::class, 'storeAgent'])->name('admin.agents.store');
    Route::put('admin/agents/{id}', [App\Http\Controllers\AdminController::class, 'updateAgent'])->name('admin.agents.update');
    Route::post('admin/agents/import', [App\Http\Controllers\AdminController::class, 'importAgents'])->name('admin.agents.import');

    Route::get('admin/jamaah', [App\Http\Controllers\AdminController::class, 'jamaah'])->name('admin.jamaah');
    Route::get('admin/jamaah/export', [App\Http\Controllers\AdminController::class, 'exportJamaah'])->name('admin.jamaah.export');
    Route::post('admin/jamaah/import', [App\Http\Controllers\AdminController::class, 'importJamaah'])->name('admin.jamaah.import');
    Route::get('admin/jamaah-database', [App\Http\Controllers\AdminController::class, 'jamaahDatabase'])->name('admin.jamaah-database');
    Route::get('admin/jamaah/{id}/members', [App\Http\Controllers\AdminController::class, 'manageMembers'])->name('admin.jamaah.members');
    Route::post('admin/jamaah', [App\Http\Controllers\AdminController::class, 'storeJamaah'])->name('admin.jamaah.store');
    Route::post('admin/jamaah/{id}', [App\Http\Controllers\AdminController::class, 'updateJamaah'])->name('admin.jamaah.update');
    Route::post('admin/jamaah/{id}/members', [App\Http\Controllers\AdminController::class, 'storeMember'])->name('admin.jamaah.members.store');
    Route::post('admin/members/{id}/documents', [App\Http\Controllers\AdminController::class, 'uploadMemberDocument'])->name('admin.members.documents');
    
    Route::get('admin/bookings', [App\Http\Controllers\AdminController::class, 'bookings'])->name('admin.bookings');
    Route::put('admin/bookings/{id}', [App\Http\Controllers\AdminController::class, 'updateBooking'])->name('admin.bookings.update');
    Route::patch('admin/bookings/{id}/toggle-seat', [App\Http\Controllers\AdminController::class, 'toggleBookingSeat'])->name('admin.bookings.toggle-seat');
    Route::get('admin/bookings/{id}/invoice', [App\Http\Controllers\AdminController::class, 'invoice'])->name('admin.bookings.invoice');
    Route::get('admin/bookings/{id}/registration-form', [App\Http\Controllers\AdminController::class, 'registrationForm'])->name('admin.bookings.registration-form');
    Route::post('admin/bookings/{id}/move-package', [App\Http\Controllers\AdminController::class, 'moveBookingPackage'])->name('admin.bookings.move-package');
    Route::get('admin/jamaah-members/search', [App\Http\Controllers\AdminController::class, 'searchJamaahMembers'])->name('admin.jamaah-members.search');
    Route::post('admin/assign-jamaah', [App\Http\Controllers\AdminController::class, 'assignJamaah'])->name('admin.assign');
    Route::delete('admin/remove-jamaah/{id}', [App\Http\Controllers\AdminController::class, 'removeJamaah'])->name('admin.remove');
    Route::patch('admin/users/{id}/toggle-status', [App\Http\Controllers\AdminController::class, 'toggleUserStatus'])->name('admin.users.toggle-status');
    
    // Financial Reports
    Route::get('admin/reports/financial', [App\Http\Controllers\AdminController::class, 'financialReport'])->name('admin.reports.financial');
    Route::get('admin/reports/financial/export', [App\Http\Controllers\AdminController::class, 'exportFinancialReport'])->name('admin.reports.financial.export');

    // Financial Management (Keuangan)
    Route::get('admin/finance', [App\Http\Controllers\FinanceController::class, 'index'])->name('admin.finance.index');
    Route::post('admin/finance', [App\Http\Controllers\FinanceController::class, 'store'])->name('admin.finance.store');
    Route::put('admin/finance/{id}', [App\Http\Controllers\FinanceController::class, 'update'])->name('admin.finance.update');
    Route::delete('admin/finance/{id}', [App\Http\Controllers\FinanceController::class, 'destroy'])->name('admin.finance.destroy');
    Route::post('admin/finance/import', [App\Http\Controllers\FinanceController::class, 'import'])->name('admin.finance.import');

    // Invoice Management (Tagihan)
    Route::get('admin/invoices', [App\Http\Controllers\InvoiceController::class, 'index'])->name('admin.invoices.index');
    Route::post('admin/invoices/import', [App\Http\Controllers\InvoiceController::class, 'import'])->name('admin.invoices.import');

    // Popup Promo Routes
    Route::get('admin/popup-promos', [App\Http\Controllers\AdminController::class, 'popupPromos'])->name('admin.popup-promos');
    Route::post('admin/popup-promos', [App\Http\Controllers\AdminController::class, 'storePopupPromo'])->name('admin.popup-promos.store');
    Route::put('admin/popup-promos/{id}', [App\Http\Controllers\AdminController::class, 'updatePopupPromo'])->name('admin.popup-promos.update');
    Route::patch('admin/popup-promos/{id}/toggle', [App\Http\Controllers\AdminController::class, 'togglePopupPromo'])->name('admin.popup-promos.toggle');

    // Gallery Routes
    Route::get('admin/galleries', [App\Http\Controllers\AdminController::class, 'galleries'])->name('admin.galleries');
    Route::post('admin/galleries', [App\Http\Controllers\AdminController::class, 'storeGallery'])->name('admin.galleries.store');
    Route::put('admin/galleries/{id}', [App\Http\Controllers\AdminController::class, 'updateGallery'])->name('admin.galleries.update');
    Route::patch('admin/galleries/{id}/toggle', [App\Http\Controllers\AdminController::class, 'toggleGallery'])->name('admin.galleries.toggle');
    Route::delete('admin/galleries/{id}', [App\Http\Controllers\AdminController::class, 'destroyGallery'])->name('admin.galleries.destroy');

    // Passport Recommendation Routes
    Route::get('admin/recommendations', [App\Http\Controllers\RecommendationController::class, 'index'])->name('admin.recommendations.index');
    Route::post('admin/recommendations', [App\Http\Controllers\RecommendationController::class, 'store'])->name('admin.recommendations.store');
    Route::post('admin/recommendations/{id}/approve', [App\Http\Controllers\RecommendationController::class, 'approve'])->name('admin.recommendations.approve');
    Route::post('admin/recommendations/{id}/reject', [App\Http\Controllers\RecommendationController::class, 'reject'])->name('admin.recommendations.reject');
    Route::get('admin/recommendations/search-jamaah', [App\Http\Controllers\RecommendationController::class, 'searchJamaah'])->name('admin.recommendations.search-jamaah');
    Route::get('admin/recommendations/{id}/print', [App\Http\Controllers\RecommendationController::class, 'print'])->name('admin.recommendations.print');
});

require __DIR__.'/settings.php';
