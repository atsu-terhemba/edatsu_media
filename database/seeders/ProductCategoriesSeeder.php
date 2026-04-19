<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ProductCategory;
use Illuminate\Support\Str;

class ProductCategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Writing & Copywriting',
            'Image Generation',
            'Video Creation',
            'Audio & Voice',
            'SEO & Content Optimization',
            'Social Media Management',
            'Email Marketing',
            'Sales & CRM',
            'Customer Support',
            'Meeting & Transcription',
            'Project Management',
            'Knowledge Management',
            'HR & Recruitment',
            'Finance & Accounting',
            'Data & Analytics',
            'Developer Tools',
            'Automation & Workflow',
            'Design & UI',
            'Security & Compliance',
            'Legal AI',
            'Healthcare AI',
            'Education AI',
            '3D & Gaming',
            'Research',
        ];

        $keepSlugs = [];

        foreach ($categories as $categoryName) {
            $slug = Str::slug($categoryName);
            $keepSlugs[] = $slug;

            $existing = ProductCategory::withTrashed()->where('slug', $slug)->first();

            if ($existing) {
                if ($existing->trashed()) {
                    $existing->restore();
                }
                $existing->name = $categoryName;
                $existing->description = "Tools and software for {$categoryName}";
                $existing->save();
            } else {
                ProductCategory::create([
                    'name' => $categoryName,
                    'slug' => $slug,
                    'description' => "Tools and software for {$categoryName}",
                ]);
            }
        }

        // Soft-delete any category no longer in the list
        $retired = ProductCategory::whereNotIn('slug', $keepSlugs)->get();
        foreach ($retired as $cat) {
            $cat->delete();
        }

        $this->command->info('Product categories updated: ' . count($categories) . ' active, ' . $retired->count() . ' retired.');
    }
}
