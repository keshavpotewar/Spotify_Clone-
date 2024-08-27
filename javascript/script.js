
// click on home 
let home_logo = document.getElementById("home-logo");
home_logo.addEventListener("click", () => {
    document.querySelector(".content").innerHTML = "hello bhai"
});



// click on search
let search_logo = document.getElementById("search-logo");
search_logo.addEventListener("click", () => {
    document.querySelector(".content").innerHTML = "hello bhaiiiii"
})


let curentAudio = new Audio();
let currentFolder;
let songs = [];

function musictime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return ""
    }
    let minutes = Math.floor(seconds / 60)
    let remainigMinutes = Math.floor(seconds % 60)
    let formatMinutes = String(minutes).padStart(2, "0")
    let formatSeconds = String(remainigMinutes).padStart(2, "0")
    return `${formatMinutes}:${formatSeconds}`

}





async function getsongs(folder) {
    currentFolder = folder;
    console.log(folder)
    let a = await fetch(`${folder}/`);
    console.log(a)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }

    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML = ""
    for (const song of songs) {

        songul.innerHTML = songul.innerHTML + ` <li><img  src="img/music.svg" alt="">
                            <div class="music-info">
                                <div  >${song.replaceAll("%20", " ")}</div>
                                <div  >artist name</div>
                            </div>
                        </li>`;
    }


    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", elelmet => {
            playmusic(e.querySelector(".music-info").firstElementChild.innerHTML)
        })
    })
    return songs
}



let playmusic = (track, pause = false) => {
    // let audio = new Audio("songs/" + track)
    curentAudio.src = `${currentFolder}/` + track
    if (!pause) {
        curentAudio.play()
        play.src = "img/pause.svg"
    }
    // let songname document.querySelector(".songlist").getElementsByTagName("li");
    document.querySelector(".player-info").innerHTML = decodeURI(track)
    document.querySelector(".player-time").innerHTML = "00:00/00:00"

}



async function displayAlbums() {
    let a = await fetch(`songs/`);
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")

//  console.log(a)
    let cardcontainer = document.querySelector(".content");

    let array = Array.from(as);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs/")) {
            let folder = e.href.split("/").slice(-1)[0];
            //get the meta data of the folder
            let a = await fetch(`songs/${folder}/info.json`);
            let response = await a.json();
            cardcontainer.innerHTML += `  <div data-folder="${folder}" class="card">
                    <div class="card-image">
                        <img src="songs/${folder}/cover.jpg" alt="#">
                        <div class="card-play">
                            <img src="img/card-play.svg" alt="#">

                        </div>
                    </div>
                    <div class="card-text">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>
                </div>
        `

        }
        // load the songs whenever click on card 
        Array.from(document.getElementsByClassName("card")).forEach(e => {
            e.addEventListener("click", async item => {
                songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
                // console.log(item.currentTarget.dataset.folder)
                console.log(songs)
                playmusic(songs[0])
            })
        })

    }

}

async function main() {
    await getsongs("songs/ncs")
    playmusic(songs[0], true)

    // display all the albums on page
    displayAlbums()



    // document.querySelector(".songs").addEventListener("click", () => {
    //      document.querySelector(".songs").getElementsByTagName("li").style.backgroundColor = "grey";
    //     // console.log(a)
    // })



    // add event to play or pause the song
    play.addEventListener("click", () => {
        if (curentAudio.paused) {
            curentAudio.play()
            play.src = "img/pause.svg"
        }
        else {
            curentAudio.pause()
            play.src = "img/play.svg"
        }
    })

    // add event to timeupdate in play-nav
    curentAudio.addEventListener("timeupdate", () => {
        // console.log(curentAudio.currentTime,curentAudio.duration)
        document.querySelector(".player-time").innerHTML = `${musictime(curentAudio.currentTime)}/${musictime(curentAudio.duration)}`
        document.querySelector(".circle").style.left = (curentAudio.currentTime / curentAudio.duration) * 100 + "%"
    })




    // press keybord keys then play/pause music
    document.addEventListener("keypress", () => {
        if (curentAudio.paused) {
            curentAudio.play()
            play.src = "img/pause.svg"
        }
        else {
            curentAudio.pause()
            play.src = "img/play.svg"
        }
    })

    // add event to  seakbar moving 
    document.querySelector(".seakbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        curentAudio.currentTime = (curentAudio.duration * percent) / 100
    })


    //add event to open the side bar
    document.querySelector(".bar").addEventListener("click", (e) => {
        let left = document.querySelector(".left")
        let styleleft = left.style.left;
        console.log(styleleft)
        // if (styleleft == -100) {
        //     styleleft = "0px";
        //     document.querySelector(".bar").innerHTML = `
        //     <div class="cross-btn">
        //         <img class="cross" width="40" src="cross-btn.svg" alt="">
        //     </div>`
        // }
        left.style.left = "0";
        // document.querySelector(".bar").innerHTML=`
        // <div class="cross-btn">
        //         <img class="cross" width="40" src="cross-btn.svg" alt="">
        //     </div>`
    })

    // add event to close the side bar
    document.querySelector(".cross").addEventListener("click",(e)=>{
        // e.stopPropagation()
    })
    document.querySelector(".cross-btn").addEventListener("click", () => {

        document.querySelector(".left").style.left = "-100%";

    })

    // for previous play button
    previous.addEventListener("click", () => {

        let index = songs.indexOf(curentAudio.src.split("/").slice(-1)[0])
        console.log(curentAudio.src.split("/").slice(-1)[0])
        if (index - 1 >= 0) {
            playmusic(songs[index - 1])
        }

    })

    //for next play button
    next.addEventListener("click", () => {
        curentAudio.pause
        console.log(songs, curentAudio.src.split("/").slice(-1)[0])
        let index = songs.indexOf(curentAudio.src.split("/").slice(-1)[0])


        if (index + 1 < songs.length) {
            playmusic(songs[index + 1])
        }

    })


}
main()
