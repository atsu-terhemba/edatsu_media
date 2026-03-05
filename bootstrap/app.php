<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Session\TokenMismatchException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\TrackUserActivity::class,
        ]);
        //...
        // Register role middleware as an alias for use in routes
        $middleware->alias([
            'role' => \App\Http\Middleware\Role::class,
        ]);
        
        // Register role middleware as an alias for use in routes
        $middleware->alias([
            'role' => \App\Http\Middleware\Role::class,
        ]);
        //...
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (TokenMismatchException $e, $request) {
            if ($request->expectsJson() || $request->header('X-Inertia')) {
                return response()->json([
                    'message' => 'Your session has expired. Please refresh the page.',
                ], 419);
            }

            return response()->view('errors.419', [], 419);
        });
    })->create();
