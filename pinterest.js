// ==UserScript==
// @name        Pinterest HD Board Downloader
// @namespace   Violentmonkey Scripts
// @include     https://za.pinterest.com/rrokutar/*
// @grant       none
// @version     1.0
// @author      -
// @description 12/10/2023, 17:58:03
// ==/UserScript==
// Prepare components & css
const DOM = {};
let selectedPins = "";
let pointerValues = { clientX: 0, clientY: 0 };


function initComp() {
    let boardWrapper = document.createElement('div');
    let toggleDownloaderBtn = document.createElement('div');
    let style = document.createElement('style');
    let boardInfo = null;

    DOM.toggleDownloaderBtn = toggleDownloaderBtn;
    DOM.boardWrapper = boardWrapper;
    DOM.toggleDownloaderBtn.__status = '';

    style.innerHTML = `/* Global variables */
:root {
    /* Colors */
    --f-c-1: #000;
    --f-c-2: #adadad;
    --f-c-3: #d9d9d9;
    --bg-c-1: #fff;
    --accent-1: #3487e9;

    /* Fonts */
    --f1: "SF Pro Display Regular";
    --f2: "SF Pro Display Bold";
    --f3: "SF Pro Display Light";
    --f4: "SF Pro Display Thin";

    /* Font sizes */
    --8px: 0.586vw;
    --9px: 0.659vw;
    --12px: 0.879vw;
    --16px: 1.172vw;
    --24px: 1.758vw;
    --40px: 2.93vw;

    /* Padding */
    --pad-16px: 1.172vw;

    /* Margin */
    --marg-6-56px: 0.481vw;
    --marg-7px: 0.513vw;
    --marg-22px: 1.612vw;
    --marg-24px: 1.758vw;

    /* Other */
    --width-475px: 34.799vw;
    --close-icon-width-height: 1.538vw;
    --border-color: #000;
    --border-width-1px: 0.073vw;

    /* Selected pin */
    --outline-w-4px: 0.293vw;
    --outline-rad-10px: 0.733vw;
}

body {
    height: 300vh;
}

/* Enable downloader button */
[data-enable-downloader] {
    font-size: var(--16px);
    padding: 0.879vw;

    border-style: solid;
    border-color: var(--border-color);
    border-width: var(--border-width-1px);
    text-align: left;

    font-family: var(--f1), Inter, sans-serif;

    cursor: pointer;
    background-color: var(--bg-c-1);

    position: fixed;
    left: 1.832vw;
    bottom: 1.832vw;
}

/* Downloader component */
.downloader-component,
.downloader-component * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Styles apply to all downloader components (pin, board) */
.downloader-component {
    display: none;
    font-family: var(--f1);
    color: var(--f-c-1);
    background-color: var(--bg-c-1);

    width: var(--width-475px);
    height: fit-content;
    box-sizing: content-box;

    padding-inline-start: var(--pad-16px);
    padding-inline-end: var(--pad-16px);
    padding-block-start: var(--pad-16px);

    border-style: solid;
    border-color: var(--border-color);
    border-width: var(--border-width-1px);

    box-shadow: -0.440vw 1.026vw 2.711vw rgba(0, 0, 0, 0.25);

    overflow: hidden;
    position: fixed;
    left: 1.832vw;
    bottom: 1.832vw;
    user-select: none;
}

/* Link styles */
.downloader-component a {
    color: var(--accent-1);
}

/* Board component children */
[data-content-heading] {
    font-size: var(--16px);
}

.light {
    color: var(--f-c-2);
}

[data-notice] {
    font-size: var(--12px);
    margin-block-start: 0.513vw;
}

.controls-wrapper {
    width: 100%;
    height: fit-content;

    display: grid;
    justify-content: center;
    align-items: center;

    margin-block-start: 1.612vw;
    margin-block-end: 3.077vw;
}

.controls-flex-wrapper {
    width: fit-content;
    height: fit-content;

    display: flex;
    align-items: center;
    flex-direction: row;
}

.controls-flex-wrapper > div:not(.controls-flex-wrapper > .vertical-separator) {
    color: var(--f-c-1);
    text-decoration: none;
    text-align: center;
    cursor: pointer;
}

.controls-flex-wrapper > div:not(.controls-flex-wrapper > div:last-of-type) {
    margin-inline-end: 1.758vw;
}

[data-button-wrap] {
    display: flex;
    flex-direction: column;
    align-items: center;
}

[data-button-wrap] h1 {
    font-size: var(--40px);
    font-family: var(--f2);
}

[data-button-wrap] p {
    font-size: var(--9px);
    font-weight: 100;
    font-family: var(--f3);
    font-style: normal !important;
    margin-block-end: 0.44vw;
    margin-block-start: -0.4vw;
}

[data-button-wrap] a {
    display: inline-block;
    color: var(--accent-1) !important;
    text-decoration: underline !important;
    font-size: var(--8px);
}

[data-operation-text] {
    font-size: var(--24px);
    font-weight: lighter;
    font-family: var(--f3);
    text-align: left;
}

.vertical-separator {
    height: 4.029vw;
    width: 0.073vw;
    background-color: var(--f-c-3);
}

.downloader-component footer {
    font-size: var(--8px);
    font-family: var(--f3);
    color: var(--f-c-2);
    height: 1.319vw;
    width: 100%;
    border-top: var(--border-width-1px) solid var(--f-c-3);

    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 0;
    left: 0;

    user-select: text;
}

.email {
    font-weight: bold;
    text-decoration: none;
    color: var(--f-c-2) !important;
}

[data-close-button] {
    position: absolute;
    right: 0.952vw;
    top: 0.952vw;
    width: var(--close-icon-width-height);
    height: var(--close-icon-width-height);

    cursor: pointer;
}


.pinSelected {
    border: 0.5vw solid var(--accent-1) !important;
    border-radius:  1vw !important;
    background-color: rgba(52, 135, 233, 0.5) !important;
    cursor: pointer !important;

    width: 100%;
    height: 100%;

    position: absolute;
    left: 0;
    top: 0;
}
`;

    toggleDownloaderBtn.setAttribute('data-enable-downloader', "");
    toggleDownloaderBtn.innerHTML = `
        Enable Board<br>
        Downloader
 `;

    boardWrapper.className = 'board-wrapper downloader-component';
    boardWrapper.innerHTML = `
        <!-- The heading -->
        <h3 data-content-heading>
            <span class="light">Board &bull;</span>
            <span data-title="Female Potraits">Female Potraits</span>
        </h3>

        <!-- The notice -->
        <p data-notice class="light">
            <b>Note</b> — To manually select or deselect your pins, simply hover over the desired pin and press the <a>"CtrlKey"</a>.
            To download all selected pins, click on "Currently Selected pins". To download all pins, click on "Available Pins".
            To select all visible pins, click on "Select all visible pins". Enjoy!
        </p>

        <!-- System controls component -->
        <div class="controls-wrapper">
            <div class="controls-flex-wrapper">
                <!-- Currently selected pins wrapper -->
                <div data-currently-selected-wrap data-button-wrap>
                    <h1 data-selected-pins>0</h1>
                    <p class="light">
                        Pins current<br>
                        selected
                    </p>

                    <a href="#!" data-download-selected-pins>Download</a>
                </div>

                <div class="vertical-separator"></div>

                <!-- Total amount of pins -->
                <div href="#!" data-available-pins-wrap data-button-wrap>
                    <h1 data-available-pins>0</h1>
                    <p class="light">
                        Total pins are<br>
                        available for this board
                    </p>

                    <a href="#!" data-download-available-pins>Download</a>
                </div>

                <div class="vertical-separator"></div>

                <!-- Button for selecting / deselecting all pins -->
                <div href="#!" data-select-deselect-pins-wrap data-operation="select-all">
                    <h2 data-operation-text class="light">
                        Select all<br>
                        visible pins
                    </h2>
                </div>
            </div>
        </div>

        <svg data-close-button width="21" height="21" viewBox="0 0 21 21" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 7.5L13.5 13.5M13.5 7.5L7.5 13.5" stroke="black" stroke-linecap="round"
                stroke-linejoin="round" />
        </svg>


        <footer>
            <p>
                For more information / suggestions, contact
                <a class="email" href="mailto:rrokutaro@gmail.com.">rrokutaro@gmail.com</a>
            </p>
        </footer>`;


    // Access important elements
    DOM.boardHeadingElem = boardWrapper.querySelector('span[data-title]');
    DOM.currentlySelectedElem = boardWrapper.querySelector('[data-currently-selected-wrap] [data-selected-pins]');
    DOM.availablePinsElem = boardWrapper.querySelector('[data-available-pins-wrap] [data-available-pins]');
    DOM.availablePinsElemWrap = boardWrapper.querySelector('[data-available-pins-wrap]');
    DOM.currentlySelectedElemWrap = boardWrapper.querySelector('[data-currently-selected-wrap]');
    DOM.selectDeselectWrap = boardWrapper.querySelector('[data-select-deselect-pins-wrap]');
    DOM.selectDeselectElem = boardWrapper.querySelector('[data-select-deselect-pins-wrap] [data-operation-text]');
    DOM.closeBtn = boardWrapper.querySelector('[data-close-button]');
    DOM.selectDeselectWrap.__status = '';

    // Add elements to document
    document.head.append(style);
    document.body.append(toggleDownloaderBtn);
    document.body.append(boardWrapper);
}

