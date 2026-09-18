const book = document.getElementById("book");
const pages = document.querySelectorAll(".page");
const music = document.getElementById("music");

const TOTAL_PAGES = 10;

const SONG_START = 58;   // 0:58
const SONG_END = 318;    // 5:18

let currentPage = 1;
let isAnimating = false;

let startX = 0;
let startY = 0;

let pointerDown = false;
let moved = false;


// =====================================
// GET PAGE
// =====================================

function getPage(pageNumber) {
    return document.getElementById("page" + pageNumber);
}


// =====================================
// RESET PAGES
// =====================================

function resetPages() {

    pages.forEach(page => {

        page.classList.remove(
            "active",
            "flip-next",
            "flip-prev"
        );

        page.style.visibility = "hidden";
        page.style.zIndex = "1";
        page.style.transform = "rotateY(0deg)";
    });
}


// =====================================
// SHOW CURRENT PAGE
// =====================================

function showCurrentPage() {

    resetPages();

    const page = getPage(currentPage);

    page.classList.add("active");

    page.style.visibility = "visible";
    page.style.zIndex = "10";
}


// =====================================
// START MUSIC
// =====================================

function startMusic() {

    music.pause();

    music.currentTime = SONG_START;

    music.play()
        .then(() => {

            /*
             * Phone par agar browser
             * playback ko 0:00 par le aaye,
             * to 0:58 par wapas set karo.
             */

            if (music.currentTime < SONG_START) {
                music.currentTime = SONG_START;
            }

        })
        .catch(error => {

            console.log("Music error:", error);

        });
}


// =====================================
// STOP MUSIC
// =====================================

function stopMusic() {

    music.pause();

    music.currentTime = SONG_START;
}


// =====================================
// STOP AT 5:18
// =====================================

music.addEventListener("timeupdate", function () {

    if (music.currentTime >= SONG_END) {

        music.pause();

        music.currentTime = SONG_START;
    }
});


// =====================================
// NEXT PAGE
// =====================================

function nextPage() {

    if (isAnimating) return;

    isAnimating = true;

    const oldPage = getPage(currentPage);

    let nextPageNumber = currentPage + 1;

    if (nextPageNumber > TOTAL_PAGES) {
        nextPageNumber = 1;
    }

    const newPage = getPage(nextPageNumber);

    newPage.style.visibility = "visible";
    newPage.style.zIndex = "5";
    newPage.style.transform = "rotateY(0deg)";

    oldPage.style.zIndex = "20";

    oldPage.classList.add("flip-next");


    // =================================
    // PAGE 1 → PAGE 2
    // =================================

    if (
        currentPage === 1 &&
        nextPageNumber === 2
    ) {

        startMusic();
    }


    // =================================
    // PAGE 10 → PAGE 1
    // =================================

    if (
        currentPage === 10 &&
        nextPageNumber === 1
    ) {

        stopMusic();
    }


    currentPage = nextPageNumber;


    setTimeout(function () {

        showCurrentPage();

        isAnimating = false;

    }, 750);
}


// =====================================
// PREVIOUS PAGE
// =====================================

function previousPage() {

    if (isAnimating) return;

    isAnimating = true;

    const oldPage = getPage(currentPage);

    let previousPageNumber = currentPage - 1;

    if (previousPageNumber < 1) {
        previousPageNumber = TOTAL_PAGES;
    }

    const previousPage = getPage(previousPageNumber);

    previousPage.style.visibility = "visible";

    previousPage.style.zIndex = "20";

    previousPage.style.transform = "rotateY(-180deg)";

    previousPage.classList.add("flip-prev");


    // =================================
    // BACK TO PAGE 1
    // =================================

    if (previousPageNumber === 1) {

        stopMusic();
    }


    currentPage = previousPageNumber;


    setTimeout(function () {

        showCurrentPage();

        isAnimating = false;

    }, 750);
}


// =====================================
// POINTER DOWN
// =====================================

book.addEventListener("pointerdown", function (event) {

    if (isAnimating) return;

    pointerDown = true;

    moved = false;

    startX = event.clientX;
    startY = event.clientY;

    event.preventDefault();
});


// =====================================
// POINTER MOVE
// =====================================

book.addEventListener("pointermove", function (event) {

    if (!pointerDown) return;

    const moveX = event.clientX - startX;
    const moveY = event.clientY - startY;

    if (
        Math.abs(moveX) > 30 ||
        Math.abs(moveY) > 30
    ) {

        moved = true;
    }

    event.preventDefault();
});


// =====================================
// POINTER UP
// =====================================

book.addEventListener("pointerup", function (event) {

    if (!pointerDown) return;

    pointerDown = false;

    const differenceX =
        event.clientX - startX;


    // =================================
    // SWIPE LEFT → NEXT
    // =================================

    if (
        moved &&
        differenceX < -50
    ) {

        nextPage();

        event.preventDefault();

        return;
    }


    // =================================
    // SWIPE RIGHT → PREVIOUS
    // =================================

    if (
        moved &&
        differenceX > 50
    ) {

        previousPage();

        event.preventDefault();

        return;
    }


    // =================================
    // TAP → NEXT
    // =================================

    if (!moved) {

        nextPage();
    }

    event.preventDefault();
});


// =====================================
// POINTER CANCEL
// =====================================

book.addEventListener("pointercancel", function () {

    pointerDown = false;

    moved = false;
});


// =====================================
// PREVENT DOUBLE CLICK
// =====================================

book.addEventListener("dblclick", function (event) {

    event.preventDefault();
});


// =====================================
// PREVENT IMAGE DRAG
// =====================================

document.addEventListener("dragstart", function (event) {

    event.preventDefault();
});


// =====================================
// LAPTOP ARROW KEYS
// =====================================

document.addEventListener("keydown", function (event) {

    if (event.key === "ArrowRight") {

        nextPage();
    }

    if (event.key === "ArrowLeft") {

        previousPage();
    }
});


// =====================================
// START PAGE 1
// =====================================

currentPage = 1;

showCurrentPage();

stopMusic();