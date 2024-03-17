
let currentSong = new Audio()
let songs
let currFolder



let play = document.getElementById("play");
// play.src = "pause.svg"

function secondsToMinutesAndSeconds(seconds) {
    if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
        return '00:00'
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0')
    const formattedSeconds = String(remainingSeconds).padStart(2, '0')

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function main(folder) {
    currFolder = folder
    let a = await fetch(`http://127.0.0.1:5501/${folder}/`)
    let respons = await a.text()
    let div = document.createElement("div")
    div.innerHTML = respons
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith("mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML += `
    <li>
                            <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                            </div>
                           <img id="play"class="invert"  src="playbar.svg" alt="">
                        </li>`
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
        })

    })

}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {

        play.src = "pause.svg"
        currentSong.play()

    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songTime").innerHTML = " 00:00/00:00"

}

async function disolayAlbums() {
    let a = await fetch(`http://127.0.0.1:5501/songs/`)
    let respons = await a.text()
    let div = document.createElement("div")
    div.innerHTML = respons
    let anchars = document.getElementsByTagName("a")

    Array.from(anchars).forEach(e => {
        if (e.href.includes("/songs")) {
            console.log(a.href.split("/").slice(-2)[0])
        }
    })
}

async function main_1() {

    await main("songs/ncs")
    playMusic(songs[0], true)
    disolayAlbums()

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "playbar.svg"
        }
    })

    currentSong.addEventListener("timeupdate", () => {

        document.querySelector(".songTime").innerHTML = `${secondsToMinutesAndSeconds(currentSong.currentTime)}/${secondsToMinutesAndSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"

    })

    document.querySelector(".seekber").addEventListener("click", e => {

        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = ((currentSong.duration) * percent) / 100

    })

    document.querySelector(".heamburger").addEventListener("click", () => {

        document.querySelector(".left").style.left = "0"

    })
    document.querySelector(".close").addEventListener("click", () => {

        document.querySelector(".left").style.left = "-100%"

    })
    previous.addEventListener("click", () => {

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }

    })
    next.addEventListener("click", () => {

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) >= length) {
            playMusic(songs[index + 1])
        }

    })

    Array.from(document.getElementsByClassName("card")).forEach(e => {

        e.addEventListener("click", async item => {
            songs = await main(`songs/${item.currentTarget.dataset.folder}`)
        })

    })
}


main_1()











