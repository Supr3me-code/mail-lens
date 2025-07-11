import { getAccessToken } from "./gmail-oauth.js";
import { fetchEmailsForSummary, labelEmailsByKeywords } from "./gmail-api.js";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "scan_inbox") {
    console.log(
      "Received scan_inbox message with keywords:",
      message.subjectKeywords,
      message.names
    );

    handleScanInbox(
      message.subjectKeywords ?? [],
      message.names ?? [],
      message.labelName
    )
      .then((result) => {
        sendResponse(result);
        console.log("Scan inbox result:", result);
      })
      .catch((error) => {
        console.error("Error scanning inbox:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }
});

async function handleScanInbox(
  subjectKeywords: string[],
  names: string[],
  labelName: string
) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Could not retrieve access token.");
  }

  const emails = await fetchEmailsForSummary(accessToken);
  const labeledCount = await labelEmailsByKeywords(
    emails,
    subjectKeywords,
    names,
    labelName,
    accessToken
  );

  return {
    success: true,
    labeledCount,
    scanned: emails.length,
    matchedKeywords: subjectKeywords,
    matchedNames: names,
    labelName,
  };
}
