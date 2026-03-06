const CACHE_NAME = 'hisa-spominov-v2';

// Cache strategies
const CACHE_STRATEGIES = {
    CORE: 'cache-first',
    PAGES: 'stale-while-revalidate',
    TEXTURES: 'cache-first'
};

// Cache configurations
const CACHE_CONFIG = {
    core: {
        maxAge: 7 * 24 * 60 * 60 // 7 days
    },
    pages: {
        maxAge: 24 * 60 * 60, // 1 day
        maxEntries: 50
    },
    textures: {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        maxEntries: 20
    }
};

// Core assets - always cached
const CORE_URLS = [
    '/',
    '/index.html',
    '/slog.css',
    '/flipbook.js',
    '/kazalo.js',
    '/manifest.json',
    '/sw.js',
    '/sredstva/naslovnica.jpg'
];

// Install event
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME + '-core')
            .then(function(cache) {
                console.log('Caching core assets');
                return cache.addAll(CORE_URLS);
            })
            .then(function() {
                return self.skipWaiting();
            })
    );
});

// Activate event - cleanup
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys()
            .then(function(cacheNames) {
                return Promise.all(
                    cacheNames
                        .filter(function(name) {
                            return name.startsWith('hisa-spominov-') && name !== CACHE_NAME + '-core' && name !== CACHE_NAME + '-pages';
                        })
                        .map(function(name) {
                            console.log('Deleting cache:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(function() {
                return self.clients.claim();
            })
    );
});

// Fetch event with strategies
self.addEventListener('fetch', function(event) {
    const url = new URL(event.request.url);
    
    // Skip cross-origin
    if (url.origin !== location.origin) {
        return;
    }
    
    // Skip PDF files
    if (url.pathname.includes('.pdf')) {
        return;
    }
    
    // Choose strategy
    let strategy = 'cache-first';
    
    if (url.pathname.includes('sredstva') || url.pathname.includes('texture')) {
        strategy = CACHE_STRATEGIES.TEXTURES;
    } else if (url.pathname.includes('.js') || url.pathname.includes('.css') || url.pathname.includes('.html')) {
        strategy = CACHE_STRATEGIES.CORE;
    }
    
    if (strategy === 'cache-first') {
        event.respondWith(cacheFirst(event.request));
    } else if (strategy === 'stale-while-revalidate') {
        event.respondWith(staleWhileRevalidate(event.request));
    }
});

// Cache-first strategy
async function cacheFirst(request) {
    const cache = await caches.open(CACHE_NAME + '-core');
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        return new Response('Offline', { status: 503 });
    }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_NAME + '-pages');
    const cachedResponse = await cache.match(request);
    
    const fetchPromise = fetch(request)
        .then(function(networkResponse) {
            if (networkResponse && networkResponse.status === 200) {
                cache.put(request, networkResponse.clone());
            }
            return networkResponse;
        })
        .catch(function() {
            return cachedResponse || new Response('Offline', { status: 503 });
        });
    
    return cachedResponse || fetchPromise;
}

// Handle messages from main thread
self.addEventListener('message', function(event) {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});
