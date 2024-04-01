console.log('Hello opening')

let songs;
let Currfolder;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getsongs(folder) {
    Currfolder = folder
    let a = await fetch(`http://127.0.0.1:3000/${Currfolder}/`)
    let response = await a.text();
    console.log(response)

    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    console.log(as)
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${Currfolder}/`)[1])
        }
    }
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML="  "
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img src="svg/music.svg" alt="">
                        <div class="info">
                            <div>${song.replaceAll("%20", " ")}</div>
                            <div>Artist</div>
                        </div>
                        <div class="playnow">
                            <span>Play Now</span>
                            <img src="svg/playpause.svg" alt="">
                        </div> </li>`

    }
    Array.from(document.querySelector(".songlist").getElementsByTagName('li')).forEach(e => {
        e.addEventListener("click", element => {
            playmusic(e.querySelector(".info").firstElementChild.innerHTML);
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
        })

    })
}

let currentsong = new Audio();

const playmusic = (track, pause = false) => {
    // audio = new Audio(`/${Currfolder}/`+ track)
    currentsong.src = `/${Currfolder}/` + track
    if (!pause) {
        currentsong.play()
        play.src = "svg/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}


async function songlist() {
    await getsongs("songs/Copy")
    playmusic(songs[2], true)


    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "svg/pause.svg"

        } else {
            currentsong.pause()
            play.src = "svg/play.svg"

        }
    })


    currentsong.addEventListener("timeupdate", () => {

        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"

    })



    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-160%"
    })

    previous.addEventListener("click", () => {
        currentsong.pause()
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        console.log(currentsong.src.split("/").slice(-1), index)
        if (index - 1 >= 0) {
            playmusic(songs[index - 1])
        }
        else {
            currentsong.play()
            alert("NO more songs to previous")
        }


    })
    next.addEventListener("click", () => {
        currentsong.pause()
        console.log("next")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        console.log(currentsong.src.split("/").slice(-1), index)
        if (index + 1 < songs.length - 1) {
            playmusic(songs[index + 1])
        }
        else {
            currentsong.play()
            alert("You've reached the End of the List")
        }

    })
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentsong.volume = parseInt(e.target.value) / 100

    })

    Array.from(document.getElementsByClassName("card")).forEach(e => {

        e.addEventListener("click", async item => {
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)

        })
    })

}
songlist()























// extra
// var audio = new Audio(songs[0]);
// audio.play();