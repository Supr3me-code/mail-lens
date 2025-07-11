import { useState } from "react";
import styles from "./MailLensPanel.module.css";

export const MailLensPanel = () => {
  const [names, setNames] = useState("");
  const [subjectKeywords, setSubjectKeywords] = useState("");
  const [labelName, setLabelName] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    const nameList = names
      .split(",")
      .map((n) => n.trim())
      .filter((n) => n);
    const subjectList = subjectKeywords
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);

    const scanButton = document.querySelector(
      "button[type='submit']"
    ) as HTMLButtonElement;
    const namesInput = document.getElementById(
      "namesInput"
    ) as HTMLInputElement;
    const subjectInput = document.getElementById(
      "subjectInput"
    ) as HTMLInputElement;
    const labelInput = document.getElementById(
      "labelInput"
    ) as HTMLInputElement;

    scanButton.disabled = true;
    namesInput.disabled = true;
    subjectInput.disabled = true;
    labelInput.disabled = true;
    setIsScanning(true);
    chrome.runtime.sendMessage(
      {
        action: "scan_inbox",
        subjectKeywords: subjectList,
        names: nameList,
        labelName,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          alert("❌ Extension error: " + chrome.runtime.lastError.message);
          return;
        }

        if (response?.success) {
          scanButton.disabled = false;
          namesInput.disabled = false;
          subjectInput.disabled = false;
          labelInput.disabled = false;
          setNames("");
          setSubjectKeywords("");
          setLabelName("");
          setIsScanning(false);
          alert(
            `✅ Scan complete!\nScanned: ${response.scanned} emails\nMatched: ${
              response.labeledCount
            }\nLabel: ${
              response.labelName
            }\nSenders: ${response.matchedNames.join(
              ", "
            )}\nSubjects: ${response.matchedKeywords.join(", ")}`
          );
        } else {
          scanButton.disabled = false;
          namesInput.disabled = false;
          subjectInput.disabled = false;
          labelInput.disabled = false;
          setNames("");
          setSubjectKeywords("");
          setLabelName("");
          setIsScanning(false);
          alert("❌ Error: " + (response?.error || "Unknown error"));
        }
      }
    );
  };

  return (
    <section className={styles.container} aria-labelledby="maillens-title">
      <h1 id="maillens-title">MailLens</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleScan();
        }}
      >
        <fieldset>
          <legend>Scan your Gmail inbox</legend>

          <div className={styles.formGroup}>
            <label htmlFor="namesInput">Sender's name or email</label>
            <input
              id="namesInput"
              type="text"
              placeholder="e.g. Alice, bob@email.com"
              value={names}
              onChange={(e) => setNames(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="subjectInput">Subject keyword(s)</label>
            <input
              id="subjectInput"
              type="text"
              placeholder="e.g. Invoice, Meeting"
              value={subjectKeywords}
              onChange={(e) => setSubjectKeywords(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="labelInput">Label name</label>
            <input
              id="labelInput"
              type="text"
              placeholder="Label to apply to matching emails"
              value={labelName}
              onChange={(e) => setLabelName(e.target.value)}
            />
          </div>

          <button type="submit">
            {isScanning ? "Scanning..." : "Scan Inbox"}
          </button>
        </fieldset>
      </form>
    </section>
  );
};
