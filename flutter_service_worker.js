'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"version.json": "27996785328cb9184a91259258233f83",
"index.html": "3b18e971d7ad2add46e2ef2b7de83735",
"/": "3b18e971d7ad2add46e2ef2b7de83735",
"main.dart.js": "fea6ccdfb5418bfaae05602d93c2fbf5",
"flutter.js": "6fef97aeca90b426343ba6c5c9dc5d4a",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "82f07bb91df3cffe2945a7dfff5790f1",
"assets/AssetManifest.json": "a1bca90c0cfdf6602f0abf0a87046dd4",
"assets/NOTICES": "51eb7c33b5a76db530f5b88481d2d17a",
"assets/FontManifest.json": "7ba428b8276723f6b31d955a8f87a1b9",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "57d849d738900cfd590e9adc7e208250",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"assets/AssetManifest.bin": "d223a06e7d0013b26b5d65198ff61049",
"assets/fonts/BlenderPro-Bold.ttf": "a855b39297fe861c3f12abc2f2ab17ea",
"assets/fonts/ConnectCode39.ttf": "e1c6a72876821ec46d655e68b160f2fe",
"assets/fonts/TT%2520Interphases%2520Pro%2520Trial%2520Bold.ttf": "219119e345890ba8fee7ea084704d546",
"assets/fonts/TT%2520Interphases%2520Pro%2520Trial%2520Light.ttf": "391127de6a2eaf27ad92d44c30c5b440",
"assets/fonts/Braile_font.ttf": "863d9650bef02ce34869b647d9020480",
"assets/fonts/KeepCalm-Medium.ttf": "52c3a1cf674133b3ec2c4c316180ae14",
"assets/fonts/Futura-Book-Regular.otf": "e1475fa9d0d3433318bc200cc45e002e",
"assets/fonts/Futura-Book-Bold.ttf": "d3d606b87ad7d8138c4cc017fc8d9e1e",
"assets/fonts/TRIX____.ttf": "7b6eb83f8f20246b5df4b2805ea1ea1e",
"assets/fonts/tt-interfaces-mono-regular.ttf": "62beebc295cded63b3b181fb189cb0cb",
"assets/fonts/BlenderPro-Medium.ttf": "c4aa2eb1499d275b0b0e143c5e200061",
"assets/fonts/TT%2520Interphases%2520Pro%2520Trial%2520Medium.ttf": "aa416d1fde4dda76a12c7c1f8fdccb75",
"assets/fonts/MaterialIcons-Regular.otf": "62ec8220af1fb03e1c20cfa38781e17e",
"assets/fonts/Jura-Medium.ttf": "c7e342444841edb47c183f74e7c4da5b",
"assets/assets/images/macro.png": "f420add82de702989c18f53d221e267b",
"assets/assets/videos/video.webm": "b3671ccc2ab179f8c72c2a7180c06ad6",
"assets/assets/icons/glyph-dashes.svg": "454caa6c711d9332dcedca2f592a18ff",
"assets/assets/icons/twitter-round-icon.svg": "49d5835b70df737784967ac3baeb9a58",
"assets/assets/icons/glyph-ov.svg": "4e15f4740beaf9121c6f7b53d3a41872",
"assets/assets/icons/linkedin-round-icon.svg": "4e5b77579246865acfe515d8215ddbb2",
"assets/assets/icons/cv.svg": "651e4b2810a0528eb89136b5afbe120f",
"assets/assets/icons/github-round-icon.svg": "94d9bb98e620b602056d8725550c5a91",
"assets/assets/icons/logo.svg": "a4062a817cb69632d7142c25a4b949fa",
"assets/assets/documents/Jerome%2520Ghesquiere%2520CV.pdf": "f3cb83315f41bb3c0f5daa6faa991194",
"canvaskit/skwasm.js": "1df4d741f441fa1a4d10530ced463ef8",
"canvaskit/skwasm.wasm": "6711032e17bf49924b2b001cef0d3ea3",
"canvaskit/chromium/canvaskit.js": "8c8392ce4a4364cbb240aa09b5652e05",
"canvaskit/chromium/canvaskit.wasm": "fc18c3010856029414b70cae1afc5cd9",
"canvaskit/canvaskit.js": "76f7d822f42397160c5dfc69cbc9b2de",
"canvaskit/canvaskit.wasm": "f48eaf57cada79163ec6dec7929486ea",
"canvaskit/skwasm.worker.js": "19659053a277272607529ef87acf9d8a"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
