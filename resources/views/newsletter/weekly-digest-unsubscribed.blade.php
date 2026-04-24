<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Unsubscribed — Edatsu Media</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: #f5f5f7;
            color: #1d1d1f;
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
        }
        .card {
            max-width: 460px;
            background: #fff;
            border-radius: 16px;
            padding: 48px 36px;
            text-align: center;
            box-shadow: 0 4px 24px rgba(0,0,0,0.06);
        }
        h1 {
            font-size: 22px;
            font-weight: 600;
            margin: 0 0 12px;
            letter-spacing: -0.01em;
        }
        p {
            font-size: 14px;
            color: #86868b;
            line-height: 1.6;
            margin: 0 0 24px;
        }
        .check {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: #ecfdf5;
            color: #16a34a;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: 700;
            margin: 0 auto 20px;
        }
        a.btn {
            display: inline-block;
            background: #000;
            color: #fff;
            text-decoration: none;
            padding: 12px 28px;
            border-radius: 9999px;
            font-size: 14px;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="check">&check;</div>
        <h1>You're unsubscribed</h1>
        <p>
            You won't receive the weekly opportunity digest any more. You can turn it back on
            at any time from your preferences.
        </p>
        <a class="btn" href="{{ $appUrl }}/preferences">Edit preferences</a>
    </div>
</body>
</html>
