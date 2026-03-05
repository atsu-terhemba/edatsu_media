<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Session Expired - Edatsu Media</title>
    <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('img/icons/favicon-32x32.png') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Instrument Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #000;
            color: #fff;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            -webkit-font-smoothing: antialiased;
        }

        /* Animated background */
        .bg-glow {
            position: fixed;
            border-radius: 50%;
            filter: blur(120px);
            pointer-events: none;
            opacity: 0.5;
        }

        .bg-glow-1 {
            top: -20%;
            right: -10%;
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, transparent 70%);
            animation: float1 8s ease-in-out infinite;
        }

        .bg-glow-2 {
            bottom: -20%;
            left: -10%;
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, rgba(249, 115, 22, 0.08) 0%, transparent 70%);
            animation: float2 10s ease-in-out infinite;
        }

        @keyframes float1 {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(-30px, 20px); }
        }

        @keyframes float2 {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(20px, -30px); }
        }

        .container {
            position: relative;
            z-index: 1;
            text-align: center;
            padding: 40px 24px;
            max-width: 480px;
            width: 100%;
        }

        /* Lock icon */
        .icon-wrap {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.06);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 32px;
            position: relative;
            animation: pulse-ring 3s ease-in-out infinite;
        }

        .icon-wrap::before {
            content: '';
            position: absolute;
            inset: -8px;
            border-radius: 50%;
            border: 1px solid rgba(249, 115, 22, 0.1);
            animation: pulse-outer 3s ease-in-out infinite;
        }

        @keyframes pulse-ring {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        @keyframes pulse-outer {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.1); opacity: 0; }
        }

        .icon-wrap .material-symbols-outlined {
            font-size: 32px;
            color: #f97316;
            font-variation-settings: 'FILL' 0, 'wght' 300;
        }

        /* Error code */
        .error-code {
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: rgba(255, 255, 255, 0.25);
            margin-bottom: 16px;
        }

        .error-code span {
            color: #f97316;
        }

        /* Heading */
        h1 {
            font-size: clamp(28px, 5vw, 36px);
            font-weight: 600;
            letter-spacing: -0.03em;
            line-height: 1.15;
            margin-bottom: 16px;
            color: #fff;
        }

        /* Description */
        .description {
            font-size: 15px;
            line-height: 1.6;
            color: rgba(255, 255, 255, 0.4);
            margin-bottom: 40px;
            max-width: 380px;
            margin-left: auto;
            margin-right: auto;
        }

        /* Buttons */
        .btn-group {
            display: flex;
            flex-direction: column;
            gap: 12px;
            align-items: center;
        }

        @media (min-width: 480px) {
            .btn-group {
                flex-direction: row;
                justify-content: center;
            }
        }

        .btn-primary {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 13px 32px;
            border-radius: 9999px;
            font-size: 14px;
            font-weight: 500;
            text-decoration: none;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
            background: #fff;
            color: #000;
        }

        .btn-primary:hover {
            background: rgba(255, 255, 255, 0.9);
            box-shadow: 0 8px 32px rgba(255, 255, 255, 0.1);
            transform: translateY(-1px);
        }

        .btn-primary .material-symbols-outlined {
            font-size: 18px;
        }

        .btn-secondary {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 13px 32px;
            border-radius: 9999px;
            font-size: 14px;
            font-weight: 500;
            text-decoration: none;
            border: 1px solid rgba(255, 255, 255, 0.12);
            cursor: pointer;
            transition: all 0.2s ease;
            background: transparent;
            color: rgba(255, 255, 255, 0.7);
        }

        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.06);
            border-color: rgba(255, 255, 255, 0.25);
            color: #fff;
        }

        .btn-secondary .material-symbols-outlined {
            font-size: 18px;
        }

        /* Divider */
        .divider {
            display: flex;
            align-items: center;
            gap: 16px;
            margin: 36px 0;
            color: rgba(255, 255, 255, 0.15);
            font-size: 12px;
            font-weight: 500;
            letter-spacing: 0.1em;
            text-transform: uppercase;
        }

        .divider::before,
        .divider::after {
            content: '';
            flex: 1;
            height: 1px;
            background: rgba(255, 255, 255, 0.06);
        }

        /* Help text */
        .help-text {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.25);
            line-height: 1.5;
        }

        .help-text a {
            color: rgba(255, 255, 255, 0.5);
            text-decoration: none;
            transition: color 0.15s ease;
        }

        .help-text a:hover {
            color: #f97316;
        }

        /* Timer animation */
        .timer-bar {
            width: 200px;
            height: 3px;
            background: rgba(255, 255, 255, 0.06);
            border-radius: 9999px;
            margin: 32px auto 0;
            overflow: hidden;
        }

        .timer-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, #f97316, #ea580c);
            border-radius: 9999px;
            width: 0%;
            animation: timer-fill 10s linear forwards;
        }

        @keyframes timer-fill {
            from { width: 0%; }
            to { width: 100%; }
        }

        .timer-label {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.2);
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <!-- Background glows -->
    <div class="bg-glow bg-glow-1"></div>
    <div class="bg-glow bg-glow-2"></div>

    <div class="container">
        <!-- Animated icon -->
        <div class="icon-wrap">
            <span class="material-symbols-outlined">schedule</span>
        </div>

        <!-- Error code -->
        <div class="error-code">Error <span>419</span></div>

        <!-- Heading -->
        <h1>Session Expired</h1>

        <!-- Description -->
        <p class="description">
            Your session has timed out for security reasons. Please refresh the page or log in again to continue.
        </p>

        <!-- Action buttons -->
        <div class="btn-group">
            <a href="javascript:location.reload()" class="btn-primary">
                <span class="material-symbols-outlined">refresh</span>
                Refresh Page
            </a>
            <a href="/login" class="btn-secondary">
                <span class="material-symbols-outlined">login</span>
                Log In
            </a>
        </div>

        <!-- Divider -->
        <div class="divider">or</div>

        <!-- Help text -->
        <p class="help-text">
            Go back to the <a href="/">homepage</a> or <a href="/opportunities">browse opportunities</a>
        </p>

        <!-- Auto-refresh timer -->
        <div class="timer-bar">
            <div class="timer-bar-fill"></div>
        </div>
        <p class="timer-label">Auto-refreshing in 10 seconds...</p>
    </div>

    <script>
        // Auto-refresh after 10 seconds
        setTimeout(function() {
            location.reload();
        }, 10000);
    </script>
</body>
</html>
