"use strict";
(() => {
    const waitForGmail = setInterval(() => {
        const inbox = document.querySelector('div[role="main"]');
        if (inbox) {
            clearInterval(waitForGmail);
            injectMailLensUI();
        }
    }, 1000);
    const injectMailLensUI = () => {
        const container = document.createElement("div");
        container.id = "maillens-ui";
        container.style.position = "fixed";
        container.style.top = "80px";
        container.style.right = "20px";
        container.style.zIndex = "9999";
        container.style.padding = "12px 18px";
        container.style.background = "#fff";
        container.style.border = "1px solid #ccc";
        container.style.borderRadius = "8px";
        container.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
        container.style.fontFamily = "Arial, sans-serif";
        container.innerHTML = `
        <strong>MailLens</strong><br/>
        <input type="text" id="maillens-keywords" placeholder="Enter keywords" style="margin-top:8px;width:100%;padding:4px"/>
        <button id="maillens-scan" style="margin-top:8px;">Scan Inbox</button>
      `;
        document.body.appendChild(container);
        document.getElementById("maillens-scan")?.addEventListener("click", () => {
            const rawKeywords = document.getElementById("maillens-keywords")
                ?.value || "";
            const keywords = rawKeywords
                .split(",")
                .map((k) => k.trim())
                .filter((k) => k.length > 0);
            console.log("📤 Sending scan_inbox request with:", keywords);
            chrome.runtime.sendMessage({ action: "scan_inbox", keywords }, (response) => {
                console.log("📥 Got response from background:", response);
                if (chrome.runtime.lastError) {
                    alert("❌ Extension error: " + chrome.runtime.lastError.message);
                    return;
                }
                if (response?.success) {
                    alert(`✅ Scan complete!\nScanned: ${response.scanned} emails\nMatched: ${response.labeledCount}`);
                }
                else {
                    alert("❌ Error: " + (response?.error || "Unknown error"));
                }
            });
        });
    };
})();
