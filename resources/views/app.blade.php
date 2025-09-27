<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="application-name" content="Edatsu Media">
    <link rel="icon" type="image/png" sizes="192x192" href="{{asset('img/icons/android-icon-192x192.png')}}">
    <link rel="icon" type="image/png" sizes="144x144" href="{{asset('img/icons/android-icon-144x144.png')}}">
    <link rel="icon" type="image/png" sizes="96x96" href="{{asset('img/icons/android-icon-96x96.png')}}">
    <link rel="icon" type="image/png" sizes="72x72" href="{{asset('img/icons/android-icon-72x72.png')}}">
    <link rel="icon" type="image/png" sizes="48x48" href="{{asset('img/icons/android-icon-48x48.png')}}">
    <link rel="icon" type="image/png" sizes="36x36" href="{{asset('img/icons/android-icon-36x36.png')}}">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="apple-touch-icon" sizes="57x57" href="{{asset('img/icons/apple-icon-57x57.png')}}">
    <link rel="apple-touch-icon" sizes="60x60" href="{{asset('img/icons/apple-icon-60x60.png')}}">
    <link rel="apple-touch-icon" sizes="72x72" href="{{asset('img/icons/apple-icon-72x72.png')}}">
    <link rel="apple-touch-icon" sizes="76x76" href="{{asset('img/icons/apple-icon-76x76.png')}}">
    <link rel="apple-touch-icon" sizes="114x114" href="{{asset('img/icons/apple-icon-114x114.png')}}">
    <link rel="apple-touch-icon" sizes="120x120" href="{{asset('img/icons/apple-icon-120x120.png')}}">
    <link rel="apple-touch-icon" sizes="144x144" href="{{asset('img/icons/apple-icon-144x144.png')}}">
    <link rel="apple-touch-icon" sizes="152x152" href="{{asset('img/icons/apple-icon-152x152.png')}}">
    <link rel="apple-touch-icon" sizes="180x180" href="{{asset('img/icons/apple-icon-180x180.png')}}">
    <link rel="icon" type="image/png" sizes="32x32" href="{{asset('img/icons/favicon-32x32.png')}}">
    <link rel="icon" type="image/png" sizes="96x96" href="{{asset('img/icons/favicon-96x96.png')}}">
    <link rel="icon" type="image/png" sizes="16x16" href="{{asset('img/icons/favicon-16x16.png')}}">        
    <link rel="manifest" href="/manifest-en.json">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="msapplication-TileImage" content="img/icons/ms-icon-144x144.png">
    <meta name="theme-color" content="#ffffff">
    
    <!-- Google Material Icons -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    
    <!-- Laravel 12 Font - Instrument Sans -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet">
    
    <!-- Laravel 12 Typography Styles -->
    <style>
        * {
            font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
        }
        
        body {
            font-size: 0.875rem; /* 14px */
            line-height: 1.5;
            font-weight: 400;
            letter-spacing: -0.011em;
        }
        
        h1 { font-size: 2.25rem; font-weight: 800; line-height: 1.2; letter-spacing: -0.025em; }
        h2 { font-size: 1.875rem; font-weight: 700; line-height: 1.3; letter-spacing: -0.025em; }
        h3 { font-size: 1.5rem; font-weight: 600; line-height: 1.4; letter-spacing: -0.025em; }
        h4 { font-size: 1.25rem; font-weight: 600; line-height: 1.4; letter-spacing: -0.025em; }
        h5 { font-size: 1.125rem; font-weight: 600; line-height: 1.4; letter-spacing: -0.025em; }
        h6 { font-size: 1rem; font-weight: 600; line-height: 1.4; letter-spacing: -0.025em; }
        
        small { font-size: 0.75rem; }
        .text-sm { font-size: 0.875rem; }
        .text-base { font-size: 1rem; }
        .text-lg { font-size: 1.125rem; }
        .text-xl { font-size: 1.25rem; }
    </style>
    
    <!-- Original Font (Commented Out)
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    -->
    
    <script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "lpdlomf74u");
    </script>
    <!--Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-1Z7BZW1CTX"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-1Z7BZW1CTX');
    </script>
    <script>
    //--update page manifest-->
    const manifestLink = document.getElementById('manifest-link');
    if (manifestLink) {
        const userLanguage = navigator.language || navigator.userLanguage;
        if (userLanguage.startsWith('fr')) {
            manifestLink.href = '/manifest-fr.json';
        } else {
            manifestLink.href = '/manifest-en.json';
        }
    }
    </script>
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
    <!-- @vite(['resources/css/app.css', 'resources/css/style.css', 'resources/js/app.jsx']) -->
</head>
    <body class="font-sans antialiased">
        @inertia
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    </body>
</html>



