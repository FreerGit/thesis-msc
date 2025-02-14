chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Background script received message:", message);

    if (message.action === "open_popup") {
        console.log("Opening extension popup...");

        chrome.windows.create({
            url: chrome.runtime.getURL("popup.html"),
            type: "popup",
            width: 400,
            height: 600
        }, (window) => {
            if (chrome.runtime.lastError) {
                console.error("Error opening popup:", chrome.runtime.lastError.message);
            } else {
                console.log("Popup opened successfully", window);
            }
        });

        // Send a response to indicate popup was opened
        sendResponse({ success: true });
    }

    // Return true to indicate you will call sendResponse asynchronously
    return true;
});
