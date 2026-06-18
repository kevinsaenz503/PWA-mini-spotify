const CACHE_NAME =
"mini-spotify-v4";

const FILES = [

    "/",
    "/css/style.css",
    "/js/app.js",
    "/manifest.webmanifest",
    "/api/songs"

];

/* INSTALAR */
self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)
        .then(async cache => {

            await cache.addAll(FILES);

            const response =
            await fetch("/api/songs");

            const songs =
            await response.json();

            for(const song of songs){

                await cache.add(
                    "/songs/" + song.file
                );

                await cache.add(
                    "/covers/" + song.cover
                );

            }

        })

    );

});


/* ACTIVAR */

self.addEventListener(
"activate",
event => {

    event.waitUntil(

        caches.keys()
        .then(keys => {

            return Promise.all(

                keys.map(key => {

                    if(
                        key !== CACHE_NAME
                    ){

                        return caches.delete(
                            key
                        );

                    }

                })

            );

        })

    );

    self.clients.claim();

});

/* PETICIONES */

self.addEventListener(
"fetch",
event => {

    event.respondWith(

        caches.match(
            event.request
        )
        .then(response => {

         if(response){

    console.log(
        "Desde caché:",
        event.request.url
    );

    return response;

}
            return fetch(
                event.request
            )
            .then(networkResponse => {

                if(

                    event.request.method
                    ===
                    "GET"

                ){

                    const clone =
                    networkResponse
                    .clone();

                    caches
                    .open(
                        CACHE_NAME
                    )
                    .then(cache => {

                        cache.put(
                            event.request,
                            clone
                        );

                    });

                }

                return networkResponse;

            });

        })
        .catch(() => {

            if(

                event.request.mode
                ===
                "navigate"

            ){

                return caches.match(
                    "/"
                );

            }

        })

    );

});