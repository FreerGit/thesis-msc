window.addEventListener("message", (event) => {
    if (event.source !== window || event.data.type !== "DID_AUTH_REQUEST") {
        return;
    }

    console.log("Detected authentication request from website.");

    // Send a message to the background script to inform about the request
    chrome.runtime.sendMessage({ action: "notify_request" });
});
