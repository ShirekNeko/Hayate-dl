// ==UserScript==
// @name         hayate download
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  downloads images from hayate
// @author       Shiro
// @match        https://reader.hayate.eu/
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.0/FileSaver.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// ==/UserScript==


//funkcja zwraca nazwę, tom i rozdział mangi
function getMangaData(urlToSplit=window.location.pathname){
	let url_regex = /^(https|http):\/\/(.+)\/*$/;
	let url_path = window.location.pathname;
	var mangaData = url_path.split("/");
    return mangaData;
}

//funkcja zwraca ilość stron w rozdziale
function getNumrPage(){
    var options = document.querySelectorAll(".right.nav-menu select option");
    var lastOption = options[options.length - 1];
    var lastPage = lastOption.innerHTML;
    return lastPage;
}

//funkcja główna
(function() {
    'use strict';
	let currentPage = document.querySelector(".right.nav-menu select").selectedIndex + 1;

    const downloadKey = "q";


    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === downloadKey) {
            if(currentPage == 1) {
				let data = GM_setValue( "downloading", "true");
				var i = 1;
				let element = document.querySelector('.page');
				let mangaData = getMangaData();
				let pageNumber = getNumrPage();

				html2canvas(element, {
				onrendered: function(canvas) {
					var imageData = canvas.toDataURL("image/png");
					window.saveAs(imageData, mangaData[1] +`_vol` + mangaData[2] + `chap` + mangaData[3] + `_page-${currentPage}.png`);
					}
				});
				i++;
				GM_setValue("iteraca", i);
				location.href="https://reader.hayate.eu/" + mangaData[1] + '/' + mangaData[2] + '/' + mangaData[3] + '/view#' + i;
			}else{
			alert("Musisz przejść na stronę nr 1, aby rozpocząć pobieranie");
			}
        }
    });


	if(GM_getValue("downloading") === "true" ){
		let mangaData = getMangaData();
		let pageNumber = getNumrPage();
		setTimeout(function() {
			html2canvas(element, {
				onrendered: function(canvas) {
					var imageData = canvas.toDataURL("image/png");
					window.saveAs(imageData, mangaData[1] +`_vol` + mangaData[2] + `chap` + mangaData[3] + `_page-${currentPage}.png`);
				}
			});
			let element = document.querySelector('.page');
			var i = GM_getValue("iteracja");
			i++;
			GM_setValue("iteraca", i);
			if (i > currentPage){
				let data = GM_setValue( "downloading", "false");
			}
			location.href="https://reader.hayate.eu/" + mangaData[1] + '/' + mangaData[2] + '/' + mangaData[3] + '/view#' + i;
		}, 1000);
	}
})();
