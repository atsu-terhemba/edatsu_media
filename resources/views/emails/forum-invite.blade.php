@extends('emails.layouts.base')

@section('title', 'New discussion matched to your interests')
@section('hero_title', 'A discussion picked for you')
@section('hero_subtitle', 'Someone started a conversation in a topic you follow')

@section('content')
    <p class="greeting">Hi {{ $user->name }},</p>

    <p>
        <strong>{{ $starterName }}</strong> just started a discussion on the forum,
        and it touches on topics you follow.
    </p>

    @if (!empty($matchedCategories))
        <p style="margin-bottom: 8px;">
            @foreach ($matchedCategories as $name)
                <span class="tag-pill">{{ $name }}</span>
            @endforeach
        </p>
    @endif

    <div class="quote-box">
        <strong style="display:block; margin-bottom: 6px; color:#1d1d1f;">{{ $thread->title }}</strong>
        {{ $preview }}
    </div>

    <p>Your perspective matters. Jump in, share your take, or just follow along.</p>

    <div class="cta-section">
        <a href="{{ $threadUrl }}" class="cta-button secondary">Join the conversation</a>
    </div>
@endsection

@section('footer_note')
    <p>
        You're getting this because forum notifications are on and this discussion
        matches your interest categories.
        <a href="{{ $appUrl }}/preferences">Update preferences</a>.
    </p>
@endsection
