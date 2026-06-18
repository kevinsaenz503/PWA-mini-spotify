const CACHE_NAME = "mini-spotify-v6";

const FILES = [

    "./",
    "./index.html",
    "./css/style.css",
    "./js/app.js",
    "./js/songs.js",
    "./manifest.webmanifest",

    "./img/icono-192.png",
    "./img/icono-512.png",

    "./songs/space_song.mp3",
    "./songs/olvidarte.mp3",
    "./songs/cancioncitas.mp3",
    "./songs/rey-sin-reina.mp3",
    "./songs/oye-traicionera.mp3",

    "./covers/space_song.jpg",
    "./covers/olvidarte.jpg",
    "./covers/cancioncitas.jpg",
    "./covers/rey-sin-reina.jpg",
    "./covers/traicionera.jpg"

];

/* INSTALAR */

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches.open(CACHE_NAME)
            .then(cache => {

                return cache.addAll(FILES);

            })

        );

        self.skipWaiting();

    }
);

/* ACTIVAR */

self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches.keys()
            .then(keys => {

                return Promise.all(

                    keys.map(key => {

                        if (
                            key !== CACHE_NAME
                        ) {

                            return caches.delete(
                                key
                            );

                        }

                    })

                );

            })

        );

        self.clients.claim();

    }
);

/* PETICIONES */

self.addEventListener(
    "fetch",
    event => {

        event.respondWith(

            caches.match(
                event.request
            )
            .then(response => {

                if (response) {

                    return response;

                }

                return fetch(
                    event.request
                );

            })
            .catch(() => {

                return caches.match(
                    "./index.html"
                );

            })

        );

    }
);