initComp();
console.log(DOM);


DOM.toggleDownloaderBtn.addEventListener("click", iniDownloader);
function iniDownloader() {
    if (DOM.toggleDownloaderBtn.__status.includes('active')) {
        disableDownloader();
        return;
    } else {
        let username = localStorage.getItem('__username');

        if (!username) {
            username = prompt('Enter your pinterest username. e.g, https://www.pinterest.com/username/', false);
            if (!username) {
                alert('Username required');
                return;
            }
        }

        checkEnv(username);
    };
}



// Check environment and show downloader
function checkEnv(username = "") {
    let currentURL = new URL(location.href);
    let path = currentURL.pathname;
    let splitPath = path.split(`/${username}/`);

    // If its not a pin & there are signs the url follows a board like URL, everything is all good
    if (!(path.includes(`/${username}/pin/`)) && (splitPath.length > 1)) {
        localStorage.setItem('__username', username);
        console.log('URL is good', username);
    } else {
        alert('Username provided does not match context!');
        localStorage.removeItem('__username');
        disableDownloader();
        return;
    };


    // Check for the boardFeed & pinCount, if they are there chances are this is
    // a board page
    let boardFeed = document.querySelector('[data-test-id="board-feed"]') || document.querySelector('[data-test-id="base-board-pin-grid"]');
    let pinCount = document.querySelector('[class="Jea KS5 LCN hs0 zI7 iyn Hsu"]');
    pinCount = +([...pinCount.innerText.matchAll(/\d+/gi)][0][0]);

    if (boardFeed && pinCount) {
        let boardName = '';
        let regex = /\/.*?(?=\/)/mgi;
        let path_NO_USERNAME = new URL(location.href).pathname.replace(`/${username}`, '');
        let pathArr = [...path_NO_USERNAME.match(regex)];

        for (let dir of pathArr) {
            let dirName = dir.replace(/\//mgi, '');
            dirName = dirName.replace(/\-/mgi, ' ');
            dirName = dirName.replace(/\w+/mgi, (match, g1, offset, string) => {
                let word = match[0].toUpperCase() + match.slice(1);
                console.log(match, g1, offset, string);
                return word;
            });

            let delim = ' / ';
            if (dir != pathArr.at(-1)) {
                boardName += dirName + delim;
            } else boardName += dirName;
        }


        if (boardName) console.log('%cENVIRONMENT: REALLY GOOD', 'color: cyan; font-family: "Denim Black";');
        else {
            console.log('%cENVIRONMENT: OK', 'color: green; font-family: "Denim Black";');
            boardName = 'A Board';
        }

        boardInfo = {
            boardName,
            boardFeed,
            pinCount
        };

        // Enable downloader
        enableDownloader(boardInfo);
    } else {
        console.log('%cENVIRONMENT: UNCOMPATIBLE', 'color: red; font-family: "Denim Black";');
    }
}





function trackPointer(e) {
    pointerValues.clientX = e.clientX;
    pointerValues.clientY = e.clientY;
}



function enableDownloader(info) {
    // Track pointer movement immediately
    document.addEventListener('pointermove', trackPointer);
    DOM.toggleDownloaderBtn.display = '';
    DOM.toggleDownloaderBtn.innerHTML = `Disable Board<br> Downloader`;
    DOM.boardHeadingElem.innerHTML = info.boardName;
    selectedPins = new Set();

    updateInfo();

    // Event delegation to handle adding / removing, selecting pins.
    document.addEventListener("keydown", selectorLogic);

    // Handlers for controls
    // DOM.availablePinsElemWrap = boardWrapper.querySelector('[data-available-pins-wrap]');
    // DOM.currentlySelectedElemWrap = boardWrapper.querySelector('[data-currently-selected-wrap]');
    DOM.selectDeselectWrap.addEventListener('click', selectVisiblePins);
    DOM.currentlySelectedElemWrap.addEventListener('click', commitDownloads);
    DOM.availablePinsElemWrap.addEventListener('click', downloadAllPins);
    DOM.closeBtn.addEventListener('click', disableDownloader);

    // Show board downloader component
    DOM.boardWrapper.style.display = 'block';

    console.log('downloader enabled');
}


function downloadAllPins() {
    if (boardInfo) {
        // Select visible pins
        selectVisiblePins();

        // Check if they match the total number of pins availalble
        // within the current board
        if (selectedPins.size == boardInfo.pinCount) {
            // Start download
            commitDownloads();
        } else {
            // Scroll 50%, and repeat recursively until selected pins
            // are equal to total available pins
            console.log('Scroll, & select more');
            window.scrollBy(0, (window.innerHeight / 2));
            setTimeout(() => downloadAllPins(), 0);
        }
    }
}

function selectDeselectMaster(e) {
    if (!DOM.selectDeselectWrap.__status.includes('active')) {
        selectVisiblePins();
    } else {
        deselectVisiblePins();
    }
}

function selectVisiblePins() {
    console.log('select visible pins');
    DOM.selectDeselectWrap.__status = 'active';
    DOM.selectDeselectElem.innerHTML = 'Hold on<br> tight...';


    // Select visible all pins
    [...boardInfo.boardFeed.querySelectorAll('[data-test-id="pinWrapper"]')].forEach(pinWrapper => {
        let pinLink = pinWrapper.querySelector('a[href*="/pin/"]');

        if (!selectedPins.has(pinLink.href)) {
            selectedPins.add(pinLink.href);
            pinWrapper.style.opacity = 0.5;
            console.log('Added', selectedPins);
            updateInfo();
        }
    });

    DOM.selectDeselectElem.innerHTML = 'Select all<br>visible pins';
}


function deselectVisiblePins() {
    console.log('Deselect visible pins');
    DOM.selectDeselectWrap.__status = '';
    DOM.selectDeselectElem.innerHTML = 'Hold on<br> tight...';

    // Deselect selected pins
    [...boardInfo.boardFeed.querySelectorAll('[data-test-id="pinWrapper"]')].forEach(pinWrapper => {
        let pinLink = pinWrapper.querySelector('a[href*="/pin/"]');

        if (selectedPins.has(pinLink.href)) {
            selectedPins.delete(pinLink.href);
            pinWrapper.style.opacity = 1;
            console.log('Removed', selectedPins);
        }
    });

    DOM.selectDeselectElem.innerHTML = 'Select all<br>visible pins';
}


function updateInfo() {
    let selectedSize = selectedPins.size;
    let availablePins = +([...document.querySelector('[class="Jea KS5 LCN hs0 zI7 iyn Hsu"]').innerText.matchAll(/\d+/gi)][0][0]);

    if (availablePins >= 1000) availablePins = `${availablePins / 1000}k`;
    if (availablePins >= 1000_000) availablePins = `${availablePins / 1000_000}M`;

    DOM.currentlySelectedElem.innerHTML = selectedSize;
    DOM.availablePinsElem.innerHTML = availablePins;

    console.log('updateInfo()');
}

function selectorLogic(e) {
    if ((e.ctrlKey || e.metaKey) && (!e.repeat)) {
        let elementFromPoint = document.elementFromPoint(pointerValues.clientX, pointerValues.clientY);

        if (elementFromPoint) {
            let pinWrapper = elementFromPoint?.closest('[data-test-id="pinWrapper"]');
            let pinLink = elementFromPoint?.closest('a[href*="/pin/"]');

            if (pinLink && pinWrapper) {
                if (!selectedPins.has(pinLink.href)) {
                    selectedPins.add(pinLink.href);
                    pinWrapper.style.opacity = 0.5;
                    console.log('Added', selectedPins);
                } else {
                    selectedPins.delete(pinLink.href);
                    pinWrapper.style.opacity = 1;
                    console.log('Removed', selectedPins);
                }

                updateInfo();
            }
        }
    }
}



function disableDownloader() {
    // Remove handlers (functionality)
    document.removeEventListener("keydown", selectorLogic);
    document.removeEventListener('pointermove', trackPointer);
    DOM.selectDeselectWrap.removeEventListener('click', selectVisiblePins);


    // Hide board downloader component
    DOM.boardWrapper.style.display = 'none';
    DOM.toggleDownloaderBtn.style.display = '';
    DOM.toggleDownloaderBtn.__status = '';
    DOM.toggleDownloaderBtn.innerHTML = `Enable Board<br> Downloader`;

    // Deselect selected pins
    [...boardInfo.boardFeed.querySelectorAll('[data-test-id="pinWrapper"]')].forEach(pinWrapper => {
        let pinLink = pinWrapper.querySelector('a[href*="/pin/"]');

        if (selectedPins.has(pinLink.href)) {
            selectedPins.delete(pinLink.href);
            pinWrapper.style.opacity = 1;
            console.log('Removed', selectedPins);
        }
    });

    selectedPins = null;

    console.log('downloader disabled');
}


let downloaderWindow = null;
let timeout = null;
let pins = null;

function commitDownloads() {
    let startTime = Date.now();

    console.log('commit');
    pins = [...selectedPins.values()];
    disableDownloader();

    window.addEventListener("message", handleMessages);
    downloaderWindow = window.open('https://www.savepin.app/download.php', '_blank');
    timeout = setInterval(() => {
        let elapsedTime = (Date.now() - startTime) / 1e3;
        if (elapsedTime <= 120) {
            console.log('polling', `${elapsedTime}s`);
            downloaderWindow.postMessage({ type: 'polling' }, '*');
        } else console.log('%cFailed to download: Download page not responding', 'color: red; font-size: 24px; font-family: "Tusker Grotesk";')
    }, 500);
}

function handleMessages(e) {
    if (e.origin.includes('savepin')) {
        console.log('Message from ' + e.origin)
        let message = e.data;
        if (message?.includes('ready')) {
            console.log('ready');
            console.log('tm', timeout);
            clearInterval(timeout);
            downloaderWindow.postMessage({ type: 'pins', pins: pins }, '*');
        }
    } else console.log('Message from unauthorized origin, not interested!');
}






