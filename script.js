let songs; // Used in main function also
let currentSong = new Audio(); // Initialize currentSong here
let start = document.querySelector(".play-first-btn");
let isPlaying = false;
let currentSongName = ""; // Variable to keep track of the current song name
let crntFolder;

let playMusic = (music, folder) => {
  if (isPlaying) {
    currentSong.pause();
    isPlaying = false;
  }
  currentSong.src = `${crntFolder}/` + music;
  currentSong.play();
  currentSongName = music; // Update the current song name
  isPlaying = true;
  start.innerHTML = `<i class="ri-pause-circle-fill"></i>`;
  document.querySelector(".musicInfo").innerHTML = music;
  document.querySelector(".songTime").innerHTML = "00:00/00:00";
};

async function getSongs(folder) {
  crntFolder=folder;
  // Fetch the HTML document containing the song list
  let response = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let responseText = await response.text();

  // Parse the HTML response into a DOM document
  let parser = new DOMParser();
  let doc = parser.parseFromString(responseText, "text/html");

  // Select all <li> elements containing song names
  let songListItems = doc.querySelectorAll("li");

  // Extract and trim the song names
  songs = Array.from(songListItems).map((song) => {
    let textContent = song.textContent.trim();
    let trimmedSongName = textContent.split(".mp3")[0] + ".mp3";
    return trimmedSongName;
  });

  // Log the song list in the console
  console.log(songs);
  // Assuming there's an element with class 'songList' that contains a <ul>
  let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0];
  songUl.innerHTML="";
  // Add the song list to the HTML
  for (const song of songs) {
    songUl.innerHTML += `<li><i class="ri-music-2-fill"></i>
                            <div class="songDetails">
                                <div>${song}</div>
                                <div>Sujal</div>
                            </div>
                            <button class="play-btn pointer"> <i class="ri-play-fill"></i></button></li>`;
  }

  // Remove the first <li> element
  let firstLi = songUl.querySelector("li");
  if (firstLi) {
    firstLi.remove();
  }

    // Next previous song
    document.querySelector(".previous").addEventListener("click", () => {
      let index = songs.indexOf(currentSongName);
      if ((index - 1) >= 0) {
        playMusic(songs[index - 1], folder);
      }
    });
  
    document.querySelector(".next").addEventListener("click", () => {
      let index = songs.indexOf(currentSongName);
  
      if ((index + 1) < songs.length) {
        playMusic(songs[index + 1], folder);
      }
    });
  
}

async function showAlbum() {

    // Fetch HTML content from the server
    let a = await fetch(`http://127.0.0.1:5500/musics/`);
    let response = await a.text();
    let div=document.createElement("div")
    div.innerHTML=response;
    console.log(div)
    let anchors= div.getElementsByTagName("a")
    Array.from(anchors).forEach(e=>{
      if(e.href.includes("/musics")){
        console.log(e.href.split("/").slice(-2)[1])
      }
    })
}



async function main() {
  showAlbum()

  // Add event listener to play button which is available in center
  document.querySelector(".play-first-btn").addEventListener("click", () => {
    if (!isPlaying && currentSongName) {
      currentSong.play();
      start.innerHTML = `<i class="ri-pause-circle-fill"></i>`;
      isPlaying = true;
    } else {
      currentSong.pause();
      start.innerHTML = `<i class="ri-play-circle-line"></i>`;
      isPlaying = false;
    }
  });

  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e) => {
    e.addEventListener("click", () => {
      let songName = e.querySelector(".songDetails > div").innerHTML.trim();
      playMusic(songName, crntFolder);
    });
  });

  currentSong.addEventListener("pause", () => {
    start.innerHTML = `<i class="ri-play-circle-line"></i>`;
    isPlaying = false;
  });

  currentSong.addEventListener("play", () => {
    start.innerHTML = `<i class="ri-pause-circle-fill"></i>`;
    isPlaying = true;
  });

  // Function for converting sec to min
  function secToMin(seconds) {
    // Calculate minutes and remaining seconds
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);

    // Pad single digit seconds with a leading zero
    if (remainingSeconds < 10) {
      remainingSeconds = '0' + remainingSeconds;
    }

    // Return the formatted time string
    return `${minutes}:${remainingSeconds}`;
  }

  // Update time of song
  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songTime").innerHTML = `${secToMin(currentSong.currentTime)}/${secToMin(currentSong.duration)}`;
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 98 + "%";
  });

  // Move seekbar of song as per need
  document.querySelector(".seekbar").addEventListener("click", (e) => { // offsetX is used to get actual point where user clicked.
    let songPercent = (e.offsetX / e.target.getBoundingClientRect().width) * 98; // getBoundingClientRect used to find where user is on page, 98% because seekbar width is 98%
    document.querySelector(".circle").style.left = songPercent + "%";
    currentSong.currentTime = ((currentSong.duration) * songPercent) / 100;
  });

  document.querySelector(".menuIcon").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  document.querySelector(".mainPage").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  });


//load songs in playlist
Array.from(document.querySelectorAll(".card")).forEach(e=>{
  e.addEventListener("click", async item=>{
    await getSongs(`musics/${item.currentTarget.dataset.folder}`);
    playMusic(songs[1],true)

  })
})


}

main();
