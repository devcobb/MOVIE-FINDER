let data = {
  searchHistory: [],
  fetchedVideos: [],
};

(function init() {
  showLoadingScreen();
  window.onload = () => {
    hideLoadingScreen();
  };
  let bar = document.querySelector("#searchBar");
  let btn = document.querySelector("#searchForVideos");

  checkForSearchHistory();
  bar.addEventListener("focus", showSearchHistory);
  bar.addEventListener("blur", hideSearchHistory);
  btn.addEventListener("click", searchForVideos);
})();

function saveSearchHistory() {
  localStorage.setItem("searchHistory", JSON.stringify(data.searchHistory));
}

function checkForSearchHistory() {
  if (localStorage.getItem("searchHistory") !== null) {
    data.searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
  }
}

function showSearchHistory() {
  if (
    data.searchHistory.length > 0 &&
    document.querySelector("#searchBar").value === ""
  ) {
    const searchHistoryBox = document.createElement("div");
    searchHistoryBox.id = "searchHistoryBox";
    searchHistoryBox.className = "empty";

    if (document.querySelector("#searchHistoryBox") === null) {
      document.querySelector("#searchBar").className = "fixCornersInput";

      setTimeout(() => {
        document
          .querySelector("#searchBarBox")
          .insertBefore(
            searchHistoryBox,
            document.querySelector("#searchBarBox select")
          );
        let box = document.querySelector("#searchHistoryBox");

        setTimeout(() => {
          box.className = "fullSize";
          setTimeout(() => {
            data.searchHistory.forEach((history) => {
              box.innerHTML += `<div class="search">${history}</div`;
            });

            document.querySelectorAll(".search").forEach((s) => {
              s.className += " visible";
              s.addEventListener("click", updateSearchBarTerm);
            });
          }, 300);
        }, 100);
      }, 150);
    }
  }
}

function updateSearchBarTerm(e) {
  document.querySelector("#searchBar").value = e.target.textContent;
}

function hideSearchHistory() {
  if (document.querySelector("#searchHistoryBox") !== null) {
    let box = document.querySelector("#searchHistoryBox");
    document
      .querySelectorAll(".search")
      .forEach((s) => (s.className += " searchHidden"));

    setTimeout(() => {
      box.innerHTML = "";
      box.className = "empty";

      setTimeout(() => {
        box.style.border = "none";
        box.style.padding = "1px 15px";

        setTimeout(() => {
          box.remove();
          document.querySelector("#searchBar").className = "";
        }, 200);
      }, 100);
    }, 300);
  }
}

function searchForVideos(e) {
  let bar = document.querySelector("#searchBar").value;
  e.preventDefault();

  if (bar !== "") {
    const box = document.querySelector("#searchVideos");
    box.className = "searchVideosFullSize";

    if (data.searchHistory.length === 3) {
      let newSearchHistory = [];

      data.searchHistory.push(bar);
      for (let i = 1; i < data.searchHistory.length; i++) {
        newSearchHistory.push(data.searchHistory[i]);
      }

      data.searchHistory = newSearchHistory;
    } else {
      data.searchHistory.push(bar);
    }

    saveSearchHistory();
    determineVideosAPI();
  }
}

function determineVideosAPI() {
  const sel = document.querySelector("#searchVideosForm select").value;
  let searchTerm = document.querySelector("#searchBar").value;

  document.querySelector("#videosWrap").innerHTML = "";
  sel === "YouTube"
    ? searchForYTVideos(searchTerm)
    : searchForVimeoVideos(searchTerm);
}

async function searchForYTVideos(searchTerm) {
  showLoadingScreen();
  document.querySelector("#videosWrap").style.display = "flex";

  let key = "AIzaSyBdi6o7vIJpBcufoIc2ZQiIpNRfhS59FEw";
  let data = await fetch(
    `https://youtube.googleapis.com/youtube/v3/search?&key=${key}&part=snippet&type=video&q=${searchTerm}&maxResults=12`
  );
  let fetched = await data.json();

  await loadYTVideos(fetched);
}

function loadYTVideos(videos) {
  data.fetchedVideos = videos.items;
  videos.items.forEach((video) => {
    document.querySelector(
      "#videosWrap"
    ).innerHTML += `<div data-id="${video.id.videoId}" class="video">
                <img src="${video.snippet.thumbnails.medium.url}" />
                <div class="videoTitle">${video.snippet.title}</div>
             </div>`;
  });

  document
    .querySelector("#searchVideos")
    .scrollIntoView({ behavior: "smooth" });

  document.querySelectorAll(".video").forEach((vid) => {
    vid.addEventListener("click", (e) => previewVideo(e));
  });
  hideLoadingScreen();
}

