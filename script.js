let songs; //used in main function also
let audio;
let currentSong = new Audio();

let playMusic=(music) => {
  currentSong.src = "/music/"+music ;
  currentSong.play();
}


async function main() {
  // Fetch the HTML document containing the song list
  let response = await fetch("http://127.0.0.1:5500/music/");
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
  firstLi.remove();

      // Add event listener to play button wiz is available in center
      document.querySelector(".play-first-btn").addEventListener("click", () => {
         audio = new Audio("http://127.0.0.1:5500/music/" + songs[1]);
        audio.play();
        audio.addEventListener("loadeddata", () => {
          console.log(
            "Duration:",
            audio.duration,
            "Source:",
            audio.currentSrc,
            "Current Time:",
            audio.currentTime
          );
        });
      });
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
      e.addEventListener("click", elemet => {
        console.log(e.querySelector(".songDetails>div").innerHTML);
        playMusic(e.querySelector(".songDetails>div").innerHTML);
      })
    })
}


main();
