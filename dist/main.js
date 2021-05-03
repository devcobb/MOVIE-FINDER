/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (() => {

eval("let data = {\r\n    searchHistory: []\r\n};\r\n\r\n(function init() {\r\n    let bar = document.querySelector(\"#searchBar\");\r\n    let btn = document.querySelector(\"#searchForVideos\");\r\n\r\n    bar.addEventListener(\"focus\", showSearchHistory);\r\n    bar.addEventListener(\"blur\", hideSearchHistory);\r\n    btn.addEventListener(\"click\", searchForVideos)\r\n})();\r\n\r\nfunction showSearchHistory() {\r\n    if (data.searchHistory.length > 0 && document.querySelector(\"#searchBar\").value === \"\") {\r\n        const searchHistoryBox = document.createElement(\"div\");\r\n        searchHistoryBox.id = \"searchHistoryBox\";\r\n        searchHistoryBox.className = \"empty\";\r\n\r\n        if (document.querySelector(\"#searchHistoryBox\") === null) {\r\n            document.querySelector(\"#searchBar\").className = \"fixCornersInput\";\r\n\r\n            setTimeout(() => {\r\n                document.querySelector(\"#searchBarBox\").insertBefore(searchHistoryBox, document.querySelector(\"#searchBarBox select\"));\r\n                let box = document.querySelector(\"#searchHistoryBox\");\r\n\r\n                setTimeout(() => {\r\n                    box.className = \"fullSize\";\r\n                    setTimeout(() => {\r\n                        data.searchHistory.forEach(history => {\r\n                            box.innerHTML += `<div class=\"search\">${history}</div`\r\n                        });\r\n\r\n                        document.querySelectorAll(\".search\").forEach(s => {\r\n                            s.className += \" visible\";\r\n                            s.addEventListener(\"click\", updateSearchBarTerm)\r\n                        });\r\n                    }, 300);\r\n\r\n                }, 100);\r\n            }, 150);\r\n        }\r\n    }\r\n}\r\n\r\nfunction updateSearchBarTerm(e) {\r\n    document.querySelector(\"#searchBar\").value = e.target.textContent\r\n}\r\n\r\nfunction hideSearchHistory() {\r\n    if (document.querySelector(\"#searchHistoryBox\") !== null) {\r\n        let box = document.querySelector(\"#searchHistoryBox\");\r\n        document.querySelectorAll(\".search\").forEach(s => s.className += \" searchHidden\");\r\n\r\n        setTimeout(() => {\r\n            box.innerHTML = \"\";\r\n            box.className = \"empty\";\r\n\r\n            setTimeout(() => {\r\n                box.style.border = \"none\";\r\n                box.style.padding = \"1px 15px\";\r\n\r\n\r\n                setTimeout(() => {\r\n                    box.remove();\r\n                    document.querySelector(\"#searchBar\").className = \"\";\r\n                }, 200);\r\n            }, 100);\r\n\r\n        }, 300);\r\n    }\r\n}\r\n\r\nfunction searchForVideos(e) {\r\n    const box = document.querySelector(\"#searchVideos\");\r\n\r\n    e.preventDefault();\r\n    box.className = \"searchVideosFullSize\";\r\n\r\n    setTimeout(() => {\r\n        box.scrollIntoView({ behavior: \"smooth\" });\r\n    }, 300);\r\n\r\n    determineVideosAPI();\r\n    //https://www.googleapis.com/youtube/v3/search\r\n}\r\n\r\nfunction determineVideosAPI() {\r\n    const sel = document.querySelector(\"#searchVideosForm select\").value;\r\n    let searchTerm = document.querySelector(\"#searchBar\").value;\r\n    sel === \"YouTube\" ? searchForYTVideos(searchTerm) : searchForVimeoVideos(searchTerm);\r\n}\r\n\r\nasync function searchForYTVideos(searchTerm){\r\n    let key = \"AIzaSyBdi6o7vIJpBcufoIc2ZQiIpNRfhS59FEw\";\r\n    \r\n    let data = await fetch(`https://youtube.googleapis.com/youtube/v3/search?&part=snippet&q=${searchTerm}&key=${key}`);\r\n    let fetched = await data.json();\r\n    await loadYTVideos(fetched);\r\n}\r\n\r\nfunction loadYTVideos(videos){\r\n    videos.items.forEach(video => {\r\n        document.querySelector(\"#searchVideos\").innerHTML += `<div class=\"videoBox\"><iframe src=\"https://www.youtube.com/embed/${video.id.videoId}\"></iframe></div>`\r\n    });\r\n}\r\n\r\nfunction searchForVimeoVideos(searchTerm) {\r\n\r\n}\n\n//# sourceURL=webpack://video-finder/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"]();
/******/ 	
/******/ })()
;