// ==UserScript==
// @name         hayate-dl
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Pobieranie mangi ze strony hayate.eu
// @author       Shiro
// @match        https://reader.hayate.eu/*
// @match        https://hayate.eu/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.jsdelivr.net/npm/js-base64@3.6.0/base64.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.3.2/html2canvas.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

// funkcja nadajaca styl
GM_addStyle(`
    .btn_script{
        position: relative;
        display: block;
        align-items: center;
        color: #f8f9fa;
        height: 40px;
        border-radius: 4px;
        z-position: 12;
        font-family: nunito sans,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,helvetica neue,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol;
        font-size: 16px;
    }
    #All{
        background-color: #1ea63d;
        border-color: #1ea63d;
        left: 20px;
        top: 5px;
        width: 200px;
    }
    #Chapter{
        position: relative;
        background-color: #6f42c1;
        border-color: #6f42c1;
        left: 235px;
        top:  0px;
        width: 200px;
    }
`);


// funkcja zwraca hash strony, tj #cyfra
function getNumerPage() {
    let url_path = window.location.hash;
    var mangaData = url_path.split("#");
    return mangaData;
}

// funkcja zwraca nazwę projektu
function getMangaName() {
    let url_path = window.location.pathname;
    var mangaData = url_path.split("/");
    return mangaData;
}

// funkcja zwraca nazwę hosta
function getMangaHostName() {
    let url_path = window.location.hostname;
    var mangaURL = url_path.split("/");
    return mangaURL;
}

// funkcja wywołana na readerze dodająca przycisk pobierajacy całą mangę
function handleMangaAllPage() {
    var btnPlace = $(".single").first();
    var btnCode = "<button id='All' class='btn_script' style='margin-bottom: 15px;'>Pobierz całą mangę</button>";
    btnPlace.html(btnPlace.html() + btnCode);

    $("#All").on("click", function () {
        var mangaName = getMangaName();
        var saveProject = [mangaName[2], "true"];
        GM_setValue("project", saveProject);
        location.href = "https://reader.hayate.eu/" + mangaName[2] + '/1/1/view#1';
    });
}

// przyszła funkcjonalność -
function handleMangaChapterPage() {
    var a = 0;

}

// Funkcja, która ściąga karty mangi
function downloaderManga() {
    var mangaPathName = getMangaName();
    var currentPage = getNumerPage();
    setTimeout(function () {
        let element = document.querySelector('.page');
        html2canvas(element).then(canvas => {
            var imageData = canvas.toDataURL("image/png");
            window.saveAs(imageData, mangaPathName[1] +`_vol` + mangaPathName[2] + `chap` + mangaPathName[3] + `_page-${currentPage[1]}.png`);
            $('.nav-arrow.nav-right').click();
        });
    }, 3000);
    setTimeout(function () {
        downloaderManga();
    }, 3000);
}


// funkcja główna
(function () {
    'use strict';

    handleMangaAllPage();
    // handleMangaChapterPage();
    var mangaPathName = getMangaName();
    var mangaHostName = getMangaHostName();
    var mangaIf = GM_getValue("project");
    if (mangaHostName == "reader.hayate.eu" && mangaIf[1] == "true" && mangaIf[0] == mangaPathName[1]) {
        downloaderManga();
    }

})();
