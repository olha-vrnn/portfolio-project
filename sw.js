const staticCache = 'static-portfolio-v5';
const dynamicCache = 'dynamic-portfolio-v5';

let assets = [
    'index.html',
    'manifest.json',
    'script.js',
    'style.css',
    'offline.html',
    '/img/icons/icon-192x192.png',
    '/img/icons//icon-256x256.png',
    '/img/icons//icon-384x384.png',
    '/img/icons//icon-512x512.png',
];

self.addEventListener('install', async e => {
    const cache = await caches.open(staticCache);
    await cache.addAll(assets);
});

self.addEventListener('activate', async e => {
    const cache = await caches.keys();
    await Promise.all(
        cache.filter(name => name !== staticCache)
            .filter(name => name !== dynamicCache)
            .map(name => caches.delete(name))
    );
});

self.addEventListener('fetch', e => {
    const { request } = e;

    const url = new URL(request.url);
    if (url.origin === location.origin) {
        e.respondWith(cacheFirst(request));
    } else {
        e.respondWith(networkFirst(request));
    }
});


async function cacheFirst(request) {
    const cached = await caches.match(request);
    return cached || await fetch(request);
};

async function networkFirst(request) {
    const cache = await caches.open(dynamicCache);
    try {
        const response = await fetch(request);
        await cache.put(request, response.clone());
        return response
    } catch (e) {
        const cached = await cache.match(request.url);
        return cached || await caches.match('./offline.html')
    }
};
