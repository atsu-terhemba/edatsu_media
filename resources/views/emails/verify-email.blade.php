@extends('emails.layouts.base')

@section('title', 'Verify your email')
@section('hero_title', 'One last step')
@section('hero_subtitle', 'Confirm your email to activate your account')

@section('content')
    <p class="greeting">Hi {{ $user->name }},</p>

    <p>
        Thanks for joining Edatsu Media. Please confirm this email address so we can
        deliver opportunity alerts, reminders, and forum updates you care about.
    </p>

    <div class="cta-section">
        <a href="{{ $verifyUrl }}" class="cta-button">Verify email</a>
    </div>

    <p style="font-size: 13px; color: #86868b;">
        If you didn't create an account, you can safely ignore this email.
    </p>

    <div class="quote-box" style="font-size: 12px; word-break: break-all;">
        Trouble with the button? Copy this link into your browser:<br>
        <a href="{{ $verifyUrl }}" style="color:#f97316; text-decoration:none;">{{ $verifyUrl }}</a>
    </div>
@endsection
