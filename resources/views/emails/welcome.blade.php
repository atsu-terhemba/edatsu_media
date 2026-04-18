@extends('emails.layouts.base')

@section('title', 'Welcome to Edatsu Media')
@section('hero_title', 'Welcome aboard!')
@section('hero_subtitle', "We're thrilled to have you join our community.")

@section('content')
    <p class="greeting">Hi {{ $user->name }},</p>

    <p>
        Thank you for signing up for Edatsu Media. You've just joined a growing
        community of professionals discovering opportunities and tools to accelerate
        their careers.
    </p>

    <p>Here's what you can explore right away:</p>

    <ul class="features">
        <li>
            <span class="feature-icon">&#x1F50D;</span>
            <span class="feature-text">
                <strong>Opportunities</strong>
                Browse curated jobs, grants, and programs tailored for you.
            </span>
        </li>
        <li>
            <span class="feature-icon">&#x1F6E0;</span>
            <span class="feature-text">
                <strong>Toolshed</strong>
                Discover tools and resources to boost your productivity.
            </span>
        </li>
        <li>
            <span class="feature-icon">&#x1F514;</span>
            <span class="feature-text">
                <strong>Smart Alerts</strong>
                Set your preferences and get notified when relevant opportunities drop.
            </span>
        </li>
    </ul>

    <div class="cta-section">
        <a href="{{ $dashboardUrl }}" class="cta-button">Go to Your Dashboard</a>
    </div>
@endsection
