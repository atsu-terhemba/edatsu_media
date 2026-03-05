<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Maintenance - Edatsu Media</title>
    <meta name="robots" content="noindex, nofollow">
    <link rel="icon" type="image/png" sizes="32x32" href="/img/icons/favicon-32x32.png">
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
        .icon {
            width: 80px; height: 80px; border-radius: 20px;
            background: rgba(249,115,22,0.1); display: flex;
            align-items: center; justify-content: center;
            margin: 0 auto 24px;
        }
        .icon .material-symbols-outlined { font-size: 40px; color: #f97316; }
        h1 { font-size: 24px; font-weight: 600; margin-bottom: 12px; }
        p { font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.6; margin-bottom: 32px; }
        .btn {
            display: inline-flex; align-items: center; gap: 6px;
            padding: 12px 28px; border-radius: 9999px;
            background: transparent; color: #fff; font-size: 14px; font-weight: 500;
            text-decoration: none; border: 1px solid rgba(255,255,255,0.2);
            cursor: pointer;
        }
        .btn:hover { background: rgba(255,255,255,0.08); }
    </style>
    <meta http-equiv="refresh" content="30">
</head>
<body>
    <div class="container">
        <div class="icon">
            <span class="material-symbols-outlined">construction</span>
        </div>
        <h1>We'll be right back</h1>
        <p>Edatsu Media is currently undergoing maintenance. We're working to improve your experience and will be back shortly.</p>
        <button class="btn" onclick="window.location.reload()">
            <span class="material-symbols-outlined" style="font-size:18px">refresh</span>
            Refresh
        </button>
    </div>
</body>
</html>
