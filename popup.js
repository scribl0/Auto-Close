document.addEventListener('DOMContentLoaded', function() {
    let statusIndicator = document.getElementById("status");

    chrome.runtime.sendMessage({ action: "sendStatus" });

    document.getElementsByClassName("btn")[0].addEventListener("click", btn);
    function btn(){
        chrome.runtime.sendMessage({ action: "toggle" });
    }

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action == "off") {
            statusIndicator.innerHTML = "off";
            statusIndicator.className = "off";
        } else if (message.action == "on") {
            statusIndicator.innerHTML = "on";
            statusIndicator.className = "on";
        }
    });
});
