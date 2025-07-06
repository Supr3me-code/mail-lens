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
        <label for="maillens-heading" style="margin-top:8px;">Enter sender's name and/or Subject keyword(s):</label>
        <input type="text" id="maillens-name" placeholder="Sender's name/email" style="margin-top:8px;width:100%;padding:4px"/>
        <input type="text" id="maillens-subject" placeholder="Keyword(s) in Subject" style="margin-top:8px;width:100%;padding:4px"/>
        <input type="text" id="maillens-label" placeholder="Enter label name" style="margin-top:8px;width:100%;padding:4px"/>
        <button id="maillens-scan" style="margin-top:8px;">Scan Inbox</button>
      `;

    document.body.appendChild(container);

    document.getElementById("maillens-scan")?.addEventListener("click", () => {
      const rawNames =
        (document.getElementById("maillens-name") as HTMLInputElement)?.value ||
        "";
      const rawKeywordsFromSubject =
        (document.getElementById("maillens-subject") as HTMLInputElement)
          ?.value || "";
      const labelName = (
        document.getElementById("maillens-label") as HTMLInputElement
      )?.value;
      const subjectKeywords = rawKeywordsFromSubject
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0);
      const names = rawNames
        .split(",")
        .map((n) => n.trim())
        .filter((n) => n.length > 0);

      console.log(
        "📤 Sending scan_inbox request with:",
        subjectKeywords,
        names,
        " and label name:",
        labelName
      );

      chrome.runtime.sendMessage(
        { action: "scan_inbox", subjectKeywords, names, labelName },
        (response) => {
          console.log("📥 Got response from background:", response);

          if (chrome.runtime.lastError) {
            alert("❌ Extension error: " + chrome.runtime.lastError.message);
            return;
          }

          if (response?.success) {
            alert(
              `✅ Scan complete!\nScanned: ${
                response.scanned
              } emails\nMatched: ${response.labeledCount}\nLabel Name: ${
                response.labelName
              }\nSender: ${response?.matchedNames.join(
                ", "
              )}\nSubject Keywords: ${response?.matchedKeywords.join(", ")}`
            );
          } else {
            alert("❌ Error: " + (response?.error || "Unknown error"));
          }
        }
      );
    });
  };
})();
