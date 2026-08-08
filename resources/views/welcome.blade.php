<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        
        <!-- Primary SEO Meta Tags -->
        <title>NeonForge | Futuristic Cyberpunk Gaming Setup Store</title>
        <meta name="description" content="Forge your ultimate battlestation at NeonForge. Discover customized cyberpunk gaming desks, modular ambient display units, custom mechanical keyboards, and low-latency RGB synchronization modules.">
        <meta name="keywords" content="cyberpunk gaming setup, gaming desk, mechanical keyboard, RGB light sync, custom PC setup, gaming battlestation">
        <meta name="author" content="NeonForge Syndicate">

        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:title" content="NeonForge | Futuristic Cyberpunk Gaming Setup Store">
        <meta property="og:description" content="Configure and order premium, high-end handcrafted cyberpunk setups and custom mechanical accessories. Zero latency, 5-year warranty.">
        <meta property="og:image" content="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=60">

        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:title" content="NeonForge | Futuristic Cyberpunk Gaming Setup Store">
        <meta property="twitter:description" content="Configure and order premium, high-end handcrafted cyberpunk setups and custom mechanical accessories. Zero latency, 5-year warranty.">

        <!-- Favicon -->
        <link rel="icon" type="image/x-icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>">

        <!-- Vite Assets -->
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    </head>
    <body class="antialiased">
        <!-- React Mounting Target -->
        <div id="app"></div>
    </body>
</html>
