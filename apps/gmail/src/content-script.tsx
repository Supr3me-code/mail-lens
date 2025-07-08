import React from "react";
import { createRoot } from "react-dom/client";
import { MailLensPanel } from "./components/MailLensPanel/MailLensPanel";

const waitForGmail = setInterval(() => {
  const inbox = document.querySelector('div[role="main"]');
  console.log("here 1");

  if (inbox && !document.getElementById("maillens-ui-root")) {
    clearInterval(waitForGmail);
    injectMailLensUI();
  }
}, 1000);

function injectMailLensUI() {
  console.log("here 2");

  const container = document.createElement("div");
  container.id = "maillens-ui-root";
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(<MailLensPanel />);
}
