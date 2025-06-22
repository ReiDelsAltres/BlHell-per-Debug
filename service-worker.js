/* Manifest version: HZxGDjwy */
// Caution! Be sure you understand the caveats before publishing an application with
// offline support. See https://aka.ms/blazor-offline-considerations


self.importScripts('./service-worker-assets.js');

self.addEventListener('install', event => event.waitUntil(onInstall(event)));
self.addEventListener('activate', event => event.waitUntil(onActivate(event)));
self.addEventListener('fetch', event => event.respondWith(onFetch(event)));

const cacheNamePrefix = 'offline-cache-';
const cacheName = `${cacheNamePrefix}${self.assetsManifest.version}`;
const offlineAssetsInclude = [/\.dll$/, /\.pdb$/, /\.wasm/, /\.html/, /\.js$/, /\.json$/, /\.br$/, /\.css$/, /\.woff$/, /\.png$/, /\.jpe?g$/, /\.gif$/, /\.ico$/, /\.blat$/, /\.dat$/,/\.woff2$/];
const offlineAssetsExclude = [/^service-worker\.js$/];

async function onInstall(event) {
    self.skipWaiting(); // Force the service worker to take control immediately

    const expectedCacheName = `${cacheNamePrefix}${self.assetsManifest.version}`;

    const cacheNames = await caches.keys();
    const alreadyCached = cacheNames.includes(expectedCacheName);

    if (alreadyCached) {
        console.log('[SW] Cache already up to date:', expectedCacheName);
        return;
    }

    const assets = self.assetsManifest.assets
        .filter(asset => offlineAssetsInclude.some(pattern => pattern.test(asset.url)))
        .filter(asset => !offlineAssetsExclude.some(pattern => pattern.test(asset.url)))

    //const assetsRequests = assets.map(asset => asset.url);

    const assetsRequests = assets.map(asset => {
        return new Request(asset.url, { integrity: asset.hash, cache: 'no-cache' })
    });

    await caches.open(cacheName).then(cache => cache.addAll(assetsRequests));
    console.log('[SW] Cached new version:', expectedCacheName);
}

async function onActivate(event) {
    const cacheKeys = await caches.keys();

    await Promise.all(cacheKeys
        .filter(key => key.startsWith(cacheNamePrefix) && key !== cacheName)
        .map(key => caches.delete(key)));

    await clients.claim(); // Take control of all clients immediately
}

async function onFetch(event) {
    if (event.request.method !== 'GET') {
        return fetch(event.request);
    }

    const url = new URL(event.request.url);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
        return fetch(event.request);
    }

    return await caches.open(cacheName).then(async cache => {
        try {
            const networkResponse = await fetch(event.request);

            if (networkResponse && networkResponse.ok) {
                cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;

        } catch (error) {
            const cachedResponse = await cache.match(event.request);
            if (cachedResponse) {
                return cachedResponse;
            }

            if (event.request.mode === 'navigate') {
                return cache.match('index.html');
            }

            return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
        }
    });
}
