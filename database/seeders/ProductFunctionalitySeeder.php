<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ProductFunctionality;

class ProductFunctionalitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $functionalities = [
            [
                'name' => 'Project Management',
                'slug' => 'project-management',
                'description' => 'Tools for managing projects and tasks'
            ],
            [
                'name' => 'Communication',
                'slug' => 'communication',
                'description' => 'Tools for team communication and collaboration'
            ],
            [
                'name' => 'Design & Creative',
                'slug' => 'design-creative',
                'description' => 'Design and creative software tools'
            ],
            [
                'name' => 'Analytics & Reporting',
                'slug' => 'analytics-reporting',
                'description' => 'Data analytics and reporting tools'
            ],
            [
                'name' => 'Marketing & Sales',
                'slug' => 'marketing-sales',
                'description' => 'Marketing automation and sales tools'
            ],
            [
                'name' => 'Development Tools',
                'slug' => 'development-tools',
                'description' => 'Software development and coding tools'
            ],
            [
                'name' => 'Productivity',
                'slug' => 'productivity',
                'description' => 'Tools to boost productivity and efficiency'
            ],
            [
                'name' => 'File Management',
                'slug' => 'file-management',
                'description' => 'File storage and management solutions'
            ],
            [
                'name' => 'AI & Automation',
                'slug' => 'ai-automation',
                'description' => 'Artificial intelligence and automation tools'
            ],
            [
                'name' => 'Security',
                'slug' => 'security',
                'description' => 'Security and privacy protection tools'
            ]
        ];

        foreach ($functionalities as $functionality) {
            ProductFunctionality::create($functionality);
        }
    }
}
