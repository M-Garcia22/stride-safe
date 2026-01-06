<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Response;

// Serve the React SPA for all non-API routes
Route::get('/{any?}', function () {
    $path = public_path('index.html');
    
    if (!file_exists($path)) {
        return response()->json(['error' => 'Frontend not built - index.html not found'], 500);
    }
    
    return Response::make(file_get_contents($path), 200, [
        'Content-Type' => 'text/html',
    ]);
})->where('any', '^(?!api).*$');

require __DIR__.'/auth.php';
