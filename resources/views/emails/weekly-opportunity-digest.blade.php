@extends('emails.layouts.base')

@section('title', 'Your weekly opportunity digest')
@section('hero_title', 'Picked for you this week')
@section('hero_subtitle', 'Opportunities that match what you follow')

@section('extra_styles')
    <style>
        .opp-card {
            border: 1px solid #f0f0f0;
            border-radius: 12px;
            padding: 20px 22px;
            margin-bottom: 14px;
            background: #ffffff;
        }
        .opp-card h3 {
            font-size: 16px;
            font-weight: 600;
            color: #1d1d1f;
            margin: 0 0 8px;
            line-height: 1.4;
        }
        .opp-card .opp-meta {
            font-size: 12px;
            color: #86868b;
            margin-bottom: 10px;
        }
        .opp-card .opp-desc {
            font-size: 13px;
            color: #424245;
            line-height: 1.55;
            margin-bottom: 12px;
        }
        .opp-card .opp-link {
            display: inline-block;
            font-size: 13px;
            font-weight: 600;
            color: #f97316;
            text-decoration: none;
        }
        .opp-deadline-pill {
            display: inline-block;
            padding: 2px 10px;
            background: #fff7ed;
            color: #c2410c;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 600;
            margin-left: 6px;
        }
        .ad-slot {
            margin: 24px 0 8px;
            padding: 16px;
            background: #fafafa;
            border: 1px solid #f0f0f0;
            border-radius: 12px;
            text-align: center;
        }
        .ad-slot .ad-label {
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #b0b0b5;
            margin-bottom: 8px;
        }
        .ad-slot img { max-width: 100%; border-radius: 8px; }
    </style>
@endsection

@section('content')
    <p class="greeting">Hi {{ $user->name }},</p>

    <p>
        Here {{ $opportunities->count() === 1 ? 'is' : 'are' }} <strong>{{ $opportunities->count() }}</strong>
        fresh {{ $opportunities->count() === 1 ? 'opportunity' : 'opportunities' }} from the past week that line up with the
        categories, countries, regions, and brands you follow.
    </p>

    @foreach ($opportunities as $opp)
        @php
            $oppUrl = url('/op/' . $opp->id . '/' . ($opp->slug ?? ''));
            $deadline = $opp->deadline ? \Carbon\Carbon::parse($opp->deadline) : null;
            $excerpt = $opp->description
                ? mb_strimwidth(strip_tags($opp->description), 0, 180, '…')
                : null;
        @endphp
        <div class="opp-card">
            <h3>
                <a href="{{ $oppUrl }}" style="color: #1d1d1f; text-decoration: none;">{{ $opp->title }}</a>
                @if ($deadline)
                    <span class="opp-deadline-pill">Closes {{ $deadline->format('M j') }}</span>
                @endif
            </h3>
            @if ($opp->categories?->count())
                <div class="opp-meta">
                    @foreach ($opp->categories->take(3) as $cat)
                        <span class="tag-pill">{{ $cat->name }}</span>
                    @endforeach
                </div>
            @endif
            @if ($excerpt)
                <div class="opp-desc">{{ $excerpt }}</div>
            @endif
            <a href="{{ $oppUrl }}" class="opp-link">Read more &rsaquo;</a>
        </div>
    @endforeach

    <div class="cta-section">
        <a href="{{ $appUrl }}/opportunities" class="cta-button secondary">See all opportunities</a>
    </div>

    @if ($ad)
        <div class="ad-slot">
            <div class="ad-label">Sponsored</div>
            @if ($ad->ad_type === 'image' && $ad->image_url)
                <a href="{{ $ad->link_url ?? '#' }}" target="{{ $ad->link_target ?? '_blank' }}">
                    <img src="{{ $ad->image_url }}" alt="Sponsored" />
                </a>
            @elseif ($ad->ad_code)
                {{-- Raw ad_code is admin-authored; email clients will sanitize risky tags. --}}
                {!! $ad->ad_code !!}
            @endif
        </div>
    @endif
@endsection

@section('footer_note')
    <p>
        You're getting this weekly digest because you have preferences set on your Edatsu profile.
        <a href="{{ $unsubscribeUrl }}">Unsubscribe from the weekly digest</a>
        &middot;
        <a href="{{ $appUrl }}/preferences">Edit preferences</a>.
    </p>
@endsection
