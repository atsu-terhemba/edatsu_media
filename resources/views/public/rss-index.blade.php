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

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

    <style>
        :root {
            color-scheme: light;
            --orange: #f97316;
            --orange-tint: #fff7ed;
            --orange-border: #fed7aa;
            --black: #000;
            --grey-1: #1d1d1f;
            --grey-2: #6e6e73;
            --grey-3: #86868b;
            --grey-4: #b0b0b5;
            --light: #f5f5f7;
            --bg: #fafafa;
            --border: #f0f0f0;
        }
        * { box-sizing: border-box; }
        html, body { background: var(--bg); }
        body {
            font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
            margin: 0; padding: 96px 20px 80px;
            color: var(--grey-1);
            line-height: 1.55;
        }
        .container { max-width: 760px; margin: 0 auto; }

        /* Header */
        .eyebrow {
            font-size: 11px; font-weight: 600; color: var(--grey-3);
            text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 8px;
        }
        .eyebrow-bar { width: 24px; height: 2px; background: var(--orange); margin: 0 0 20px; }
        h1 {
            font-size: clamp(30px, 5vw, 40px); font-weight: 600;
            color: var(--black); letter-spacing: -0.02em;
            line-height: 1.15; margin: 0 0 14px;
        }
        .lede {
            font-size: 15px; color: var(--grey-3); margin: 0 0 48px;
            max-width: 560px; line-height: 1.625;
        }

        /* Feed card */
        .feed-card {
            background: #fff;
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 28px;
            margin-bottom: 14px;
            transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .feed-card:hover {
            border-color: #e0e0e0;
            box-shadow: 0 4px 16px rgba(0,0,0,0.04);
        }
        .feed-head {
            display: flex; align-items: center; gap: 14px;
            margin-bottom: 12px;
        }
        .feed-icon {
            width: 48px; height: 48px; border-radius: 50%;
            background: var(--black); color: #fff;
            display: inline-flex; align-items: center; justify-content: center;
            flex-shrink: 0;
        }
        .feed-icon .material-symbols-outlined {
            font-size: 22px; color: #fff;
            font-variation-settings: 'FILL' 1;
        }
        .feed-title-block { min-width: 0; flex: 1; }
        .feed-title {
            font-size: 18px; font-weight: 600; color: var(--black);
            margin: 0; letter-spacing: -0.01em;
        }
        .feed-desc {
            font-size: 14px; color: var(--grey-2);
            margin: 14px 0 18px;
            line-height: 1.55;
        }

        /* URL row — copyable */
        .url-row {
            display: flex; align-items: stretch;
            border: 1px solid var(--border); border-radius: 10px;
            overflow: hidden;
            background: var(--light);
            margin-bottom: 14px;
        }
        .url-row .url-text {
            flex: 1; min-width: 0;
            padding: 10px 14px;
            font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
            font-size: 12px; color: var(--grey-1);
            overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
            background: transparent; border: 0; outline: 0;
            user-select: all;
        }
        .url-row .copy-btn {
            border: 0; border-left: 1px solid var(--border);
            background: #fff;
            padding: 0 16px; font-size: 12px; font-weight: 600;
            color: var(--grey-2); cursor: pointer;
            font-family: inherit;
            display: inline-flex; align-items: center; gap: 6px;
            transition: color 0.15s ease, background 0.15s ease;
        }
        .url-row .copy-btn:hover { color: var(--black); background: var(--light); }
        .url-row .copy-btn.copied { color: var(--orange); }
        .url-row .copy-btn .material-symbols-outlined { font-size: 14px; }

        /* Secondary actions */
        .actions {
            display: flex; flex-wrap: wrap; gap: 8px;
        }
        .btn {
            display: inline-flex; align-items: center; gap: 6px;
            padding: 9px 18px; border-radius: 9999px;
            font-size: 13px; font-weight: 500; text-decoration: none;
            transition: all 0.15s ease;
            font-family: inherit;
            border: 1px solid transparent;
            cursor: pointer;
        }
        .btn-primary {
            background: var(--black); color: #fff;
        }
        .btn-primary:hover { background: #333; color: #fff; }
        .btn-secondary {
            background: #fff; color: var(--grey-1); border-color: #e5e5e5;
        }
        .btn-secondary:hover { border-color: var(--black); color: var(--black); }
        .btn .material-symbols-outlined { font-size: 14px; }

        /* Help block */
        .help {
            margin-top: 40px;
            background: #fff;
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 24px 28px;
        }
        .help h3 {
            font-size: 14px; font-weight: 600;
            color: var(--black); margin: 0 0 8px;
        }
        .help p {
            font-size: 13px; color: var(--grey-2); margin: 0 0 6px;
            line-height: 1.6;
        }
        .help a { color: var(--black); font-weight: 500; }

        .footnote {
            margin-top: 40px;
            font-size: 12px; color: var(--grey-3);
            text-align: center;
        }
        .footnote a { color: var(--grey-3); }

        .toast {
            position: fixed; bottom: 24px; left: 50%;
            transform: translate(-50%, 12px);
            background: var(--black); color: #fff;
            padding: 10px 18px; border-radius: 9999px;
            font-size: 13px; font-weight: 500;
            display: inline-flex; align-items: center; gap: 8px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.18);
            opacity: 0; pointer-events: none;
            transition: opacity 0.2s ease, transform 0.2s ease;
            z-index: 100;
        }
        .toast.show {
            opacity: 1; transform: translate(-50%, 0);
        }
        .toast .material-symbols-outlined { font-size: 16px; color: var(--orange); }
    </style>
</head>
<body>
    <div class="container">
        <p class="eyebrow">Syndication</p>
        <div class="eyebrow-bar"></div>
        <h1>RSS feeds</h1>
        <p class="lede">
            Subscribe via Feedly, NetNewsWire, Inoreader, or any reader you like.
            Copy the URL below and paste it into your reader — each feed refreshes every 30 minutes.
        </p>

        @foreach ($feeds as $feed)
            <div class="feed-card">
                <div class="feed-head">
                    <span class="feed-icon">
                        <span class="material-symbols-outlined">rss_feed</span>
                    </span>
                    <div class="feed-title-block">
                        <h2 class="feed-title">{{ $feed['title'] }}</h2>
                    </div>
                </div>

                <p class="feed-desc">{{ $feed['description'] }}</p>

                <div class="url-row">
                    <input
                        class="url-text"
                        type="text"
                        readonly
                        value="{{ $feed['url'] }}"
                        aria-label="{{ $feed['title'] }} feed URL"
                        onclick="this.select();"
                    />
                    <button
                        type="button"
                        class="copy-btn"
                        data-copy="{{ $feed['url'] }}"
                        data-feed="{{ $feed['title'] }}"
                    >
                        <span class="material-symbols-outlined">content_copy</span>
                        Copy
                    </button>
                </div>

                <div class="actions">
                    <a class="btn btn-primary" href="{{ $feed['url'] }}" target="_blank" rel="noopener">
                        <span class="material-symbols-outlined">open_in_new</span>
                        Open feed
                    </a>
                    <a class="btn btn-secondary" href="{{ $feed['page'] }}">
                        Browse on site
                    </a>
                </div>
            </div>
        @endforeach

        <div class="help">
            <h3>New to RSS?</h3>
            <p>
                RSS is a quiet, ad-free way to follow sites you care about. Pick a reader
                (<a href="https://feedly.com" target="_blank" rel="noopener">Feedly</a>,
                <a href="https://netnewswire.com" target="_blank" rel="noopener">NetNewsWire</a>,
                <a href="https://www.inoreader.com" target="_blank" rel="noopener">Inoreader</a>),
                copy one of the feed URLs above, and paste it into the reader's "Add feed" box.
            </p>
            <p>
                Looking for the AI-discoverability manifest?
                See <a href="/llms.txt">llms.txt</a> &middot; <a href="/sitemap.xml">sitemap.xml</a>.
            </p>
        </div>

        <p class="footnote">
            &copy; {{ date('Y') }} Edatsu Media &middot;
            <a href="/">edatsu.com</a>
        </p>
    </div>

    <div class="toast" id="toast">
        <span class="material-symbols-outlined">check_circle</span>
        <span id="toast-msg">Copied</span>
    </div>

    <script>
        (function () {
            const toast = document.getElementById('toast');
            const toastMsg = document.getElementById('toast-msg');
            let toastTimer;

            const showToast = (msg) => {
                toastMsg.textContent = msg;
                toast.classList.add('show');
                clearTimeout(toastTimer);
                toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
            };

            document.querySelectorAll('.copy-btn').forEach((btn) => {
                btn.addEventListener('click', async () => {
                    const url = btn.dataset.copy;
                    const feedName = btn.dataset.feed || 'feed';
                    try {
                        await navigator.clipboard.writeText(url);
                        btn.classList.add('copied');
                        btn.querySelector('.material-symbols-outlined').textContent = 'check';
                        btn.lastChild.textContent = ' Copied';
                        showToast(feedName + ' URL copied to clipboard');
                        setTimeout(() => {
                            btn.classList.remove('copied');
                            btn.querySelector('.material-symbols-outlined').textContent = 'content_copy';
                            btn.lastChild.textContent = ' Copy';
                        }, 2000);
                    } catch {
                        // Fallback: select the visible input so the user can hit Cmd/Ctrl-C
                        const input = btn.previousElementSibling;
                        if (input && input.select) input.select();
                        showToast('Press Ctrl/Cmd+C to copy');
                    }
                });
            });
        })();
    </script>
</body>
</html>
