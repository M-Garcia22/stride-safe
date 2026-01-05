<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    // TODO: come back to this after finishing the frontend
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'user_type' => 'required|in:track,trainer,vet',
            'organization' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'license_number' => 'nullable|string|max:100',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'user_type' => $validated['user_type'],
            'organization' => $validated['organization'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'license_number' => $validated['license_number'] ?? null,
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'userType' => $user->user_type,
                'organization' => $user->organization,
            ],
            'token' => $token,
        ], 201);
    }

    /**
     * Login user and create token
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($validated)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user = User::where('email', $validated['email'])->firstOrFail();
        
        // TODO: ask Matt about this
        // Revoke previous tokens (keeping it for now to prevent multiple logins, I'll ask Matt about this)
        $user->tokens()->delete();
        
        $token = $user->createToken('auth-token')->plainTextToken;

        // Use demo trainer name if demo mode is enabled for trainer accounts
        $displayName = $this->getDisplayName($user);

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $displayName,
                'email' => $user->email,
                'userType' => $user->user_type,
                'organization' => $user->organization,
            ],
            'token' => $token,
        ]);
    }

    /**
     * Logout user (revoke token)
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    /**
     * Get current authenticated user
     */
    public function user(Request $request)
    {
        $user = $request->user();
        $displayName = $this->getDisplayName($user);

        return response()->json([
            'id' => $user->id,
            'name' => $displayName,
            'email' => $user->email,
            'userType' => $user->user_type,
            'organization' => $user->organization,
        ]);
    }

    /**
     * Get display name for user (uses demo config for trainers in demo mode)
     */
    private function getDisplayName(User $user): string
    {
        // If demo mode is enabled and user is a trainer, use the demo trainer name
        if (config('demo.enabled', false) && $user->user_type === 'trainer') {
            return config('demo.trainer_name', $user->name);
        }

        return $user->name;
    }
}

