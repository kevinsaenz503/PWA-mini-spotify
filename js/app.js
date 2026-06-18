let songs = [];

let currentIndex = 0;

let deferredPrompt = null;

const player =
document.getElementById("player");

const songsDiv =
document.getElementById("songs");

const searchResults =
document.getElementById("searchResults");

const favoritesDiv =
document.getElementById("favorites");

const currentSong =
document.getElementById("currentSong");

const currentCover =
document.getElementById("currentCover");

const playBtn =
document.getElementById("playBtn");

const favBtn =
document.getElementById("favBtn");

const progressBar =
document.getElementById("progressBar");

const currentTime =
document.getElementById("currentTime");

const duration =
document.getElementById("duration");

const volumeBar =
document.getElementById("volumeBar");

const installBtn =
document.getElementById("installBtn");

/* FAVORITOS */

let favorites =
JSON.parse(
localStorage.getItem(
"favorites"
)
) || [];

/* CARGAR CANCIONES */

fetch("/api/songs")
.then(response => response.json())
.then(data => {

    songs = data;

    renderSongs();

    renderFavorites();

});

/* MOSTRAR SECCIONES */

function showSection(id, button){

    document
    .querySelectorAll("main section")
    .forEach(section => {

        section.style.display =
        "none";

    });

    document
    .getElementById(id)
    .style.display =
    "block";

    document
    .querySelectorAll(".nav-btn")
    .forEach(btn => {

        btn.classList.remove(
            "active"
        );

    });

    button.classList.add(
        "active"
    );

}
/* RENDER CANCIONES */

function renderSongs(){

    songsDiv.innerHTML = "";

    songs.forEach((song,index)=>{

        const card =
        document.createElement("div");

        card.className = "card";

        card.innerHTML = `

        <img
        src="/covers/${song.cover}"
        class="cover">

        <h3>${song.title}</h3>

        <p>${song.artist}</p>

        <button
        class="play-song"
        onclick="playSong(${index})">

        ▶ Reproducir

        </button>

        `;

        songsDiv
        .appendChild(card);

    });

}

/* REPRODUCIR */

function playSong(index){

    currentIndex = index;

    const song =
    songs[index];

    player.src =
    "/songs/" +
    song.file;

    player.play();

    playBtn.innerHTML = "⏸";

    currentSong.innerHTML =
    song.title +
    " - " +
    song.artist;

    currentCover.src =
    "/covers/" +
    song.cover;

    loadFavorite();

}

/* PLAY PAUSA */

playBtn.addEventListener(
"click",
()=>{

    if(!player.src)
        return;

    if(player.paused){

        player.play();

        playBtn.innerHTML =
        "⏸";

    }else{

        player.pause();

        playBtn.innerHTML =
        "▶";

    }

});

/* SIGUIENTE */

document
.getElementById("nextBtn")
.addEventListener(
"click",
()=>{

    if(songs.length === 0)
        return;

    currentIndex++;

    if(
        currentIndex >=
        songs.length
    ){

        currentIndex = 0;

    }

    playSong(currentIndex);

});

/* ANTERIOR */

document
.getElementById("prevBtn")
.addEventListener(
"click",
()=>{

    if(songs.length === 0)
        return;

    currentIndex--;

    if(
        currentIndex < 0
    ){

        currentIndex =
        songs.length - 1;

    }

    playSong(currentIndex);

});

/* SIGUIENTE AUTOMÁTICA */

player.addEventListener(
"ended",
()=>{

    currentIndex++;

    if(
        currentIndex >=
        songs.length
    ){

        currentIndex = 0;

    }

    playSong(currentIndex);

});

/* BARRA DE PROGRESO */

player.addEventListener(
"timeupdate",
()=>{

    progressBar.max =
    player.duration || 0;

    progressBar.value =
    player.currentTime;

    currentTime.innerHTML =
    formatTime(
        player.currentTime
    );

    duration.innerHTML =
    formatTime(
        player.duration
    );

});

/* MOVER PROGRESO */

progressBar.addEventListener(
"input",
()=>{

    player.currentTime =
    progressBar.value;

});

