// ==UserScript==
// @name        savepin.app without parameters
// @namespace   Violentmonkey Scripts
// @include     https://www.savepin.app/download.php
// @grant       none
// @version     1.0
// @author      rrokutaro
// @description 13/10/2023, 15:07:11
// ==/UserScript==


const DOM = {
    inputURL: null,
    downloadBtn: null
};

window.addEventListener('message', handleMessages);


let storage = { polled: false };
let navigateAllowed = false;

function handleMessages(e) {
    if (e.origin.includes('pinterest')) {

        // If downloads are still pending, No messages should be
        // received. If there are no downloads, then messages can be received
        // and a new download can be initiated
        if (!localStorage.getItem('__downloads')) {
            if (e.data.type.includes('polling') && (!storage.polled)) {
                storage.polled = true;
                e.source.postMessage('ready', '*');
            }

            if (e.data.type.includes('pins') && storage.polled) {
                let pins = e.data.pins;
                console.log('Pins received', pins);

                if (pins.length > 0) commitDownload(pins);
            }
        } else console.log('/download.php Cant receive messages, busy with downloads.')
    }
}



function commitDownload(pins) {
    // Commit pins to localStorage
    localStorage.setItem('__downloads', JSON.stringify(pins));
    console.log('Commit is complete (In JSON)', localStorage.getItem('__downloads'));

    // Start download
    download();
}



function download() {
    console.log('Downloading ini from /download.php');
    let downloads = localStorage.getItem('__downloads');
    downloads = JSON.parse(downloads);
    console.log('/download.php JSON.parse', downloads);

    if (Array.isArray(downloads) && (downloads?.length > 0)) {
        console.log('/download.php is Array, length > 0');

        // Get the first pin in the Array, redirect to it,
        // download will continue & finish there
        if (downloads[0]) {
            // Download it
            let pinURL = downloads[0];
            console.log('/download.php first item', pinURL);
            pinURL = `https://www.savepin.app/download.php?url=${encodeURIComponent(pinURL)}&lang=en&type=redirect`;
            navigateAllowed = true;
            console.log('/download.php Navigate to final download URL', pinURL);
            window.open(pinURL, '_blank');
            setTimeout(() => window.close(), 0);
        } else {
            alert('download complete');
        }
    } else console.log('No downloads');

}


// To prevent any unwanted redirects
window.addEventListener('beforeunload', e => {
    if (!navigateAllowed) {
        e.preventDefault();
        e.returnValue = '/download.php CANCEL THIS REDIRECT!!![CANCEL]'
    } else {
        alert('/download.php Redirect is allowed.');
        navigateAllowed = false;
    }
});


if (!window.location.search) {
    console.log('/download.php No query string', window.location.search);
    download();
} else {
    console.log('/download.php Query String Found, Not interested', window.location.search);
}

