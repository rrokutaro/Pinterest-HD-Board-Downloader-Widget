// ==UserScript==
// @name        savepin with query parameters
// @namespace   Violentmonkey Scripts
// @match       https://www.savepin.app/download.php?url=*
// @grant       none
// @version     1.0
// @author      rrokutaro
// @description Description for the second script with query parameters
// ==/UserScript==

// Your code for https://www.savepin.app/download.php with query parameters

let navigateAllowed = false;

function downloadPin() {
    console.log('/download.php?query Start Download');
    // Donwload the currently viewed image
    [...document.querySelector('table').querySelectorAll('tr')][1].querySelector('a').click();

    // Go to local storage, remove the current pin & update localStorage
    // to prevent /download.php from downloading it again
    let downloads = JSON.parse(localStorage.getItem('__downloads'));
    console.log('/download.php?query JSON.parse downloads', downloads);

    // If format is correct (Array), remove the current pin &
    // safely update __downloads,
    if (Array.isArray(downloads) && (downloads?.length > 1)) {
        downloads.shift();
        console.log('/download.php?query Removed current pin from __downloads', downloads);
        localStorage.setItem('__downloads', JSON.stringify(downloads));
        console.log('/download.php?query Committed JSON', localStorage.getItem('__downloads'));
        console.log('/download.php?query Redirect to /download.php');
        navigateAllowed = true;
        window.open('https://www.savepin.app/download.php', '_blank');
        setTimeout(() => window.close(), 0);
    } else if (downloads.length == 1) {
        localStorage.removeItem('__downloads');
        console.log('/download.php?query Nothing left to download, this is the last pin. Redirect to /download.php');
        setTimeout(() => window.close(), 0);
    }
}

// To prevent any unwanted redirects
window.addEventListener('beforeunload', e => {
    if (!navigateAllowed) {
        e.preventDefault();
        e.returnValue = '/download.php?query CANCEL THIS REDIRECT!!![CANCEL]'
    } else {
        alert('/download.php?query Redirect is allowed.');
        navigateAllowed = false;
    }
});


if (window.location.search) downloadPin();
else console.log('/download.php?query', 'There is no query, will not download');