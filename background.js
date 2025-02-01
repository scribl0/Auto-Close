console.log("Created By Scribl, All Rights Reserved --> https://github.com/scribl0/Auto-Close")

//variables
let currentStatus = "off";
let noti = "notiOn"


//funtions
function toggle() {
    if (currentStatus == "off") {
        currentStatus = "on";
        chrome.runtime.sendMessage({ action: "on" });
        if (noti == "notiOn") {
            sendNoti("Toggled On", "Auto close new tabs is on")
        }
    } else {
        currentStatus = "off"
        chrome.runtime.sendMessage({ action: "off" });
        if (noti == "notiOn") {
            sendNoti("Toggled Off", "Auto close new tabs is off")
        }
    }
}

function toggleNoti() {
    if (noti == "notiOff") {
        noti = "notiOn";
        chrome.runtime.sendMessage({ action: "notiOn" });
    } else {
        noti = "notiOff"
        chrome.runtime.sendMessage({ action: "notiOff" });
    }
}

function sendNoti(title, message) {
    chrome.notifications.create(
        `${title}`,
        {
          type: "basic",
          iconUrl: "icons/icon.png",
          title: `${title}`,
          message: `${message}`,
        },
        function () {}
      );
}

//hotkey controller
chrome.commands.onCommand.addListener(async (command) => {
    if (command === "toggleCmd") {
        toggle()
    }
});

//message controller
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action == "toggle") {
        toggle();
    } else if (message.action == "sendStatus") {
        chrome.runtime.sendMessage({ action: currentStatus });
        chrome.runtime.sendMessage({ action: noti });
    } else if (message.action == "toggleNoti") {
        toggleNoti()
    }
});

//tab closer
chrome.tabs.onCreated.addListener(function(tab) {
    if (currentStatus == "on") {
        chrome.tabs.remove(tab.id);
    }
});

//window closer
chrome.windows.onCreated.addListener(function(window) {
    if (currentStatus == "on") {
        chrome.windows.remove(window.id);
    }
});

//persistant worker
async function createOffscreen() {
    await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['BLOBS'],
        justification: 'keep service worker running',
    }).catch(() => {});
}
chrome.runtime.onStartup.addListener(createOffscreen);
self.onmessage = e => {}; // keepAlive
createOffscreen();