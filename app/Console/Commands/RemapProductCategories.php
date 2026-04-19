<?php

namespace App\Console\Commands;

use App\Models\ProductCategory;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class RemapProductCategories extends Command
{
    protected $signature = 'categories:remap {--dry-run : Preview changes without writing}';
    protected $description = 'Remap category_selections from old retired product categories to the new AI-focused taxonomy';

    // Old slug (retired) => New slug (active)
    private array $map = [
        'project-management-tools'                => 'project-management',
        'workflow-automation-tools'               => 'automation-workflow',
        'time-tracking-productivity-tools'        => 'project-management',
        'document-management-systems'             => 'knowledge-management',
        'knowledge-base-documentation-tools'      => 'knowledge-management',
        'remote-work-virtual-office-platforms'    => 'project-management',
        'crm-systems'                             => 'sales-crm',
        'marketing-automation-platforms'          => 'automation-workflow',
        'sales-enablement-tools'                  => 'sales-crm',
        'customer-support-helpdesk-systems'       => 'customer-support',
        'customer-feedback-survey-platforms'      => 'customer-support',
        'affiliate-partner-management-tools'      => 'sales-crm',
        'accounting-invoicing-software'           => 'finance-accounting',
        'finance-budgeting-tools'                 => 'finance-accounting',
        'payment-processing-fintech-tools'        => 'finance-accounting',
        'e-commerce-pos-systems'                  => 'sales-crm',
        'hr-management-systems'                   => 'hr-recruitment',
        'learning-management-systems'             => 'education-ai',
        'payroll-compensation-management-tools'   => 'hr-recruitment',
        'recruitment-applicant-tracking-systems'  => 'hr-recruitment',
        'cybersecurity-access-control'            => 'security-compliance',
        'cloud-backup-storage-solutions'          => 'developer-tools',
        'it-management-monitoring-tools'          => 'developer-tools',
        'api-management-integration-platforms'    => 'developer-tools',
        'data-analytics-business-intelligence'    => 'data-analytics',
        'business-reporting-insights-tools'       => 'data-analytics',
        'ai-powered-assistants-chatbots'          => 'customer-support',
        'legal-compliance-software'               => 'legal-ai',
        'procurement-vendor-management-systems'   => 'sales-crm',
        'event-management-booking-software'       => 'project-management',
    ];

    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');

        $oldCats = ProductCategory::withTrashed()
            ->whereIn('slug', array_keys($this->map))
            ->get()
            ->keyBy('slug');

        $newCats = ProductCategory::whereIn('slug', array_values(array_unique($this->map)))
            ->get()
            ->keyBy('slug');

        $missingNew = array_diff(array_values(array_unique($this->map)), $newCats->keys()->all());
        if (!empty($missingNew)) {
            $this->error('Missing new categories (run ProductCategoriesSeeder first): ' . implode(', ', $missingNew));
            return self::FAILURE;
        }

        $totalRemapped = 0;
        $totalDeleted = 0;
        $perRow = [];

        foreach ($this->map as $oldSlug => $newSlug) {
            $oldCat = $oldCats->get($oldSlug);
            $newCat = $newCats->get($newSlug);
            if (!$oldCat || !$newCat) {
                $perRow[] = [$oldSlug, $newSlug, 'skip (missing)', 0];
                continue;
            }

            // Count selections on the old category for 'products' post type
            $selections = DB::table('category_selections')
                ->where('post_type', 'products')
                ->where('category_id', $oldCat->id)
                ->get(['id', 'post_id']);

            $count = $selections->count();
            if ($count === 0) {
                $perRow[] = [$oldSlug, $newSlug, 'no rows', 0];
                continue;
            }

            if ($dryRun) {
                $perRow[] = [$oldSlug, $newSlug, 'would remap', $count];
                $totalRemapped += $count;
                continue;
            }

            DB::transaction(function () use ($selections, $oldCat, $newCat, &$totalRemapped, &$totalDeleted) {
                foreach ($selections as $sel) {
                    // If the product already has the new category, delete the stale row
                    $existsOnNew = DB::table('category_selections')
                        ->where('post_type', 'products')
                        ->where('post_id', $sel->post_id)
                        ->where('category_id', $newCat->id)
                        ->exists();

                    if ($existsOnNew) {
                        DB::table('category_selections')->where('id', $sel->id)->delete();
                        $totalDeleted++;
                    } else {
                        DB::table('category_selections')
                            ->where('id', $sel->id)
                            ->update(['category_id' => $newCat->id]);
                        $totalRemapped++;
                    }
                }
            });

            $perRow[] = [$oldSlug, $newSlug, $dryRun ? 'would remap' : 'remapped', $count];
        }

        $this->table(['Old slug', 'New slug', 'Status', 'Rows'], $perRow);

        if ($dryRun) {
            $this->info("Dry run complete. Would remap {$totalRemapped} category_selections rows.");
        } else {
            $this->info("Remapped {$totalRemapped} rows, deleted {$totalDeleted} duplicate rows.");
        }

        return self::SUCCESS;
    }
}
