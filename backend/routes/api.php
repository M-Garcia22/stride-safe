<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\HorseController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\VelocityController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes (no auth required)
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Protected Routes (auth required)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Reports - Trainer
    Route::get('/reports/trainer', [ReportController::class, 'trainerReports']);
    
    // Reports - Track Officials
    Route::get('/reports/all', [ReportController::class, 'allReports']);
    
    // Horses - Trainer
    Route::get('/horses/trainer', [HorseController::class, 'trainerHorses']);
    Route::get('/horses/stable', [HorseController::class, 'trainerStable']);
    
    // Velocity data for race analysis
    Route::get('/velocity/{entryCode}', [VelocityController::class, 'show']);
});
