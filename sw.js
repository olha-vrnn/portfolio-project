const staticCacheName = 'static-portfolio-v2';
const dynamicCacheName = 'dynamic-portfolio-v2';

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
    const cache = await caches.open(staticCacheName);
    await cache.addAll(assets);
});

self.addEventListener('activate', async e => {
    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames
            .filter(name => name !== staticCacheName)
            .filter(name => name !== dynamicCacheName)
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
    const cache = await caches.open(dynamicCacheName);
    try {
        const response = await fetch(request);
        await cache.put(request, response.clone());
        return response
    } catch (e) {
        const cached = await cache.match(request.url);
        return cached || await caches.match('./offline.html')
    }
}
