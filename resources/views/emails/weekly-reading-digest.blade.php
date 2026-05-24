@extends('emails.layouts.base')

@section('title', 'Your weekly reading digest')
@section('hero_title', 'Your reading this week')
@section('hero_subtitle', 'Top picks from your feeds + what the platform is reading')

@section('extra_styles')
    <style>
        .stats-row {
            display: table;
            width: 100%;
            margin: 0 0 24px;
            border-collapse: separate;
            border-spacing: 8px 0;
        }
        .stat-cell {
            display: table-cell;
            width: 33%;
            padding: 14px 12px;
            background: #fafafa;
            border: 1px solid #f0f0f0;
            border-radius: 12px;
            text-align: center;
            vertical-align: middle;
        }
        .stat-cell .num {
            display: block;
            font-size: 22px;
            font-weight: 700;
            color: #1d1d1f;
            line-height: 1.1;
        }
        .stat-cell .label {
            display: block;
            margin-top: 4px;
            font-size: 11px;
            font-weight: 500;
            color: #86868b;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .stat-cell .streak {
            color: #f97316;
        }
        .section-label {
            font-size: 11px;
            font-weight: 600;
            color: #f97316;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin: 28px 0 4px;
        }
        .section-bar {
            width: 24px;
            height: 2px;
            background: #f97316;
            border-radius: 2px;
            margin-bottom: 12px;
        }
        .section-heading {
            font-size: 18px;
            font-weight: 600;
            color: #1d1d1f;
            margin: 0 0 16px;
            letter-spacing: -0.01em;
        }
        .article-card {
            border: 1px solid #f0f0f0;
            border-radius: 12px;
            padding: 16px 18px;
            margin-bottom: 12px;
            background: #ffffff;
        }
        .article-card h3 {
            font-size: 15px;
            font-weight: 600;
            color: #1d1d1f;
            margin: 0 0 6px;
            line-height: 1.4;
        }
        .article-card .meta {
            font-size: 11px;
            color: #86868b;
            margin-bottom: 8px;
        }
        .article-card .desc {
            font-size: 13px;
            color: #424245;
            line-height: 1.55;
            margin-bottom: 10px;
        }
        .article-card .read-link {
            display: inline-block;
            font-size: 12px;
            font-weight: 600;
            color: #f97316;
            text-decoration: none;
        }
        .article-card .source-pill {
            display: inline-block;
            padding: 2px 9px;
            background: #f5f5f7;
            color: #1d1d1f;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 500;
            margin-right: 4px;
        }
        .empty-note {
            font-size: 13px;
            color: #86868b;
            margin: 0 0 16px;
            line-height: 1.55;
        }
    </style>
@endsection

@section('content')
    <p style="font-size:14px; color:#1d1d1f; line-height:1.55; margin: 0 0 18px;">
        Hi {{ $user->name ?? 'there' }} — here's a quick look at what your feeds (and the platform) put forward this week.
    </p>

    <div class="stats-row">
        <div class="stat-cell">
            <span class="num">{{ $stats['reads'] ?? 0 }}</span>
            <span class="label">Articles read</span>
        </div>
        <div class="stat-cell">
            <span class="num">{{ $stats['saves'] ?? 0 }}</span>
            <span class="label">Articles saved</span>
        </div>
        <div class="stat-cell">
            <span class="num streak">{{ $stats['streak'] ?? 0 }}{{ ($stats['streak'] ?? 0) > 0 ? '🔥' : '' }}</span>
            <span class="label">Day streak</span>
        </div>
    </div>

    @if ($personalArticles->isNotEmpty())
        <div class="section-label">From your feeds</div>
        <div class="section-bar"></div>
        <h2 class="section-heading">What people are reading from sources you follow</h2>

        @foreach ($personalArticles as $a)
            <div class="article-card">
                <h3>{{ $a['title'] }}</h3>
                <div class="meta">
                    @if (!empty($a['feed_title']))
                        <span class="source-pill">{{ $a['feed_title'] }}</span>
                    @endif
                    @if (!empty($a['article_date']))
                        {{ $a['article_date'] }}
                    @endif
                </div>
                @if (!empty($a['description']))
                    <div class="desc">{{ \Illuminate\Support\Str::limit(strip_tags($a['description']), 180) }}</div>
                @endif
                <a class="read-link" href="{{ $a['link'] }}" target="_blank" rel="noopener noreferrer">
                    Read article →
                </a>
            </div>
        @endforeach
    @endif

    @if ($hotArticles->isNotEmpty())
        <div class="section-label">Trending on Edatsu</div>
        <div class="section-bar"></div>
        <h2 class="section-heading">What the rest of the platform read</h2>

        @foreach ($hotArticles as $a)
            <div class="article-card">
                <h3>{{ $a['title'] }}</h3>
                <div class="meta">
                    @if (!empty($a['feed_title']))
                        <span class="source-pill">{{ $a['feed_title'] }}</span>
                    @endif
                </div>
                @if (!empty($a['description']))
                    <div class="desc">{{ \Illuminate\Support\Str::limit(strip_tags($a['description']), 160) }}</div>
                @endif
                <a class="read-link" href="{{ $a['link'] }}" target="_blank" rel="noopener noreferrer">
                    Read article →
                </a>
            </div>
        @endforeach
    @endif

    <div style="margin: 28px 0 8px; padding: 16px; background: #fafafa; border: 1px solid #f0f0f0; border-radius: 12px; text-align: center;">
        <p style="font-size:13px; color:#424245; margin:0 0 10px;">
            Open your feeds, add a source, or pick up where you left off.
        </p>
        <a href="{{ rtrim($appUrl, '/') }}/feeds"
           style="display:inline-block; padding:10px 22px; background:#000; color:#fff; text-decoration:none; border-radius:9999px; font-size:13px; font-weight:600;">
            Open Edatsu Feeds
        </a>
    </div>

    <p style="font-size:11px;color:#86868b;text-align:center;margin:24px 0 0;">
        Don't want these weekly?
        <a href="{{ $unsubscribeUrl }}" style="color:#86868b;text-decoration:underline;">Unsubscribe from the reading digest</a>
    </p>
@endsection
