<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class MaintenanceController extends Controller
{
    /**
     * Clear all cache, logs, and perform Laravel cleaning operations
     */
    public function clearData(Request $request)
    {
        try {
            $results = [];

            // 1. Clear application cache
            Artisan::call('cache:clear');
            $results[] = '✓ Application cache cleared';

            // 2. Clear route cache
            Artisan::call('route:clear');
            $results[] = '✓ Route cache cleared';

            // 3. Clear config cache
            Artisan::call('config:clear');
            $results[] = '✓ Config cache cleared';

            // 4. Clear view cache
            Artisan::call('view:clear');
            $results[] = '✓ View cache cleared';

            // 5. Clear compiled classes
            Artisan::call('clear-compiled');
            $results[] = '✓ Compiled classes cleared';

            // 6. Clear event cache
            Artisan::call('event:clear');
            $results[] = '✓ Event cache cleared';

            // 7. Clear all cache (Redis, Memcached, etc.)
            Cache::flush();
            $results[] = '✓ All cache stores flushed';

            // 8. Clear logs
            $logPath = storage_path('logs');
            if (File::exists($logPath)) {
                $logFiles = File::files($logPath);
                foreach ($logFiles as $file) {
                    if (File::extension($file) === 'log') {
                        File::delete($file);
                    }
                }
                $results[] = '✓ Log files cleared (' . count($logFiles) . ' files)';
            }

            // 9. Clear bootstrap cache
            $bootstrapCache = base_path('bootstrap/cache');
            if (File::exists($bootstrapCache)) {
                $cacheFiles = File::files($bootstrapCache);
                foreach ($cacheFiles as $file) {
                    // Keep .gitignore
                    if (basename($file) !== '.gitignore') {
                        File::delete($file);
                    }
                }
                $results[] = '✓ Bootstrap cache cleared';
            }

            // 10. Clear session data (optional - be careful with this)
            // Artisan::call('session:clear');
            // $results[] = '✓ Session data cleared';

            // 11. Optimize after clearing
            Artisan::call('optimize:clear');
            $results[] = '✓ All optimizations cleared';

            // 12. Re-cache config for production
            if (config('app.env') === 'production') {
                Artisan::call('config:cache');
                Artisan::call('route:cache');
                Artisan::call('view:cache');
                $results[] = '✓ Caches rebuilt for production';
            }

            Log::info('System data cleared successfully', ['results' => $results]);

            return response()->json([
                'success' => true,
                'message' => 'All data cleared successfully!',
                'details' => $results,
                'timestamp' => now()->toDateTimeString()
            ]);

        } catch (\Exception $e) {
            Log::error('Error clearing system data: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error clearing data: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Clear only cache (lighter version)
     */
    public function clearCacheOnly(Request $request)
    {
        try {
            Artisan::call('cache:clear');
            Artisan::call('config:clear');
            Artisan::call('route:clear');
            Artisan::call('view:clear');
            Cache::flush();

            return response()->json([
                'success' => true,
                'message' => 'Cache cleared successfully!',
                'timestamp' => now()->toDateTimeString()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error clearing cache: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Clear only logs
     */
    public function clearLogsOnly(Request $request)
    {
        try {
            $logPath = storage_path('logs');
            $count = 0;

            if (File::exists($logPath)) {
                $logFiles = File::files($logPath);
                foreach ($logFiles as $file) {
                    if (File::extension($file) === 'log') {
                        File::delete($file);
                        $count++;
                    }
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Logs cleared successfully!',
                'files_deleted' => $count,
                'timestamp' => now()->toDateTimeString()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error clearing logs: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get system info
     */
    public function getSystemInfo(Request $request)
    {
        try {
            $logPath = storage_path('logs');
            $logSize = 0;
            $logCount = 0;

            if (File::exists($logPath)) {
                $logFiles = File::files($logPath);
                foreach ($logFiles as $file) {
                    if (File::extension($file) === 'log') {
                        $logSize += File::size($file);
                        $logCount++;
                    }
                }
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'environment' => config('app.env'),
                    'debug_mode' => config('app.debug'),
                    'cache_driver' => config('cache.default'),
                    'log_files_count' => $logCount,
                    'log_files_size' => $this->formatBytes($logSize),
                    'storage_path' => storage_path(),
                    'bootstrap_cache_path' => base_path('bootstrap/cache'),
                    'timestamp' => now()->toDateTimeString()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error getting system info: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Format bytes to human readable size
     */
    private function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        for ($i = 0; $bytes > 1024; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, $precision) . ' ' . $units[$i];
    }
}
