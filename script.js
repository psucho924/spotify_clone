console.log("i am starting my first working project's Brain");

// ********************GLOBAL VARIABLE*******************
let song = [];
let folders = [];
let currSong = new Audio();
let songName;
let ArtistName;
let musicCount = 1;
let folderCount = 2;
let set; // setTimeout
let nextSong; // setTimeout

// ******************TIME FORMATNG***************************
function formatTime(seconds) {
  // Calculate minutes and seconds
  const minutes = Math.floor(seconds / 60); // Get whole minutes
  const remainingSeconds = Math.floor(seconds % 60); // Get remaining seconds

  // Format seconds to always have two digits
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  return `${minutes}:${formattedSeconds}`;
}

//******************************PLAY MUSIC*********************************/
function playMusic(musicCount) {
  currSong.src = song[musicCount];
  playButton();

  songName = song[musicCount]
    .split(`/${folders[folderCount]}/`)[1]
    .split("-")[0]
    .replaceAll("%20", " ");

  ArtistName = song[musicCount]
    .split(`/${folders[folderCount]}/`)[1]
    .split("-")[1]
    .replaceAll("%20", " ")
    .split(".")[0];

  document.querySelector(".songInfo").innerHTML = `${songName} - ${ArtistName}`;

  currSong.addEventListener("timeupdate", () => {
    let songTime = currSong.currentTime;
    let songDuration = currSong.duration;

    document.querySelector(`.circle`).style.left =
      (songTime / songDuration) * 100 + "%";
    document.querySelector(`.TimeAndSound .time`).innerHTML = `${formatTime(
      songTime
    )} / ${formatTime(songDuration)}`;
  });
}

/*************************PLAYLIST LOADER***************************/
async function loadPlaylist(folder) {
  document.querySelector(`.playlists`).innerHTML = "";
  for (let i = 0; i < song.length; i++) {
    const e = song[i];
    songName = e.split(`/${folder}/`)[1].split("-")[0].replaceAll("%20", " ");

    ArtistName = e
      .split(`/${folder}/`)[1]
      .split("-")[1]
      .replaceAll("%20", " ")
      .split(".")[0];

    document.querySelector(`.playlists`).innerHTML =
      document.querySelector(`.playlists`).innerHTML +
      `<div class="song pointer">
                  <div class="music_info">
                    <img class="invert icon-width" src="images/music.svg" alt="">
                    <div class="info">
                      <div class="songName">${songName}</div>
                      <div class="artistName">${ArtistName}</div>
                    </div>
                  </div>
                  <div class="musicSVG">
                    <div>Play Music</div>
                    <img class="invert"  src="images/play.svg" alt="">
                  </div>
                </div>`;
  }
}

/**************************SONGS LOADER**********************/
async function getSongs(folder) {
  song = [];
  let response = await fetch(`/${folder}/`);
  let a = await response.text();
  let div = document.createElement(`div`);
  div.innerHTML = a;
  let a_s = div.querySelectorAll(`a`);
  a_s.forEach((e) => {
    if (e.href.endsWith(".mp3") || e.href.endsWith(".MP3")) {
      song.push(e.href);
    }
  });

  loadPlaylist(folder);
}

/******************************FETCH PLAYLIST***************************/
async function getPlaylists() {
  let data = await fetch("/songs/");
  let response = await data.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let a_s = div.querySelectorAll("a");
  for (let i = 0; i < a_s.length; i++) {
    const e = a_s[i];
    if (e.innerHTML != "../") {
      let folder = e.innerHTML.split("/")[0];
      folders.push(e.innerHTML.split("/")[0]);
      let FolderData = await fetch(e.href + "info.json/");
      let response = await FolderData.json();
      let title = response.title;
      let description = response.discription;

      document.querySelector(`.song_library`).innerHTML =
        document.querySelector(`.song_library`).innerHTML +
        `<div class="card pointer">
             <img src="songs/${folder}/cover.jpg" alt="">
             <h2 class="title">${title}</h2>
             <div class="discription">${description}</div>
           </div>`;
    }
  }
}

// ********************buttons functionalities*************************

//****************SOUND BUTTON*******************/
let range = document.querySelector(`#vol_range`);
function soundButton() {
  dynamicSoundSeekBar();
  range.addEventListener("change", (e) => {
    dynamicSoundSeekBar();
  });
}

