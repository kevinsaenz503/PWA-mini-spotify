const CACHE_NAME = "mini-spotify-v8";

const FILES = [
    "./",
    "./index.html",
    "./css/style.css",
    "./js/app.js",
    "./js/songs.js",
    "./manifest.webmanifest",

    "./img/icono-192.png",
    "./img/icono-512.png",

    "./songs/Mentirosa Bonita Y Mentirosa.mp3",
    "./songs/olvidarte.mp3",
    "./songs/cancioncitas.mp3",
    "./songs/rey-sin-reina.mp3",
    "./songs/oye-traicionera.mp3",
    "./songs/las espinas.mp3",
    "./songs/te-vas.mp3",
    "./songs/Como Llora Mi Alma.mp3",
    "./songs/El Perdedor.mp3",
    "./songs/Chismofilia.mp3",

    "./covers/bonita-y-mentirosa.jpg",
    "./covers/olvidarte.jpg",
    "./covers/cancioncitas.jpg",
    "./covers/rey-sin-reina.jpg",
    "./covers/traicionera.jpg",
    "./covers/las espinas.jpg",
    "./covers/te-vas.jpg",
    "./covers/como-llora-mi-alma.jpg",
    "./covers/el-perdedor.jpg",
    "./covers/salucita.jpg"
];

/* INSTALAR */

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)
        .then(async cache => {

            for (const file of FILES) {

                try {

                    await cache.add(file);

                    console.log("✅ Cacheado:", file);

                } catch (error) {

                    console.error("❌ Error:", file, error);

                }

            }

        })

    );

    self.skipWaiting();

});

/* ACTIVAR */

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()
        .then(keys =>

            Promise.all(

                keys.map(key => {

                    if (key !== CACHE_NAME) {

                        return caches.delete(key);

                    }

                })

            )

        )

    );

    self.clients.claim();

});

/* FETCH */

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)
        .then(response => {

            if (response) {

                return response;

            }

            return fetch(event.request)
            .then(networkResponse => {

                return networkResponse;

            });

        })

    );

});
