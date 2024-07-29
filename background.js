let currentStatus = "off";
console.log("Created By Scribl, All Rights Reserved --> https://github.com/scribl0")

function toggle() {
    if (currentStatus == "off") {
        currentStatus = "on";
        chrome.runtime.sendMessage({ action: "on" });
    } else {
        currentStatus = "off"
        chrome.runtime.sendMessage({ action: "off" });
    }
}

chrome.commands.onCommand.addListener(async (command) => {
    if (command === "toggleCmd") {
        toggle()
    }
  });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action == "toggle") {
        toggle();
    } else if (message.action == "sendStatus") {
        chrome.runtime.sendMessage({ action: currentStatus });
    }
});
chrome.tabs.onCreated.addListener(function(tab) {
    if (currentStatus == "on") {
        chrome.tabs.remove(tab.id);
    }
});

chrome.runtime.onStartup.addListener( () => {
    console.log(`onStartup()`);
});
