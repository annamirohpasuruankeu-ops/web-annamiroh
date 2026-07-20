<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'agent_code',
        'agent_id',
        'is_active',
        'password_changed',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'password_changed' => 'boolean',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public static function normalizePhone(?string $phone): string
    {
        $digits = preg_replace('/\D+/', '', (string) $phone) ?? '';

        if (str_starts_with($digits, '62')) {
            return '0'.substr($digits, 2);
        }

        if (str_starts_with($digits, '8')) {
            return '0'.$digits;
        }

        return $digits;
    }

    public static function nextAgentCode(string $prefix): string
    {
        $prefix = strtolower($prefix);
        $codes = static::where('role', 'agen')
            ->where('agent_code', 'like', $prefix.'%')
            ->lockForUpdate()
            ->pluck('agent_code');

        $highest = $codes->reduce(function (int $max, ?string $code) use ($prefix) {
            if ($code && preg_match('/^'.preg_quote($prefix, '/').'(\d+)$/i', $code, $matches)) {
                return max($max, (int) $matches[1]);
            }

            return $max;
        }, 0);

        return $prefix.str_pad((string) ($highest + 1), 3, '0', STR_PAD_LEFT);
    }

    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    public function jamaah()
    {
        return $this->hasMany(User::class, 'agent_id');
    }

    public function profile()
    {
        return $this->hasOne(JamaahProfile::class);
    }
    
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function jamaahMembers()
    {
        return $this->hasMany(JamaahMember::class);
    }

    public function agentJamaahMembers()
    {
        return $this->hasManyThrough(
            JamaahMember::class,
            User::class,
            'agent_id',
            'user_id',
            'id',
            'id'
        );
    }

    public function financeRecords()
    {
        return $this->hasMany(FinanceRecord::class, 'agent_id');
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class, 'agent_id');
    }
}
