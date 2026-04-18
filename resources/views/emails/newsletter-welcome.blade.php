@extends('emails.layouts.base')

@section('title', "You're on the list")
@section('hero_title', "You're on the list")
@section('hero_subtitle', 'The best of Edatsu Media, delivered to your inbox')

@section('content')
    <p class="greeting">Hi {{ $firstName }},</p>

    <p>
        Thanks for subscribing to the Edatsu Media newsletter. We'll send you a
        curated roundup of the most interesting opportunities, tools, and ideas —
        no fluff, no spam.
    </p>

    <p>Until the first issue lands, here's what's waiting for you:</p>

    <ul class="features">
        <li>
            <span class="feature-icon">&#x1F4AB;</span>
            <span class="feature-text">
                <strong>Fresh opportunities</strong>
                Jobs, grants, fellowships, and programs curated weekly.
            </span>
        </li>
        <li>
            <span class="feature-icon">&#x1F6E0;</span>
            <span class="feature-text">
                <strong>Toolshed picks</strong>
                Tools and resources actually worth your time.
            </span>
        </li>
        <li>
            <span class="feature-icon">&#x1F4AC;</span>
            <span class="feature-text">
                <strong>Community conversations</strong>
                What the community is discussing and what you shouldn't miss.
            </span>
        </li>
    </ul>

    <div class="cta-section">
        <a href="{{ $appUrl }}" class="cta-button">Explore Edatsu</a>
    </div>
@endsection

@section('footer_note')
    <p>You subscribed with <strong>{{ $email }}</strong>. Not you? Just ignore this email.</p>
@endsection