function loadVimeoVideos(videos) {
  data.fetchedVideos = videos.data;
  videos.data.forEach((video) => {
    document.querySelector("#videosWrap").innerHTML += `<div data-id="${
      video.uri.split("/")[2]
    }" class="video">
                <img src="${video.pictures.sizes[3].link}" />
                <div class="videoTitle">${video.name}</div>
             </div>`;
  });

  document
    .querySelector("#searchVideos")
    .scrollIntoView({ behavior: "smooth" });

  document.querySelectorAll(".video").forEach((vid) => {
    vid.addEventListener("click", (e) => previewVideo(e));
  });
  hideLoadingScreen();
}

async function searchForVimeoVideos(searchTerm) {
  showLoadingScreen();
  document.querySelector("#videosWrap").style.display = "flex";

  let data = await fetch(
    `https://api.vimeo.com/videos?query=${searchTerm}?total=12&per_page=12`,
    {
      headers: {
        Authorization:
          "basic N2M5YzI2NTVlNmM1NTVmZTJjNjdlMDYxMzNkYzYyMTVjZjJmOTcxNzpzRlFyUzNWMTBNUnpYTXkzR1A2enZGc0NkUWhFMHZpbUs1M1Bua0lLU3VPS3JxOG5QSGg0NmVpY1doeDBCd1owRC9yZ1IrbW9lVkgyaUFsUmUzNFJadEkrN1liVzRlMEVrVnJscHY1a2VFTUZGdTVmRitNUlUvQ20ydng0aXJnUQ==",
      },
    }
  );
  let fetched = await data.json();

  await loadVimeoVideos(fetched);
}

function showLoadingScreen() {
  const box = document.createElement("div");
  box.id = "loadingScreen";

  box.innerHTML = `<div id="round"></div>`;
  document.querySelector("#loadingScreen") === null
    ? document.body.appendChild(box)
    : null;
  document.body.className = "hideScroll";
}

function hideLoadingScreen() {
  document.querySelector("#loadingScreen") !== null
    ? document.querySelector("#loadingScreen").remove()
    : null;
  document.body.className = "showScroll";
}

function previewVideo(e) {
  let previewedVideo = null;
  const box = document.querySelector("#previewVideoBox");

  if (data.fetchedVideos[0].hasOwnProperty("id")) {
    previewedVideo = data.fetchedVideos.filter(
      (vid) => vid.id.videoId === e.currentTarget.dataset.id
    )[0];
  } else {
    previewedVideo = data.fetchedVideos.filter(
      (vid) => vid.uri.split("/")[2] === e.currentTarget.dataset.id
    )[0];
  }

  document.querySelector("#searchVideos").className = "searchVideosEmpty";
  document.querySelector("#previewVideoBox").className = "fullPreviewVideoBox";

  loadPreviewVideo(previewedVideo);
  if (document.querySelector(".videoBtn").dataset.eventListenerSet !== "true") {
    console.log("hi");
    setButtons();
  }
}

function loadPreviewVideo(video) {
  if (video !== null) {
    if (!video.hasOwnProperty("link")) {
      document.querySelector(
        "#previewVideoBox iframe"
      ).src = `https://www.youtube.com/embed/${video.id.videoId}`;
      document.querySelector("#previewVideoBox iframe").dataset.id =
        video.id.videoId;
      document.querySelector("#videoTitle h2").textContent =
        video.snippet.title;
      document.querySelector("#videoDescription p").textContent =
        video.snippet.description;
    } else {
      document.querySelector("#videoBox").innerHTML = video.embed.html;
      document.querySelector("#previewVideoBox iframe").dataset.id =
        video.uri.split("/")[2];
      document.querySelector("#videoTitle h2").textContent = video.name;
      document.querySelector("#videoDescription p").textContent =
        video.description;
    }
  }

  checkForArrowStatus(video);
}

