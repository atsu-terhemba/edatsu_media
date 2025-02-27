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
    @vite(['resources/css/app.css', 'resources/css/style.css', 'resources/js/app.jsx'])
</head>
    <body class="font-sans antialiased">
        @inertia
        <script async src="https://static.sppopups.com/assets/loader.js" data-chats-widget-id="44b6013b-cef7-48ae-9b44-4d2fce1ee18d"></script>
        <script type="text/javascript">
        spPopupsScript = document.createElement('script')
        spPopupsScript.src = 'https://static.sppopups.com/assets/loader.js';
        spPopupsScript.async = true;
        spPopupsScript.setAttribute("data-chats-widget-id",'44b6013b-cef7-48ae-9b44-4d2fce1ee18d');
        document.head.appendChild(spPopupsScript);
        </script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    </body>
</html>



