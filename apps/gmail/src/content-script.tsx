import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { MailLensPanel } from "./components/MailLensPanel/MailLensPanel";
import { MailLensToggleButton } from "./components/MailLensToggleButton/MailLensToggleButton";

const waitForGmail = setInterval(() => {
  const inbox = document.querySelector('div[role="main"]');

  if (inbox && !document.getElementById("maillens-ui-root")) {
    clearInterval(waitForGmail);
    injectMailLensUI();
  }
}, 1000);

function injectMailLensUI() {
  if (document.getElementById("maillens-ui-root")) return;

  const toolbar = document.querySelector("div[class='G-tF']");
  if (!toolbar) {
    console.warn("❌ MailLens: Toolbar not found.");
    return;
  }

  const toggleContainer = document.createElement("div");
  toggleContainer.id = "maillens-toggle-root";
  toggleContainer.style.marginLeft = "8px";
  toolbar.appendChild(toggleContainer);

  const root = createRoot(toggleContainer);
  root.render(<MailLensUIWrapper />);
}

const MailLensUIWrapper = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <MailLensToggleButton
        onClick={() => setIsVisible(!isVisible)}
        isPanelVisible={isVisible}
      />
      {isVisible && <MailLensPanel />}
    </>
  );
};
