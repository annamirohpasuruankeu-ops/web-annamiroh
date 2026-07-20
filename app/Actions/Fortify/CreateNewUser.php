<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        $input['no_wa'] = User::normalizePhone($input['no_wa'] ?? '');

        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'no_wa' => [
                'required',
                'string',
                function (string $attribute, mixed $value, \Closure $fail) {
                    if (User::whereHas('profile', fn ($query) => $query->where('no_wa', $value))->exists()) {
                        $fail('Nomor HP sudah digunakan oleh akun lain.');
                    }
                },
            ],
            'tempat_lahir' => ['required', 'string', 'max:100'],
            'tgl_lahir' => ['required', 'date'],
            'alamat' => ['required', 'string'],
            'role' => ['sometimes', 'string', 'in:user,agen'],
        ])->validate();

        $role = isset($input['role']) && in_array($input['role'], ['user', 'agen'])
            ? $input['role']
            : 'user';

        return DB::transaction(function () use ($input, $role) {
            $user = User::create([
                'name' => $input['name'],
                'email' => $input['email'],
                'password' => $input['password'],
                'role' => $role,
                'agent_code' => $role === 'agen' ? User::nextAgentCode('r') : null,
                'is_active' => $role !== 'agen',
                // Self-registered agents chose their own password.
                'password_changed' => true,
            ]);

            $user->profile()->create([
                'no_wa' => User::normalizePhone($input['no_wa']),
                'tempat_lahir' => $input['tempat_lahir'],
                'tgl_lahir' => $input['tgl_lahir'],
                'alamat' => $input['alamat'],
            ]);

            return $user;
        });
    }
}
