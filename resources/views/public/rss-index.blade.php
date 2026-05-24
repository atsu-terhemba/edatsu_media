<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>RSS Feeds | Edatsu Media</title>
    <meta name="description" content="Subscribe to Edatsu Media via RSS — opportunities, tools and community discussions delivered to your reader." />
    <link rel="canonical" href="{{ rtrim(config('app.url'), '/') }}/rss" />

    @foreach ($feeds as $feed)
        <link rel="alternate" type="application/rss+xml"
              title="{{ 'Edatsu Media — ' . $feed['title'] }}"
              href="{{ $feed['url'] }}" />
    @endforeach

    <style>
        :root {
            color-scheme: light;
            --orange: #f97316;
            --black: #000;
            --grey: #86868b;
            --light: #f5f5f7;
            --border: #f0f0f0;
        }
        * { box-sizing: border-box; }
        body {
            font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
            margin: 0; padding: 96px 24px 64px;
            color: #1d1d1f;
            background: #fff;
            line-height: 1.55;
        }
        .container { max-width: 720px; margin: 0 auto; }
        .eyebrow {
            font-size: 11px; font-weight: 600; color: var(--grey);
            text-transform: uppercase; letter-spacing: 0.15em;
            margin: 0 0 8px;
        }
        .eyebrow-bar {
            width: 24px; height: 2px; background: var(--orange);
            margin: 0 0 20px;
        }
        h1 {
            font-size: clamp(28px, 5vw, 36px);
            font-weight: 600; color: var(--black);
            letter-spacing: -0.02em;
            margin: 0 0 12px;
        }
        .lede {
            font-size: 15px; color: var(--grey); max-width: 540px;
            margin: 0 0 40px;
        }
        .feed {
            display: block;
            padding: 24px;
            border: 1px solid var(--border);
            border-radius: 16px;
            background: #fff;
            text-decoration: none;
            color: inherit;
            margin-bottom: 12px;
            transition: all 0.2s ease;
        }
        .feed:hover {
            border-color: #e0e0e0;
            box-shadow: 0 4px 16px rgba(0,0,0,0.04);
            transform: translateY(-1px);
        }
        .feed-title {
            display: flex; align-items: center; gap: 10px;
            font-size: 17px; font-weight: 600; color: var(--black);
            margin: 0 0 6px;
        }
        .rss-dot {
            width: 28px; height: 28px; border-radius: 8px;
            background: var(--orange); color: #fff;
            display: inline-flex; align-items: center; justify-content: center;
            font-size: 14px; flex-shrink: 0;
            font-weight: 700;
        }
        .feed-desc { font-size: 13px; color: var(--grey); margin: 0 0 12px; }
        .feed-actions {
            display: flex; flex-wrap: wrap; gap: 6px;
        }
        .pill {
            display: inline-flex; align-items: center; gap: 6px;
            padding: 6px 14px; border-radius: 9999px;
            font-size: 12px; font-weight: 500;
            border: 1px solid var(--border);
            color: var(--grey);
            background: #fff;
            text-decoration: none;
        }
        .pill.primary {
            background: var(--black); color: #fff; border-color: var(--black);
        }
        .pill:hover { color: var(--black); border-color: var(--black); }
        .pill.primary:hover { background: #333; color: #fff; }
        code {
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
            font-size: 12px;
            background: var(--light);
            padding: 2px 6px;
            border-radius: 4px;
            color: #424245;
        }
        .footnote {
            margin-top: 40px;
            font-size: 12px;
            color: var(--grey);
            text-align: center;
        }
        .footnote a { color: var(--grey); }
    </style>
</head>
<body>
    <div class="container">
        <p class="eyebrow">Syndication</p>
        <div class="eyebrow-bar"></div>
        <h1>RSS feeds</h1>
        <p class="lede">
            Subscribe via your reader of choice. Each feed updates every 30 minutes and
            is also indexed by search engines, AI assistants, and news aggregators.
        </p>

        @foreach ($feeds as $feed)
            <a class="feed" href="{{ $feed['url'] }}">
                <div class="feed-title">
                    <span class="rss-dot">))</span>
                    {{ $feed['title'] }}
                </div>
                <p class="feed-desc">{{ $feed['description'] }}</p>
                <div class="feed-actions">
                    <span class="pill primary">Subscribe</span>
                    <a class="pill" href="{{ $feed['page'] }}" onclick="event.stopPropagation();">Browse on site</a>
                    <code>{{ $feed['url'] }}</code>
                </div>
            </a>
        @endforeach

        <p class="footnote">
            Looking for an AI-readable manifest? See
            <a href="/llms.txt">llms.txt</a> &middot;
            <a href="/sitemap.xml">sitemap.xml</a>
        </p>
    </div>
</body>
</html>
