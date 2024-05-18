function getElementByXPath(xpath) {
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function getSongInfo() {
    const songNameXPath = "/html/body/div[4]/div/div[2]/div[2]/footer/div/div[1]/div/div[2]/div[1]/div/div/div/div/span/a";
    const artistNameXPath = "/html/body/div[4]/div/div[2]/div[2]/footer/div/div[1]/div/div[2]/div[3]/div/div/div/div/span/a";

    const titleElement = getElementByXPath(songNameXPath);
    const artistElement = getElementByXPath(artistNameXPath);

    if (titleElement && artistElement) {
        return {
            title: titleElement.textContent,
            artist: artistElement.textContent
        };
    }
    return null;
}

function fetchLyrics() {
    const songInfo = getSongInfo();
    if (songInfo) {
        chrome.runtime.sendMessage(
            { type: "GET_LYRICS", title: songInfo.title, artist: songInfo.artist },
            (response) => {
                if (response && response.lyrics) {
                    displayLyrics(response.lyrics);
                } else {
                    displayLyrics("Lyrics not found");
                }
            }
        );
    }
}

function displayLyrics(lyrics) {
    let lyricsContainer = document.getElementById('lyrics-container');
    if (!lyricsContainer) {
        lyricsContainer = document.createElement('div');
        lyricsContainer.id = 'lyrics-container';
        lyricsContainer.style.position = 'fixed';
        lyricsContainer.style.bottom = '10px';
        lyricsContainer.style.right = '10px';
        lyricsContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        lyricsContainer.style.color = 'white';
        lyricsContainer.style.padding = '10px';
        lyricsContainer.style.borderRadius = '5px';
        lyricsContainer.style.zIndex = '10000';
        lyricsContainer.style.maxHeight = '200px';
        lyricsContainer.style.overflowY = 'auto';
        document.body.appendChild(lyricsContainer);
    }
    lyricsContainer.innerText = lyrics;
}

setInterval(fetchLyrics, 5000);
