const CACHE_NAME = 'offline';
const OFFLINE_URL = 'offline.html';

const urlsToCache = ["/"];

self.addEventListener('install', function(event) {
  console.log('[ServiceWorker] Install');
});

self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil((async () => {
    // Enable navigation preload if it's supported - starting the network request while the service worker is booting up.
    // See https://developers.google.com/web/updates/2017/02/navigation-preload
    if ('navigationPreload' in self.registration) {
      await self.registration.navigationPreload.enable();
    }
  })());

  // // Tell the active service worker to take control of the page immediately.
   self.clients.claim();
});

self.addEventListener('fetch', async (event) => {
  // We only want to handle GET requests
  if (event.request.method !== "GET") {
    return;
  }

 //We open the cache and check the type of the assets, then we use the caching strategy
  event.respondWith(caches.open(CACHE_NAME).then((cache) => {
    try {
    switch (event.request.destination) {
      case ('document'):
      case ('build'):
      case ('manifest'):
      ////////NETWORK FIRST CALLBACK TO CACHE
        return fetch(event.request.url).then((fetchedResponse) => {
          cache.put(event.request, fetchedResponse.clone());
  
          return fetchedResponse;
        }).catch(() => {
          // If the network is unavailable, get the cache 
          return cache.match(event.request.url);
        });
      //Checking if URL has the snippet.id _data
      case (""):
        if(event.request.url.includes("_data")){
          return fetch(event.request.url).then((fetchedResponse) => {
            cache.put(event.request, fetchedResponse.clone());
    
            return fetchedResponse;
          }).catch(() => {
            // If the network is unavailable, get the cache
            return cache.match(event.request.url);
          })
        };
        case ('style'):
        case ('script'):
        case ('image'):
        case ('font'):
            // Go to the cache first
            return cache.match(event.request.url).then((cachedResponse) => {
              // Return a cached response if we have one
              if (cachedResponse) {
                return cachedResponse;
              }
      
              // Otherwise, hit the network
              return fetch(event.request).then((fetchedResponse) => {
                // Add the network response to the cache for later visits
                cache.put(event.request, fetchedResponse.clone());
      
                // Return the network response
                return fetchedResponse;
              });
            });
    }
  } catch (error) {
    console.log('[Service Worker] Fetch failed; returning offline page instead.', error);
    return null;
  }
  }))
});


