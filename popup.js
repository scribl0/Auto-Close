document.addEventListener('DOMContentLoaded', function() {
    let statusIndicator = document.getElementById("status");
    let noti = document.getElementsByClassName("notiBtn")[0];

    chrome.runtime.sendMessage({ action: "sendStatus" });

    document.getElementsByClassName("btn")[0].addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "toggle" });
    });

    noti.addEventListener("click", () => {
        chrome.runtime.sendMessage({action: "toggleNoti"})
    });

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action == "off") {
            statusIndicator.innerHTML = "off";
            statusIndicator.className = "off";
        } else if (message.action == "on") {
            statusIndicator.innerHTML = "on";
            statusIndicator.className = "on";
        } else if (message.action == "notiOff") {
            noti.id = "notiOff"
        } else if (message.action == "notiOn") {
            noti.id = "notiOn"
        }
    });
});
