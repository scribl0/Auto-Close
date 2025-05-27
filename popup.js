document.addEventListener("DOMContentLoaded", () => {
    /* ───── Grab elements ───── */
    const statusEl  = document.getElementById("status");          // headline
    const toggleBtn = document.getElementsByClassName("btn")[0];  // main toggle
    const notiBtn   = document.getElementsByClassName("notiBtn")[0]; // Notify‑Me
    const card      = document.querySelector(".card");            // wrapper card
  
    /* ───── Self‑healing toast box ───── */
    let msgBox = document.getElementById("customMsg");
    if (!msgBox) {
      msgBox = document.createElement("div");
      msgBox.id = "customMsg";
      msgBox.className = "msg-box hidden";
      msgBox.innerHTML = '<p class="msg-text"></p>';
      card?.appendChild(msgBox);
    }
  
    /* Pretty toast pop‑up */
    const showToast = (text, ms = 3000) => {
      const p = msgBox.querySelector(".msg-text") || msgBox;
      p.textContent = text;
  
      msgBox.classList.remove("hidden");
      void msgBox.offsetWidth;            // restart animation
      msgBox.classList.add("show");
      setTimeout(() => msgBox.classList.remove("show"), ms);
    };
  
    /* ───── Ask background for current status ───── */
    chrome.runtime.sendMessage({ action: "sendStatus" });
  
    /* ───── Button: Toggle ON/OFF ───── */
    toggleBtn.addEventListener("click", () => {
      chrome.runtime.sendMessage({ action: "toggle" });
    });
  
    /* ───── Button: Notify‑Me ───── */
    notiBtn.addEventListener("click", () => {
      chrome.runtime.sendMessage({ action: "toggleNoti" });
  
      /* cute toast + system notification */
      const message = "I’ll ping you when tabs are closed, babe! 💖";
      showToast(message);
  
      if (chrome?.notifications) {
        chrome.notifications.create({
          type:    "basic",
          iconUrl: "icons/icon.png", // adjust path if needed
          title:   "Auto Closer",
          message
        });
      } else {
        alert(message); // fallback when testing outside the extension
      }
    });
  
    /* ───── Listen for updates from background ───── */
    chrome.runtime.onMessage.addListener((msg) => {
      switch (msg.action) {
        case "off":
          statusEl.textContent = "Off";
          statusEl.className   = "status off";
          toggleBtn.classList.remove("active");
          break;
  
        case "on":
          statusEl.textContent = "On";
          statusEl.className   = "status on";
          toggleBtn.classList.add("active");
          break;
  
        case "notiOff":
          notiBtn.id = "notiOff";  // for your CSS/logic
          break;
  
        case "notiOn":
          notiBtn.id = "notiOn";
          break;
  
        /* Optional: show toast text sent from background
        case "toast":
          if (msg.text) showToast(msg.text);
          break;
        */
      }
    });
  });
  