function checkForArrowStatus(video) {
  if (data.fetchedVideos.indexOf(video) === 0) {
    if (
      !document
        .querySelectorAll(".videoBtn")[0]
        .className.includes("disableBtn")
    ) {
      document.querySelectorAll(".videoBtn")[0].className += " disableBtn";
    }
  } else if (
    data.fetchedVideos.indexOf(video) ===
    data.fetchedVideos.length - 1
  ) {
    if (
      !document
        .querySelectorAll(".videoBtn")[1]
        .className.includes("disableBtn")
    ) {
      document.querySelectorAll(".videoBtn")[1].className += " disableBtn";
    }
  } else {
    if (
      document
        .querySelectorAll(".videoBtn")[0]
        .className.includes("disableBtn") ||
      document.querySelectorAll(".videoBtn")[1].className.includes("disableBtn")
    ) {
      document
        .querySelectorAll(".videoBtn")
        .forEach((btn) => (btn.className = "videoBtn"));
    }
  }
}

function setButtons() {
  document
    .querySelector("#videoInformation .btn")
    .addEventListener("click", returnToSearchResults);
  document.querySelectorAll(".videoBtn").forEach((btn) => {
    btn.dataset.eventListenerSet = "true";
    btn.addEventListener("click", (e) => {
      let video = null;
      if (data.fetchedVideos[0].hasOwnProperty("id")) {
        video = data.fetchedVideos.filter(
          (vid) =>
            vid.id.videoId ===
            document.querySelector("#videoBox iframe").dataset.id
        )[0];
      } else {
        video = data.fetchedVideos.filter(
          (vid) =>
            vid.uri.split("/")[2] ===
            document.querySelector("#videoBox iframe").dataset.id
        )[0];
      }

      changePreviewVideo(e, video);
    });
  });
}

function returnToSearchResults() {
  document.querySelector("#previewVideoBox").className = "emptyPreviewVideoBox";
  document.querySelector("#searchVideos").className = "searchVideosFullSize";
  document.querySelector("#videoBox iframe").src = "";

  setTimeout(() => {
    document
      .querySelector("#searchVideos")
      .scrollIntoView({ behavior: "smooth" });
  }, 300);
}

function changePreviewVideo(e, loadedVid) {
  let determineVideo = null;
  if (e.target.dataset.action === "next") {
    if (data.fetchedVideos[0].hasOwnProperty("id")) {
      if (
        data.fetchedVideos[
          data.fetchedVideos.indexOf(
            data.fetchedVideos.filter(
              (vid) => vid.id.videoId === loadedVid.id.videoId
            )[0]
          ) + 1
        ] !== undefined
      ) {
        determineVideo =
          data.fetchedVideos[
            data.fetchedVideos.indexOf(
              data.fetchedVideos.filter(
                (vid) => vid.id.videoId === loadedVid.id.videoId
              )[0]
            ) + 1
          ];
      }
    } else {
      if (
        data.fetchedVideos[
          data.fetchedVideos.indexOf(
            data.fetchedVideos.filter(
              (vid) => vid.uri.split("/")[2] === loadedVid.uri.split("/")[2]
            )[0]
          ) + 1
        ] !== undefined
      ) {
        determineVideo =
          data.fetchedVideos[
            data.fetchedVideos.indexOf(
              data.fetchedVideos.filter(
                (vid) => vid.uri.split("/")[2] === loadedVid.uri.split("/")[2]
              )[0]
            ) + 1
          ];
      }
    }
  } else if (e.target.dataset.action === "prev") {
    if (data.fetchedVideos[0].hasOwnProperty("id")) {
      if (
        data.fetchedVideos.indexOf(
          data.fetchedVideos.filter(
            (vid) => vid.id.videoId === loadedVid.id.videoId
          )[0]
        ) -
          1 >=
        0
      ) {
        determineVideo =
          data.fetchedVideos[
            data.fetchedVideos.indexOf(
              data.fetchedVideos.filter(
                (vid) => vid.id.videoId === loadedVid.id.videoId
              )[0]
            ) - 1
          ];
      }
    } else {
      if (
        data.fetchedVideos.indexOf(
          data.fetchedVideos.filter(
            (vid) => vid.uri.split("/")[2] === loadedVid.uri.split("/")[2]
          )[0]
        ) -
          1 >=
        0
      ) {
        determineVideo =
          data.fetchedVideos[
            data.fetchedVideos.indexOf(
              data.fetchedVideos.filter(
                (vid) => vid.uri.split("/")[2] === loadedVid.uri.split("/")[2]
              )[0]
            ) - 1
          ];
      }
    }
  }

  showLoadingScreen();
  loadPreviewVideo(determineVideo);
  document.querySelector("#previewVideoBox iframe").onload = () => {
    hideLoadingScreen();
  };
}
