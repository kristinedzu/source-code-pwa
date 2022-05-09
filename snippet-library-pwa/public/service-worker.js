const CACHE_NAME = 'offline';
const OFFLINE_URL = 'offline.html';

const urlsToCache = ["/"];

self.addEventListener('install', function(event) {
  console.log('[ServiceWorker] Install');
  
  // event.waitUntil((async () => {
  //   const cache = await caches.open(CACHE_NAME);
  //   // Setting {cache: 'reload'} in the new request will ensure that the response
  //   // isn't fulfilled from the HTTP cache; i.e., it will be from the network.
  //   await cache.add(new Request(OFFLINE_URL, {cache: 'reload'}));
  // })());

//   event.waitUntil(
//     caches.open(CACHE_NAME)
//     .then(cache => {
//        return cache.addAll(urlsToCache);
//     })
//  );
  
  // self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil((async () => {
    // Enable navigation preload if it's supported.
    // See https://developers.google.com/web/updates/2017/02/navigation-preload
    if ('navigationPreload' in self.registration) {
      await self.registration.navigationPreload.enable();
    }
  })());

  // // Tell the active service worker to take control of the page immediately.
   self.clients.claim();
});

// self.addEventListener('fetch', function(event) {
//   // console.log('[Service Worker] Fetch', event.request.url);
//   if (event.request.mode === 'navigate') {
//     event.respondWith((async () => {
//       try {
//         const preloadResponse = await event.preloadResponse;
//         if (preloadResponse) {
//           return preloadResponse;
//         }

//         const networkResponse = await fetch(event.request);
//         return networkResponse;
//       } catch (error) {
//         console.log('[Service Worker] Fetch failed; returning offline page instead.', error);

//         const cache = await caches.open(CACHE_NAME);
//         const cachedResponse = await cache.match(urlsToCache);
//         return cachedResponse;
//       }
//     })());
//   }
// });

self.addEventListener('fetch', async (event) => {
  // We only want to handle GET requests
  if (event.request.method !== "GET") {
    return;
  }
  // if (event.request.mode === 'navigate') {
  //       event.respondWith((async () => {
  //         try {
  //           const preloadResponse = await event.preloadResponse;
  //           if (preloadResponse) {
  //             return preloadResponse;
  //           }
    
  //           const networkResponse = await fetch(event.request);
  //           return networkResponse;
  //         } catch (error) {
  //           console.log('[Service Worker] Fetch failed; returning offline page instead.', error);
  //           return null;
  //         }
  //       })());
  //     }
    
  console.log(event.request);
  // //Is this a request for a document?
  // if (event.request.destination === 'document' || 'image') {
  //   // Open the cache
  //   event.respondWith(caches.open(CACHE_NAME).then((cache) => {
  //     // Respond with the document from the cache or from the network
  //     return cache.match(event.request).then((cachedResponse) => {
  //       return cachedResponse || fetch(event.request.url).then((fetchedResponse) => {
  //         // Add the network response to the cache for future visits.
  //         // Note: we need to make a copy of the response to save it in
  //         // the cache and use the original as the request response.
  //         cache.put(event.request, fetchedResponse.clone());

  //         // Return the network response
  //         return fetchedResponse;
  //       });
  //     });
  //   }));
  // }else if (event.request.destination === 'style') {
    
  // }else {
  //   return;
  // }
  event.respondWith(caches.open(CACHE_NAME).then((cache) => {
    try {
    switch (event.request.destination) {
      case ('document'):
      case ('build'):
      case ('manifest'):
      //Network first fallback to cache
        return fetch(event.request.url).then((fetchedResponse) => {
          cache.put(event.request, fetchedResponse.clone());
  
          return fetchedResponse;
        }).catch(() => {
          // If the network is unavailable, get
          return cache.match(event.request.url);
        });
      //Checking if URL has the snippet.id _data
      case (""):
        if(event.request.url.includes("_data")){
          console.log("Works");
          return fetch(event.request.url).then((fetchedResponse) => {
            cache.put(event.request, fetchedResponse.clone());
    
            return fetchedResponse;
          }).catch(() => {
            // If the network is unavailable, get
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
    // return;
  }))
  

});


// export async function action({event}) {
//   const formData = await request.formData();
//   const db = await connectDb();
//   const snippet = await db.models.Snippet.findById(params.snippetId);
//   switch (event) {
//     case (event.request.destination === 'document'):
//       await db.models.Snippet.findByIdAndDelete(params.snippetId);
//       return redirect("/snippets");
//     case "favorite":
//       snippet.favorite = !snippet.favorite;
//       await snippet.save();
//       console.log(snippet.favorite);
//       return null;
//     case "update":
//       await db.models.Snippet.findByIdAndUpdate(params.snippetId, { title: formData.get("title"), lang: formData.get("lang"), code: formData.get("code"), description: formData.get("description") });
//       return null;
//       // const thisSnippet = await db.models.Snippet.findById(params.snippetId);
//       // thisSnippet.code = formData.get("code");
//       // await thisSnippet.save();
//       // return null;
//   }
// }