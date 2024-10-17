console.log('lets write JS');
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds){
    if(isNaN(seconds) || seconds < 0){
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder){
    currFolder = folder;
    let a=await fetch(`http://127.0.0.1:5501/${currFolder}/`)
    let response= await a.text();
    let div =document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${currFolder}/`)[1])
        } 
    }
    

    //show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> <img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20"," ")}</div>
                                <div>SIRI</div>
                            </div>
                            <div class="playenow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg"  alt="">
                            </div> </li>`;
    }

    //Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })
}

const playMusic = (track, pause= false)=>{
    currentSong.src = `/${currFolder}/`+ track
    if(!pause){
        currentSong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"


}

// async function displayAlbums() {
//     let a = await fetch(`http://127.0.0.1:5501/spotify_clone/songs/`);
//     let response = await a.text();

//     let div = document.createElement("div");
//     div.innerHTML = response;

//     let anchors = div.getElementsByTagName("a");
//     let cardContainer = document.querySelector(".cardContainer");

//     Array.from(anchors).forEach(async e => {
//         if (e.href.includes("/spotify_clone/songs")) {
//             let folder = e.href.split("songs/").slice(1)[0];

//             if (folder !== undefined) {
//                 // Fetch the metadata for each folder
//                 let metadataResponse = await fetch(`http://127.0.0.1:5501/spotify_clone/songs/${folder}/info.json`);
                
//                 try {
//                     let metadata = await metadataResponse.json();

//                     // Add the album card to the container
//                     cardContainer.innerHTML += `
//                     <div data-folder="cs" class="card">
//                         <div class="play">
//                             <svg fill="#000000" height="24" width="24px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
//                               viewBox="0 0 60 60" xml:space="preserve">
//                               <g>
//                                 <path d="M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30
//                                   c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15
//                                   C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z M24,43.107V16.893L43.225,30L24,43.107z"/>
//                               </g>
//                             </svg>
//                         </div>
//                         <img src="/spotify_clone/songs/${folder}/cover.jpeg" alt="">
//                         <h2>${metadata.title}</h2>
//                         <p>${metadata.description}</p>
//                     </div>`;
//                 } catch (error) {
//                     console.error(`Error parsing JSON for folder ${folder}:`, error);
//                 }
//             }
//         }
//     });
// }



async function main(){  
    //get the list of all songs
    await getSongs("spotify_clone/songs/Tollywood")
    playMusic(songs[0], true)

    //display all the albums on the page
    // displayAlbums()

    
    
    //attach an event listener to play , next and previous
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })

    //Listen for time update event
    currentSong.addEventListener("timeupdate", ()=>{
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/ currentSong.duration) *100 +"%";
    })

    //add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent =  (e.offsetX/e.target.getBoundingClientRect().width)* 100;
        document.querySelector(".circle").style.left = + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) /100;
    })

    //add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0"
    })

    //add an event listener for close button
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-125%"
    })

    //add an event listener to previous and next
    previous.addEventListener("click",()=>{
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index+1) >= 0){
            playMusic(songs[index-1])
        }
    })

    //add an event listener to next
    next.addEventListener("click",()=>{
        currentSong.pause()
        console.log("next clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index+1) < songs.length){
            playMusic(songs[index+1])
        }
    })


    //add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        console.log("Setting volume to",e.target.value,"/ 100")
        currentSong.volume = parseInt(e.target.value)/100
    })

    //load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            songs =await getSongs(`spotify_clone/songs/${item.currentTarget.dataset.folder}`)
            
        })
    })

    //add event listener to mute the track
    document.querySelector(".volume img").addEventListener("click", e=>{
        if(e.target.src.includes("img/volume.svg")){
            e.target.src = "img/mute.svg"
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = "img/volume.svg"
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;

        }
    })


}

main()