@extends('emails.layouts.base')

@section('title', 'Reminder ' . ucfirst($actionText))
@section('hero_title', 'Your reminder is locked in')
@section('hero_subtitle', "So you don't miss what matters")

@section('content')
    <p class="greeting">Hi {{ $user->name }},</p>

    <p>
        Your reminder has been <strong>{{ $actionText }}</strong> for this opportunity:
    </p>

    <div class="quote-box">
        <strong style="display:block; margin-bottom: 6px; color:#1d1d1f;">{{ $opportunityTitle }}</strong>
        You'll be reminded on <strong>{{ $formattedDate }}</strong>.
    </div>

    <div class="cta-section">
        <a href="{{ $actionUrl }}" class="cta-button">View opportunity</a>
    </div>

    <p style="font-size: 13px; color: #86868b;">
        You can update or remove this reminder any time from your bookmarks.
    </p>
@endsection
