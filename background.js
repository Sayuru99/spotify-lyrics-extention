chrome.runtime.onInstalled.addListener(() => {
    console.log("Spotify Lyrics Extension Installed");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "GET_LYRICS") {
        fetch(`https://api.lyrics.ovh/v1/${request.artist}/${request.title}`)
            .then(response => response.json())
            .then(data => {
                if (data.lyrics) {
                    sendResponse({ lyrics: data.lyrics });
                } else {
                    sendResponse({ lyrics: "Lyrics not found" });
                }
            })
            .catch(error => sendResponse({ lyrics: `Error: ${error.message}` }));
        return true;
    }
});
