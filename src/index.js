let data = {
    searchHistory: []
};

(function init() {
    let bar = document.querySelector("#searchBar");
    let btn = document.querySelector("#searchForVideos");

    checkForSearchHistory();
    bar.addEventListener("focus", showSearchHistory);
    bar.addEventListener("blur", hideSearchHistory);
    btn.addEventListener("click", searchForVideos)
})();

function saveSearchHistory(){
    localStorage.setItem("searchHistory", JSON.stringify(data.searchHistory));
}

function checkForSearchHistory(){
    if(localStorage.getItem("searchHistory") !== null){
        data.searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    }
}

function showSearchHistory() {
    if (data.searchHistory.length > 0 && document.querySelector("#searchBar").value === "") {
        const searchHistoryBox = document.createElement("div");
        searchHistoryBox.id = "searchHistoryBox";
        searchHistoryBox.className = "empty";

        if (document.querySelector("#searchHistoryBox") === null) {
            document.querySelector("#searchBar").className = "fixCornersInput";

            setTimeout(() => {
                document.querySelector("#searchBarBox").insertBefore(searchHistoryBox, document.querySelector("#searchBarBox select"));
                let box = document.querySelector("#searchHistoryBox");

                setTimeout(() => {
                    box.className = "fullSize";
                    setTimeout(() => {
                        data.searchHistory.forEach(history => {
                            box.innerHTML += `<div class="search">${history}</div`
                        });

                        document.querySelectorAll(".search").forEach(s => {
                            s.className += " visible";
                            s.addEventListener("click", updateSearchBarTerm)
                        });
                    }, 300);

                }, 100);
            }, 150);
        }
    }
}

function updateSearchBarTerm(e) {
    document.querySelector("#searchBar").value = e.target.textContent
}

function hideSearchHistory() {
    if (document.querySelector("#searchHistoryBox") !== null) {
        let box = document.querySelector("#searchHistoryBox");
        document.querySelectorAll(".search").forEach(s => s.className += " searchHidden");

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

    if(bar !== ""){
        const box = document.querySelector("#searchVideos");
        box.className = "searchVideosFullSize";

        if(data.searchHistory.length === 3){
            let newSearchHistory = [];
            
            data.searchHistory.push(bar);
            for(let i = 1; i < data.searchHistory.length; i++ ){
                newSearchHistory.push( data.searchHistory[i] );
            }

            console.log(data.searchHistory, newSearchHistory)
            data.searchHistory = newSearchHistory
        }
        else{
            data.searchHistory.push(bar);
        }

        saveSearchHistory();
        determineVideosAPI();
    }

}

function determineVideosAPI() {
    const sel = document.querySelector("#searchVideosForm select").value;
    let searchTerm = document.querySelector("#searchBar").value;
    
    //Clear the box after previous searches
    document.querySelector("#videosWrap").innerHTML = "";
    sel === "YouTube" ? searchForYTVideos(searchTerm) : searchForVimeoVideos(searchTerm);
}

async function searchForYTVideos(searchTerm){
    showLoadingScreen();
    let key = "AIzaSyBdi6o7vIJpBcufoIc2ZQiIpNRfhS59FEw";
    let data = await fetch(`https://youtube.googleapis.com/youtube/v3/search?&key=${key}&part=snippet&type=video&q=${searchTerm}&maxResults=12`);
    let fetched = await data.json();

    await loadYTVideos(fetched);
}

function loadYTVideos(videos){
    videos.items.forEach(video => {
        document.querySelector("#videosWrap").innerHTML += 
            `<div class="video">
                <img src="${video.snippet.thumbnails.medium.url}" />
                <div class="videoTitle">${video.snippet.title}</div>
             </div>`
    });

    hideLoadingScreen();
}

function loadVimeoVideos(videos){
    videos.data.forEach(video => {
        document.querySelector("#videosWrap").innerHTML += 
            `<div class="video">
                <img src="${video.pictures.sizes[3].link}" />
                <div class="videoTitle">${video.name}</div>
             </div>`
    });

    hideLoadingScreen();
}

async function searchForVimeoVideos(searchTerm) {
    showLoadingScreen();
    let data = await fetch(`https://api.vimeo.com/videos?query=${searchTerm}?total=12&per_page=12`, 
    {
        headers: {
            "Authorization": "basic N2M5YzI2NTVlNmM1NTVmZTJjNjdlMDYxMzNkYzYyMTVjZjJmOTcxNzpzRlFyUzNWMTBNUnpYTXkzR1A2enZGc0NkUWhFMHZpbUs1M1Bua0lLU3VPS3JxOG5QSGg0NmVpY1doeDBCd1owRC9yZ1IrbW9lVkgyaUFsUmUzNFJadEkrN1liVzRlMEVrVnJscHY1a2VFTUZGdTVmRitNUlUvQ20ydng0aXJnUQ=="
        }
    });
    let fetched = await data.json();

    await loadVimeoVideos(fetched)
}

function showLoadingScreen(){
    const box = document.createElement("div");
    box.id = "loadingScreen";

    box.innerHTML = `<div id="round"></div>`
    document.body.appendChild(box);
    document.body.className = "hideScroll";
    document.querySelector("#videosWrap").style.display = "flex";
}

function hideLoadingScreen(){
    const box = document.querySelector("#searchVideos");
    document.querySelector("#loadingScreen").remove();
    document.body.className = "showScroll";

    box.scrollIntoView({ behavior: "smooth" });
}