<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Laravel\Fortify\Fortify;
use Laravel\Fortify\Contracts\LoginResponse;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureActions();
        $this->configureViews();
        $this->configureRateLimiting();

        Fortify::authenticateUsing(function (Request $request) {
            $loginInput = trim((string) $request->email);
            $phone = User::normalizePhone($loginInput);

            $query = User::whereRaw('LOWER(email) = ?', [strtolower($loginInput)]);

            if (!str_contains($loginInput, '@') && $phone !== '') {
                $query->orWhereHas('profile', function ($q) use ($phone) {
                    $q->where('no_wa', $phone);
                });
            }

            $user = $query->first();

            if ($user && \Illuminate\Support\Facades\Hash::check($request->password, $user->password)) {
                if (!$user->is_active) {
                    throw \Illuminate\Validation\ValidationException::withMessages([
                        Fortify::username() => [$user->role === 'agen' 
                            ? 'Pendaftaran Anda sebagai Agen berhasil. Silakan tunggu persetujuan Admin sebelum masuk.'
                            : 'Akun Anda telah dinonaktifkan. Silakan hubungi admin.'],
                    ]);
                }
                return $user;
            }
        });

        $this->app->singleton(LoginResponse::class, function () {
            return new class implements LoginResponse {
                public function toResponse($request)
                {
                    $role = Auth::user()->role;
                    $packageId = $request->input('package_id');
                    
                    if ($role === 'user' && $packageId) {
                        return redirect('/dashboard?book_package_id=' . $packageId);
                    }

                    if ($role === 'agen' && !Auth::user()->password_changed) {
                        return redirect()->route('password-reminder');
                    }
                    
                    $home = in_array($role, ['admin', 'pusat', 'admin_paket', 'admin_manifest', 'admin_keuangan', 'agen']) ? '/admin' : '/dashboard';
                    
                    return redirect()->intended($home);
                }
            };
        });

        $this->app->singleton(\Laravel\Fortify\Contracts\RegisterResponse::class, function () {
            return new class implements \Laravel\Fortify\Contracts\RegisterResponse {
                public function toResponse($request)
                {
                    $user = Auth::user();
                    if ($user && !$user->is_active) {
                        Auth::logout();
                        $request->session()->invalidate();
                        $request->session()->regenerateToken();

                        return redirect()->route('login')->withErrors([
                            'email' => $user->role === 'agen' 
                                ? 'Pendaftaran Anda sebagai Agen berhasil. Silakan tunggu persetujuan Admin sebelum masuk.'
                                : 'Akun Anda telah dinonaktifkan. Silakan hubungi admin.'
                        ]);
                    }

                    $role = $user->role;
                    $packageId = $request->input('package_id');
                    
                    if ($role === 'user' && $packageId) {
                        return redirect('/dashboard?book_package_id=' . $packageId);
                    }
                    
                    $home = in_array($role, ['admin', 'pusat', 'admin_paket', 'admin_manifest', 'admin_keuangan', 'agen']) ? '/admin' : '/dashboard';
                    
                    return redirect($home);
                }
            };
        });
    }

    /**
     * Configure Fortify actions.
     */
    private function configureActions(): void
    {
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        Fortify::createUsersUsing(CreateNewUser::class);
    }

    /**
     * Configure Fortify views.
     */
    private function configureViews(): void
    {
        Fortify::loginView(fn (Request $request) => Inertia::render('auth/login', [
            'canResetPassword' => Features::enabled(Features::resetPasswords()),
            'status' => $request->session()->get('status'),
        ]));

        Fortify::resetPasswordView(fn (Request $request) => Inertia::render('auth/reset-password', [
            'email' => $request->email,
            'token' => $request->route('token'),
            'passwordRules' => Password::defaults()->toPasswordRulesString(),
        ]));

        Fortify::requestPasswordResetLinkView(fn (Request $request) => Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::verifyEmailView(fn (Request $request) => Inertia::render('auth/verify-email', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::registerView(fn () => Inertia::render('auth/register', [
            'passwordRules' => Password::defaults()->toPasswordRulesString(),
            'packages' => \App\Models\Package::where('is_active', true)->get(),
        ]));

        Fortify::twoFactorChallengeView(fn () => Inertia::render('auth/two-factor-challenge'));

        Fortify::confirmPasswordView(fn () => Inertia::render('auth/confirm-password'));
    }

    /**
     * Configure rate limiting.
     */
    private function configureRateLimiting(): void
    {
        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });

        RateLimiter::for('passkeys', function (Request $request) {
            return Limit::perMinute(10)->by(
                ($request->input('credential.id') ?: $request->session()->getId()).'|'.$request->ip(),
            );
        });
    }
}
