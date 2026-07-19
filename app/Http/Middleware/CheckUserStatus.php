<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckUserStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check() && !Auth::user()->is_active) {
            $role = Auth::user()->role;
            Auth::logout();

            $request->session()->invalidate();
            $request->session()->regenerateToken();

            $message = $role === 'agen'
                ? 'Pendaftaran Anda sebagai Agen berhasil. Silakan tunggu persetujuan Admin sebelum masuk.'
                : 'Akun Anda telah dinonaktifkan. Silakan hubungi admin.';

            return redirect()->route('login')->with('status', $message);
        }

        return $next($request);
    }
}
