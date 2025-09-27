<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $title }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #007bff;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background-color: #f8f9fa;
            padding: 30px;
            border-radius: 0 0 8px 8px;
        }
        .button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $title }}</h1>
    </div>
    
    <div class="content">
        <h2>Hello {{ $user->name }}!</h2>
        
        <p>{{ $message }}</p>
        
        <p>We thought you'd be interested based on your preferences settings.</p>
        
        <a href="{{ $actionUrl }}" class="button">View Details</a>
        
        <p><strong>Don't miss out!</strong> Click the button above to check out the details and take action.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        
        <p><small>This email was sent because you have enabled preference notifications in your account settings. You can manage your notification preferences <a href="{{ $appUrl }}/preferences">here</a>.</small></p>
    </div>
    
    <div class="footer">
        <p>Best regards,<br>The Edatsu Media Team</p>
        <p><a href="{{ $appUrl }}">Visit our website</a></p>
    </div>
</body>
</html>
