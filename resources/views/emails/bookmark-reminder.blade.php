@extends('emails.layouts.base')

@section('title', 'Bookmark Reminder')
@section('hero_title', 'Time to revisit this')
@section('hero_subtitle', "Your bookmark reminder")

@section('content')
    <p class="greeting">Hi {{ $user->name }},</p>

    <p>
        You asked us to remind you about this {{ $itemType }}:
    </p>

    <div class="quote-box">
        <strong style="display:block; margin-bottom: 6px; color:#1d1d1f;">{{ $itemTitle }}</strong>
    </div>

    <div class="cta-section">
        <a href="{{ $actionUrl }}" class="cta-button">Open {{ $itemType }}</a>
    </div>

    <p style="font-size: 13px; color: #86868b;">
        You can manage your reminders any time from your bookmarks.
    </p>
@endsection
