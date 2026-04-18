@extends('emails.layouts.base')

@section('title', $title)
@section('hero_title', 'Something new for you')
@section('hero_subtitle', 'Matched to your interests')

@section('content')
    <p class="greeting">Hi {{ $user->name }},</p>

    <p><strong>{{ $title }}</strong></p>

    <div class="quote-box">{{ $message }}</div>

    <p>We thought you'd be interested based on your preference settings.</p>

    <div class="cta-section">
        <a href="{{ $actionUrl }}" class="cta-button">View Details</a>
    </div>
@endsection

@section('footer_note')
    <p>
        You're getting this because preference notifications are on.
        <a href="{{ $appUrl }}/preferences">Manage notifications</a>.
    </p>
@endsection
