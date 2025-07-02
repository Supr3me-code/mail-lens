(function () {
  const waitForGmail = setInterval(() => {
    const inbox = document.querySelector('div[role="main"]');
    if (inbox) {
      clearInterval(waitForGmail);
      injectMailLensUI();
    }
  }, 1000);

  function injectMailLensUI() {
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
        <button id="maillens-scan" style="margin-top:8px;">Scan Inbox</button>
      `;

    document.body.appendChild(container);

    document.getElementById("maillens-scan")?.addEventListener("click", () => {
      chrome.runtime.sendMessage({ action: "scan_inbox" });
    });
  }
})();
