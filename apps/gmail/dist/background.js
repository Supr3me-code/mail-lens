import { getAccessToken } from "./gmail-oauth.js";
import { fetchEmailsForSummary, labelEmailsByKeywords } from "./gmail-api.js";
// Listen for messages from content-script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "scan_inbox") {
        console.log("Received scan_inbox message with keywords:", message.keywords);
        handleScanInbox(message.keywords ?? [])
            .then((result) => {
            sendResponse(result);
            console.log("Scan inbox result:", result);
        })
            .catch((error) => {
            console.error("Error scanning inbox:", error);
            sendResponse({ success: false, error: error.message });
        });
        return true; // Keep message channel open for async
    }
});
// Main logic to handle inbox scan
async function handleScanInbox(keywords) {
    const accessToken = await getAccessToken();
    if (!accessToken) {
        throw new Error("Could not retrieve access token.");
    }
    const emails = await fetchEmailsForSummary(accessToken); // Gmail API
    const labeledCount = await labelEmailsByKeywords(emails, keywords, 
    // add label name also
    accessToken);
    return {
        success: true,
        labeledCount,
        scanned: emails.length,
        matchedKeywords: keywords,
    };
}
