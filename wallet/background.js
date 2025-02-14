chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "notify_request") {
        console.log("Authentication request detected from website.");

        // Simulate opening the popup by calling chrome.action.openPopup()
        chrome.action.openPopup(); // Opens the default popup (popup.html)
    }
});
