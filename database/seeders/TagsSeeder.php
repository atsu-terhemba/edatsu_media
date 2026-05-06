<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TagsSeeder extends Seeder
{
    public function run(): void
    {
        $tags = [
            // AI & ML
            'generative ai',
            'large language models',
            'computer vision',
            'natural language processing',
            'speech & voice',
            'predictive analytics',
            'ai agents',
            'chatbots',

            // Productivity & Operations
            'project management',
            'task automation',
            'document management',
            'knowledge base',
            'workflow automation',

            // Sales & Marketing
            'crm',
            'email marketing',
            'seo',
            'social media',
            'lead generation',
            'customer support',
            'analytics',

            // Finance & Admin
            'accounting',
            'invoicing & payments',
            'hr & payroll',
            'recruitment',

            // Data & Engineering
            'business intelligence',
            'data visualization',
            'no-code / low-code',
            'api & integrations',

            // Content & Creative
            'content generation',
            'image generation',
            'video & audio',
            'writing assistant',
            'translation',

            // Security
            'cybersecurity',
            'compliance & privacy',
        ];

        foreach ($tags as $name) {
            Tag::firstOrCreate(
                ['name' => $name],
                ['slug' => Str::slug($name)]
            );
        }
    }
}
