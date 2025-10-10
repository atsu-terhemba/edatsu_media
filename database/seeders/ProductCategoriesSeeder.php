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
            'Project Management Tools',
            'Workflow Automation Tools',
            'Time Tracking & Productivity Tools',
            'Document Management Systems',
            'Knowledge Base & Documentation Tools',
            'Remote Work & Virtual Office Platforms',
            'CRM Systems',
            'Marketing Automation Platforms',
            'Sales Enablement Tools',
            'Customer Support & Helpdesk Systems',
            'Customer Feedback & Survey Platforms',
            'Affiliate & Partner Management Tools',
            'Accounting & Invoicing Software',
            'Finance & Budgeting Tools',
            'Payment Processing & Fintech Tools',
            'E-commerce & POS Systems',
            'HR Management Systems',
            'Learning Management Systems',
            'Payroll & Compensation Management Tools',
            'Recruitment & Applicant Tracking Systems',
            'Cybersecurity & Access Control',
            'Cloud Backup & Storage Solutions',
            'IT Management & Monitoring Tools',
            'API Management & Integration Platforms',
            'Data Analytics & Business Intelligence',
            'Business Reporting & Insights Tools',
            'AI-Powered Assistants & Chatbots',
            'Legal & Compliance Software',
            'Procurement & Vendor Management Systems',
            'Event Management & Booking Software'
        ];

        foreach ($categories as $categoryName) {
            $slug = Str::slug($categoryName);
            
            // Check if category already exists to avoid duplicates
            $existingCategory = ProductCategory::where('slug', $slug)->first();
            
            if (!$existingCategory) {
                ProductCategory::create([
                    'name' => $categoryName,
                    'slug' => $slug,
                    'description' => "Tools and software for {$categoryName}",
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->command->info('Product categories seeded successfully!');
    }
}
