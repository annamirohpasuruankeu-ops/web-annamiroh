<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
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
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'no_wa' => ['required', 'string', 'max:20'],
            'tempat_lahir' => ['required', 'string', 'max:100'],
            'tgl_lahir' => ['required', 'date'],
            'alamat' => ['required', 'string'],
            'role' => ['sometimes', 'string', 'in:user,agen'],
        ])->validate();

        $role = isset($input['role']) && in_array($input['role'], ['user', 'agen'])
            ? $input['role']
            : 'user';

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
            'role' => $role,
            'is_active' => $role === 'agen' ? false : true,
        ]);

        $user->profile()->create([
            'no_wa' => $input['no_wa'],
            'tempat_lahir' => $input['tempat_lahir'],
            'tgl_lahir' => $input['tgl_lahir'],
            'alamat' => $input['alamat'],
        ]);

        return $user;
    }
}
