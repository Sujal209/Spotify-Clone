let songs; // Used in main function also
let currentSong = new Audio(); // Initialize currentSong here
let start = document.querySelector(".play-first-btn");
let isPlaying = false;
let currentSongName = ""; // Variable to keep track of the current song name
let crntFolder;
let cardContainer = document.querySelector(".cardContainer");

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
  crntFolder = folder;
  // Fetch the HTML document containing the song list
  let response = await fetch(`https://github.com/Sujal209/spotify-clone/tree/spotify/${folder}/`);
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
  let songUl = document.querySelector(".songList ul");
  songUl.innerHTML = "";
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

  // Add event listeners for each song in the list
  Array.from(songUl.querySelectorAll("li")).forEach((e) => {
    e.addEventListener("click", () => {
      let songName = e.querySelector(".songDetails > div").innerHTML.trim();
      playMusic(songName, crntFolder);
    });
  });

  // Next and previous song functionality
  document.querySelector(".previous").addEventListener("click", () => {
    let index = songs.indexOf(currentSongName);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1], folder);
    }
  });

  document.querySelector(".next").addEventListener("click", () => {
    let index = songs.indexOf(currentSongName);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1], folder);
    }
  });
}

async function showAlbum() {
  // Fetch HTML content from the server
  let a = await fetch(`https://github.com/Sujal209/spotify-clone/tree/spotify/musics/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");

  Array.from(anchors).forEach(async e => {
    if (e.href.includes("https://github.com/Sujal209/spotify-clone/tree/spotify/musics/")) {
      let folderName = (e.href.split("/").slice(-2)[1]);
      let res = await fetch(`/musics/${folderName}/info.json`);
      let info = await res.json();

      // Create the card element
      let card = document.createElement("div");
      card.className = "card relative";
      card.dataset.folder = folderName;
      card.innerHTML = `
        <div class="play">
          <button class="border-fifty absolute br-none"><i class="ri-play-fill"></i></button>
        </div>
        <img src="/musics/${folderName}/cover.jpg" alt="">
        <h2>${info.title}</h2>
        <p>${info.desc}</p>
      `;
      cardContainer.appendChild(card);

      // Add event listener to the newly created card
      card.addEventListener("click", async item => {
        await getSongs(`musics/${item.currentTarget.dataset.folder}`);
        playMusic(songs[1], true);
      });
    }
  });
}

async function main() {
  await showAlbum();

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

  currentSong.addEventListener("pause", () => {
    start.innerHTML = `<i class="ri-play-circle-line"></i>`;
    isPlaying = false;
  });

  currentSong.addEventListener("play", () => {
    start.innerHTML = `<i class="ri-pause-circle-fill"></i>`;
    isPlaying = true;
  });

  // Function for converting seconds to minutes
  function secToMin(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);
    if (remainingSeconds < 10) {
      remainingSeconds = '0' + remainingSeconds;
    }
    return `${minutes}:${remainingSeconds}`;
  }

  // Update time of song
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `${secToMin(currentSong.currentTime)}/${secToMin(currentSong.duration)}`;
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 98 + "%";
  });

  // Move seekbar of song as per need
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let songPercent = (e.offsetX / e.target.getBoundingClientRect().width) * 98;
    document.querySelector(".circle").style.left = songPercent + "%";
    currentSong.currentTime = ((currentSong.duration) * songPercent) / 100;
  });

  document.querySelector(".menuIcon").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  document.querySelector(".mainPage").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  });
}

main();
