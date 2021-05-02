let data = {
    searchHistory: []
};

(function init() {
    let bar = document.querySelector("#searchBar");
    bar.addEventListener("focus", showSearchHistory);
    bar.addEventListener("blur", hideSearchHistory);
})();

function showSearchHistory() {
    if(data.searchHistory.length > 0 && document.querySelector("#searchBar").value === ""){
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

function updateSearchBarTerm(e){
    document.querySelector("#searchBar").value = e.target.textContent
}

function hideSearchHistory() {
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