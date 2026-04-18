@extends('emails.layouts.base')

@section('title', 'Reset your password')
@section('hero_title', 'Reset your password')
@section('hero_subtitle', 'A request came in for your account')

@section('content')
    <p class="greeting">Hi {{ $user->name }},</p>

    <p>
        We received a request to reset the password for your Edatsu Media account.
        Click the button below to set a new one.
    </p>

    <div class="cta-section">
        <a href="{{ $resetUrl }}" class="cta-button">Reset password</a>
    </div>

    <p style="font-size: 13px; color: #86868b;">
        This link will expire in {{ $expireMinutes }} minutes.
        If you didn't request a password reset, you can safely ignore this email &mdash;
        your password won't change.
    </p>

    <div class="quote-box" style="font-size: 12px; word-break: break-all;">
        Trouble with the button? Copy this link into your browser:<br>
        <a href="{{ $resetUrl }}" style="color:#f97316; text-decoration:none;">{{ $resetUrl }}</a>
    </div>
@endsection

@section('footer_note')
    <p>You're getting this because someone requested a password reset for this email.</p>
@endsection
