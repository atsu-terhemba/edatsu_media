<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Page Not Found - Edatsu Media</title>
    <meta name="robots" content="noindex, nofollow">
    <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('img/icons/favicon-32x32.png') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Instrument Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #000;
            color: #fff;
        }
        .container { text-align: center; padding: 40px 24px; max-width: 480px; }
        .error-code {
            font-size: 96px;
            font-weight: 800;
            letter-spacing: -4px;
            background: linear-gradient(135deg, #f97316, #fb923c);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            line-height: 1;
            margin-bottom: 16px;
        }
        h1 { font-size: 24px; font-weight: 600; margin-bottom: 12px; }
        p { font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.6; margin-bottom: 32px; }
        .actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .btn {
            display: inline-flex; align-items: center; gap: 6px;
            padding: 12px 28px; border-radius: 9999px;
            font-size: 14px; font-weight: 500; text-decoration: none;
            transition: all 0.2s; border: none; cursor: pointer;
        }
        .btn-primary { background: #f97316; color: #fff; }
        .btn-primary:hover { background: #ea580c; }
        .btn-outline {
            background: transparent; color: #fff;
            border: 1px solid rgba(255,255,255,0.2);
        }
        .btn-outline:hover { background: rgba(255,255,255,0.08); }
        .material-symbols-outlined { font-size: 18px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="error-code">404</div>
        <h1>Page not found</h1>
        <p>The page you're looking for doesn't exist or has been moved. Let's get you back on track.</p>
        <div class="actions">
            <a href="/" class="btn btn-primary">
                <span class="material-symbols-outlined">home</span>
                Go Home
            </a>
            <a href="/opportunities" class="btn btn-outline">
                <span class="material-symbols-outlined">explore</span>
                Browse Opportunities
            </a>
        </div>
    </div>
</body>
</html>
