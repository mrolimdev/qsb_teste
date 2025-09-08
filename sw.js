const CACHE_NAME = 'quem-sou-eu-na-biblia-cache-v34';
const urlsToCache = [
  '/index.html',
  '/index.tsx',
  '/i18n.ts',
  '/locales/en/translation.ts',
  '/locales/es/translation.ts',
  '/locales/pt/translation.ts',
  'https://sites.arquivo.download/Quem%20Sou%20Eu%20na%20Biblia/Logo%20compacto%20Quem%20sou%20eu%20na%20Bi%CC%81blia.png',
  'https://sites.arquivo.download/Quem%20Sou%20Eu%20na%20Biblia/Compartilhamento_Social.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto na instalação, buscando assets frescos...');
        const cachePromises = urlsToCache.map(urlToCache => {
          const request = new Request(urlToCache, { cache: 'no-store' });
          return fetch(request).then(response => {
            if (!response.ok) {
              throw new Error(`Falha ao buscar ${urlToCache}: ${response.statusText}`);
            }
            return cache.put(request, response);
          });
        });
        return Promise.all(cachePromises);
      })
      .then(() => {
        console.log('Todos os assets frescos foram cacheados com sucesso.');
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  if (request.url.includes('supabase.co') || request.url.includes('api.automacao.click')) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then(networkResponse => {
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(request, responseToCache);
        });
        return networkResponse;
      })
      .catch(() => {
        return caches.match(request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
        });
      })
  );
});