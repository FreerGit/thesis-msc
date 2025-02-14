window.addEventListener("message", (event) => {
    console.log("Received message in content script:", event.data); // Debugging log

    // Check if it's a valid DID auth request
    if (event.source !== window || event.data.type !== "DID_AUTH_REQUEST") {
        return;
    }

    console.log("Detected authentication request from website.");

    // Send a message to the background script
    chrome.runtime.sendMessage({ action: "open_popup" }, (response) => {
        console.log("Response from background:", response);
    });
});