/* FORMATO TIEMPO */

function formatTime(seconds){

    if(
        isNaN(seconds)
    ){

        return "0:00";

    }

    let minutes =
    Math.floor(
        seconds / 60
    );

    let secs =
    Math.floor(
        seconds % 60
    );

    if(secs < 10){

        secs =
        "0" + secs;

    }

    return minutes +
           ":" +
           secs;

}

/* VOLUMEN */

const volumeBtn =
document.getElementById("volumeBtn");

let muted = false;

volumeBtn.addEventListener(
"click",
()=>{

    muted = !muted;

    player.muted = muted;

    if(muted){

        volumeBtn.innerHTML = "🔇";

    }else{

        volumeBtn.innerHTML = "🔊";

    }

});

/* FAVORITOS */

favBtn.addEventListener(
"click",
()=>{

    if(
        songs.length === 0
    ) return;

    const file =
    songs[currentIndex]
    .file;

    const position =
    favorites.indexOf(
        file
    );

    if(position === -1){

        favorites.push(
            file
        );

    }else{

        favorites.splice(
            position,
            1
        );

    }

    localStorage
    .setItem(
        "favorites",
        JSON.stringify(
            favorites
        )
    );

    loadFavorite();

    renderFavorites();

});

/* ICONO FAVORITO */

function loadFavorite(){

    if(
        songs.length === 0
    ) return;

    const file =
    songs[currentIndex]
    .file;

    if(
        favorites.includes(
            file
        )
    ){

        favBtn.innerHTML =
        "❤️";

    }else{

        favBtn.innerHTML =
        "🤍";

    }

}

/* MOSTRAR FAVORITOS */

function renderFavorites(){

    favoritesDiv.innerHTML =
    "";

    songs.forEach(
    (song,index)=>{

        if(
            favorites.includes(
                song.file
            )
        ){

            const card =
            document
            .createElement(
                "div"
            );

            card.className =
            "card";

            card.innerHTML = `

            <img
            src="/covers/${song.cover}"
            class="cover">

            <h3>
            ${song.title}
            </h3>

            <p>
            ${song.artist}
            </p>

            <button
            class="play-song"
            onclick="playSong(${index})">

            ▶ Reproducir

            </button>

            `;

            favoritesDiv
            .appendChild(
                card
            );

        }

    });

}

/* BUSCADOR */

document
.getElementById("search")
.addEventListener(
"keyup",
(event)=>{

    const value =
    event.target.value
    .toLowerCase()
    .trim();

    searchResults.innerHTML =
    "";

    let found = false;

    songs.forEach(
    (song,index)=>{

        if(

            song.title
            .toLowerCase()
            .includes(value)

            ||

            song.artist
            .toLowerCase()
            .includes(value)

        ){

            found = true;

            const card =
            document
            .createElement(
                "div"
            );

            card.className =
            "card";

            card.innerHTML = `

                <img
                src="/covers/${song.cover}"
                class="cover">

                <h3>
                    ${song.title}
                </h3>

                <p>
                    ${song.artist}
                </p>

                <button
                class="play-song"
                onclick="playSong(${index})">

                    ▶ Reproducir

                </button>

            `;

            searchResults
            .appendChild(
                card
            );

        }

    });

    if(

        !found

        &&

        value !== ""

    ){

        searchResults.innerHTML =

        `

        <div class="not-found">

            ❌ Canción no encontrada

        </div>

        `;

    }

});
/* INSTALAR PWA */

window.addEventListener(
"beforeinstallprompt",
(event)=>{

    event.preventDefault();

    deferredPrompt =
    event;

    installBtn.hidden =
    false;

});

installBtn.addEventListener(
"click",
async()=>{

    if(
        !deferredPrompt
    ) return;

    deferredPrompt.prompt();

    await
    deferredPrompt
    .userChoice;

    installBtn.hidden =
    true;

});

/* SERVICE WORKER */

if(
'serviceWorker'
in navigator
){

    navigator
    .serviceWorker
    .register(
        '/service-worker.js'
    )
    .then(reg => {

        console.log(
            "Service Worker registrado",
            reg
        );

    });

}