export async function fetchEmailsForSummary(accessToken) {
    const baseUrl = "https://gmail.googleapis.com/gmail/v1/users/me";
    // Step 1: Get list of message IDs (only the latest 10 for now)
    const listRes = await fetch(`${baseUrl}/messages?q=is:inbox&maxResults=10`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const listData = await listRes.json();
    const messages = listData.messages || [];
    // Step 2: Fetch full metadata for each message
    const detailedEmails = await Promise.all(messages.map(async (msg) => {
        const msgRes = await fetch(`${baseUrl}/messages/${msg.id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const msgData = await msgRes.json();
        return {
            id: msgData.id,
            subject: getHeader(msgData.payload.headers, "Subject"),
            snippet: msgData.snippet,
            internalDate: msgData.internalDate,
        };
    }));
    return detailedEmails;
}
function getHeader(headers, name) {
    const header = headers.find((h) => h.name === name);
    return header ? header.value : "";
}
export async function labelEmailsByKeywords(emails, keywords, accessToken) {
    let count = 0;
    for (const email of emails) {
        const subject = email.subject.toLowerCase();
        const snippet = email.snippet.toLowerCase();
        const matched = keywords.some((kw) => subject.includes(kw.toLowerCase()) || snippet.includes(kw.toLowerCase()));
        if (matched) {
            console.log("📌 Matched Email:", email.subject);
            // TODO: add label, archive, etc.
            count++;
        }
    }
    return count;
}
