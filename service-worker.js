const CACHE_NAME =
"mini-spotify-v5";

const FILES = [

    "./",
    "./index.html",
    "./css/style.css",
    "./js/app.js",
    "./js/songs.js",
    "./manifest.webmanifest",
    "./img/icono-192.png",
    "./img/icono-512.png"

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

}
);

            for(const song of self.songs || []){

    try{

        await cache.add(
            "./songs/" + song.file
        );

        await cache.add(
            "./covers/" + song.cover
        );

    }catch(error){

        console.error(
            "No se pudo guardar:",
            song
        );

    }

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
                    "./"
                );

            }

        })

    );

});