//********************DYNAMIC SOUND SEEKBAR*************************/
function dynamicSoundSeekBar() {
  range.style.visibility = "visible";
  clearTimeout(set);
  set = setTimeout(() => {
    range.style.visibility = "hidden";
  }, 2000);
}

// *******************PLAY BUTTON*************
function playButton() {
  if (!currSong.paused) {
    currSong.pause();
    document.querySelector(`#play`).src = "images/play.svg";
  } else {
    currSong.play();
    document.querySelector(`#play`).src = "images/pause.svg";
  }
}

//  *******************NEXT SONG*******************
function PlayNext() {
  if (++musicCount < song.length) {
    playMusic(musicCount);
  } else {
    console.log("bs bhai bs");
  }
}

//  *******************PREVIOUS SONG****************
function playprevious() {
  if (--musicCount >= 0) {
    playMusic(musicCount);
  } else {
    console.log("bs bhai bs");
  }
}

//******************************CLICK HAMBERGER**********************/
function hamButton(e) {
  if (e.target.src == "http://127.0.0.1:3000/images/hamberger.svg") {
    document.querySelector(`.left`).style.left = 0;
    e.target.src = "images/close.svg";
  } else {
    document.querySelector(`.left`).style.left = "-82%";
    e.target.src = "images/hamberger.svg";
  }
}

//*********************MAIN FUNTION*****************/
async function main() {
  await getPlaylists();
  await getSongs("songs/punjabi");
  currSong.src = song[1];
  playMusic(1);
  currSong.pause();
  play.src = "images/play.svg";

  // PLAY SONG CLICKED IN PLAYLIST
  document.querySelector(".playlists").addEventListener("click", (e) => {
    let songClicked = e.target.closest(".song");
    if (songClicked) {
      let songList = Array.from(songClicked.parentElement.children);
      musicCount = songList.indexOf(songClicked);
      playMusic(musicCount);
    }
  });

  // LOAD PLAYLIST CLICKED IN PLAYLIST
  document
    .querySelector(`.song_library`)
    .addEventListener("click", async (e) => {
      let playlistClicked = e.target.closest(`.card`);
      if (playlistClicked) {
        folderCount = Array.from(
          playlistClicked.parentElement.children
        ).indexOf(playlistClicked);
        await getSongs(`songs/${folders[folderCount]}`);
      }
    });

  //************************DYNAMIC SEEKBAR******************
  document.querySelector(`.seekbar`).addEventListener("click", (e) => {
    let wide = e.target.getBoundingClientRect().width;
    let percent = (e.offsetX / wide) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currSong.currentTime = (percent / 100) * currSong.duration;
  });

  document.querySelector(`#play`).addEventListener("click", (e) => {
    //PLAY BUTTON
    playButton();
  });

  if (document.getElementById(`vol_range`).style.visibility === "") {
    // SOUND BUTTON
    document.getElementById(`sound`).addEventListener("click", () => {
      soundButton();
    });
  }

  document.getElementById(`previous`).addEventListener("click", () => {
    // PREVIOUS BUTTON
    playprevious();
  });

  document.getElementById(`next`).addEventListener("click", () => {
    // NEXT BUTTON
    PlayNext();
  });

  //  KEYBOARD INTERECTIVES
  document.addEventListener("keydown", (e) => {
    if (e.key == " ") {
      playButton();
    } else if (e.key == "k") {
      dynamicSoundSeekBar();
      if (range.value > 10) {
        range.value -= 10;
        currSong.volume = range.value / 100;
      } else {
        range.value = 0;
        currSong.volume = range.value / 100;
      }
    } else if (e.key === "i") {
      dynamicSoundSeekBar();
      if (range.value < 90) {
        range.value = parseInt(range.value) + 10;
        currSong.volume = range.value / 100;
      } else {
        range.value = 100;
        currSong.volume = range.value / 100;
      }
    } else if (e.key == "j") {
      playprevious();
    } else if (e.key == "l") {
      PlayNext();
    } else if (e.key == "m") {
      currSong.muted = !currSong.muted;
      if (!currSong.muted) {
        document.getElementById(`sound`).src = `images/sound.svg`;
      } else {
        document.getElementById(`sound`).src = `images/mute.svg`;
      }
    }
  });

  //*******************WORKING HAMPBERGER***********************/
  document.getElementById(`hamberger`).addEventListener("click", (e) => {
    hamButton(e);
  });
}

main();
