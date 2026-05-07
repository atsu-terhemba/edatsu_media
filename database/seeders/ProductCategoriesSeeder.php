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
            // Sales
            'Sales Engagement & Outreach',
            'Conversation Intelligence',
            'Revenue Operations & Forecasting',
            'CRM',
            'Sales Intelligence & Prospecting',
            'Customer Success',

            // Marketing
            'Email & SMS Marketing',
            'Social Media Management',
            'SEO & Content Optimization',
            'Ad Creative & Optimization',
            'Web Personalization & CRO',
            'Brand & Social Listening',
            'Newsletter & Content Distribution',

            // Customer Service
            'Helpdesk & Ticketing',
            'AI Customer Service Agents',
            'Contact Center & Voice AI',
            'Knowledge Base & Self-Service',

            // Creative & Content
            'Writing & Copywriting',
            'Image Generation',
            'Video Generation & Editing',
            'Audio / Voice / Music',
            'Speech-to-Text & Transcription',
            'Design (UI / Graphics / 3D)',
            'Presentations',
            'AI Avatars & Spokesperson Video',

            // Productivity & Collaboration
            'Note-Taking & Knowledge Management',
            'Meeting Assistants',
            'Scheduling & Calendar',
            'Task & Project Management',
            'Whiteboards & Diagramming',
            'Email Clients',
            'Workflow Automation',
            'Docs & Workspaces',

            // Engineering
            'Code Generation & Pair Programming',
            'AI Code Editors / IDEs',
            'Code Review & Quality',
            'Documentation',
            'Engineering Intelligence',
            'Autonomous Coding Agents',

            // Data & Analytics
            'Business Intelligence',
            'Product Analytics',
            'Digital Experience Analytics',
            'Customer Data Platforms',
            'Data Pipelines & ETL',
            'Data Observability',
            'MLOps & Experiment Tracking',

            // AI Infrastructure
            'Foundation Model APIs',
            'AI Agent Builders',
            'LLM Frameworks',
            'Vector Databases',
            'AI Search & Research',
            'General-Purpose AI Assistants',

            // Security & Compliance
            'Cybersecurity',
            'Cloud Security',
            'Compliance Automation (GRC)',

            // Legal
            'Legal Research & Drafting',
            'Contract Lifecycle Management',

            // Finance
            'Accounting & Spend Management',
            'FP&A / Financial Planning',

            // HR
            'HRIS / Workforce Management',
            'Recruiting & ATS',
            'Performance & Engagement',
            'Workforce Analytics',
            'Employee Helpdesk (HR/IT)',

            // Verticals
            'Healthcare',
            'Education',
            'Ecommerce',
            'Logistics & Supply Chain',
            'Real Estate',
            'Document Processing (IDP)',
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
