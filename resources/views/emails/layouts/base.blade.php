<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'Edatsu Media')</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f5f5f7;
            color: #1d1d1f;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
        }
        .wrapper { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .card {
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
        }
        .hero {
            background: linear-gradient(135deg, #1d1d1f 0%, #2d2d2f 50%, #1d1d1f 100%);
            padding: 48px 40px 40px;
            text-align: center;
        }
        .logo-img {
            display: block;
            width: 64px; height: 64px;
            margin: 0 auto 24px;
            border-radius: 12px;
        }
        .hero h1 {
            font-size: 26px; font-weight: 600; color: #ffffff;
            margin-bottom: 8px; letter-spacing: -0.3px;
        }
        .hero p { font-size: 15px; color: rgba(255, 255, 255, 0.7); }
        .body-content { padding: 40px; }
        .greeting {
            font-size: 18px; font-weight: 600;
            color: #1d1d1f; margin-bottom: 16px;
        }
        .body-content p {
            font-size: 15px; color: #424245;
            margin-bottom: 16px; line-height: 1.7;
        }
        .body-content strong { color: #1d1d1f; font-weight: 600; }
        .features { margin: 28px 0; padding: 0; list-style: none; }
        .features li {
            display: flex; align-items: flex-start; gap: 12px;
            padding: 12px 0; border-bottom: 1px solid #f0f0f0;
            font-size: 14px; color: #424245;
        }
        .features li:last-child { border-bottom: none; }
        .feature-icon {
            flex-shrink: 0; width: 32px; height: 32px;
            background: #fff7ed; border-radius: 8px;
            display: flex; align-items: center; justify-content: center;
            font-size: 16px;
        }
        .feature-text strong {
            display: block; color: #1d1d1f;
            font-weight: 600; margin-bottom: 2px;
        }
        .cta-section { text-align: center; margin: 32px 0 8px; }
        .cta-button {
            display: inline-block; background: #1d1d1f;
            color: #ffffff !important; text-decoration: none;
            padding: 14px 36px; border-radius: 980px;
            font-size: 14px; font-weight: 600; letter-spacing: 0.2px;
            transition: background 0.2s;
        }
        .cta-button:hover { background: #424245; }
        .cta-button.secondary { background: #f97316; }
        .cta-button.secondary:hover { background: #ea580c; }
        .tag-pill {
            display: inline-block; padding: 4px 12px;
            background: #fff7ed; color: #c2410c;
            border-radius: 999px; font-size: 12px; font-weight: 500;
            margin: 2px 4px 2px 0;
        }
        .quote-box {
            margin: 24px 0; padding: 20px 24px;
            background: #fafafa; border-left: 3px solid #f97316;
            border-radius: 8px; font-size: 14px;
            color: #424245; line-height: 1.6;
        }
        .divider { height: 1px; background: #f0f0f0; margin: 0 40px; }
        .footer { padding: 28px 40px; text-align: center; }
        .footer p { font-size: 13px; color: #86868b; margin-bottom: 6px; }
        .footer a { color: #f97316; text-decoration: none; }
        .social-links { margin-top: 16px; }
        .social-links a {
            display: inline-block; margin: 0 8px;
            color: #86868b; text-decoration: none; font-size: 13px;
        }
        @media (max-width: 480px) {
            .wrapper { padding: 20px 12px; }
            .hero { padding: 36px 24px 32px; }
            .hero h1 { font-size: 22px; }
            .body-content { padding: 28px 24px; }
            .divider { margin: 0 24px; }
            .footer { padding: 24px; }
        }
    </style>
    @yield('extra_styles')
</head>
<body>
    <div class="wrapper">
        <div class="card">
            <div class="hero">
                <img src="{{ url('/img/logo/main.png') }}" alt="Edatsu Media" class="logo-img" width="64" height="64">
                <h1>@yield('hero_title')</h1>
                @hasSection('hero_subtitle')
                    <p>@yield('hero_subtitle')</p>
                @endif
            </div>

            <div class="body-content">
                @yield('content')
            </div>

            <div class="divider"></div>

            <div class="footer">
                @hasSection('footer_note')
                    @yield('footer_note')
                @else
                    <p>Questions? Just reply to this email &mdash; we'd love to help.</p>
                @endif
                <p>&copy; {{ date('Y') }} Edatsu Media. All rights reserved.</p>
                <div class="social-links">
                    <a href="{{ $appUrl ?? config('app.url') }}">Visit Website</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
