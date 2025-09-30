<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\TrendingService;

class UpdateTrendingStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'trending:update {--type=all : Type of content to update (opportunities, products, or all)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update trending status for opportunities and products based on engagement metrics';

    protected $trendingService;

    /**
     * Create a new command instance.
     */
    public function __construct(TrendingService $trendingService)
    {
        parent::__construct();
        $this->trendingService = $trendingService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $type = $this->option('type');

        $this->info('Starting trending status update...');

        switch ($type) {
            case 'opportunities':
                $this->info('Updating opportunities trending status...');
                $this->trendingService->updateOpportunitiesTrending();
                $this->info('✅ Opportunities trending status updated!');
                break;

            case 'products':
                $this->info('Updating products trending status...');
                $this->trendingService->updateProductsTrending();
                $this->info('✅ Products trending status updated!');
                break;

            case 'all':
            default:
                $this->info('Updating all trending status...');
                $this->trendingService->updateAllTrending();
                $this->info('✅ All trending status updated!');
                break;
        }

        // Show some statistics
        $trendingOpportunities = $this->trendingService->getTrendingOpportunities(5);
        $trendingProducts = $this->trendingService->getTrendingProducts(5);

        $this->info("\n📈 Trending Summary:");
        $this->info("🔥 Trending Opportunities: " . $trendingOpportunities->count());
        $this->info("🔥 Trending Products: " . $trendingProducts->count());

        if ($trendingOpportunities->isNotEmpty()) {
            $this->info("\n🎯 Top Trending Opportunities:");
            foreach ($trendingOpportunities as $opp) {
                $this->line("  • {$opp->title} (Score: {$opp->trending_score})");
            }
        }

        if ($trendingProducts->isNotEmpty()) {
            $this->info("\n🛠️ Top Trending Products:");
            foreach ($trendingProducts as $product) {
                $this->line("  • {$product->product_name} (Score: {$product->trending_score})");
            }
        }

        return Command::SUCCESS;
    }
}
