export async function fetchEmailsForSummary(accessToken: string) {
  const baseUrl = "https://gmail.googleapis.com/gmail/v1/users/me";

  const listRes = await fetch(
    `${baseUrl}/messages?q=category:primary in:inbox&maxResults=500`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const listData = await listRes.json();
  const messages = listData.messages || [];

  const detailedEmails = await Promise.all(
    messages.map(async (msg: { id: string }) => {
      const msgRes = await fetch(`${baseUrl}/messages/${msg.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const msgData = await msgRes.json();

      return {
        id: msgData.id,
        subject: getHeader(msgData.payload?.headers, "Subject"),
        from: getHeader(msgData.payload?.headers, "From"),
        snippet: msgData.snippet,
        internalDate: msgData.internalDate,
      };
    })
  );

  return detailedEmails;
}

function getHeader(headers: any[], name: string): string {
  const header = headers?.find((h) => h.name === name);
  return header ? header.value : "";
}

async function getOrCreateMailLensLabel(
  accessToken: string,
  labelName: string
): Promise<string> {
  const baseUrl = "https://gmail.googleapis.com/gmail/v1/users/me";

  const res = await fetch(`${baseUrl}/labels`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();
  const existing = data.labels.find((label: any) => label.name === labelName);

  if (existing) return existing.id;

  const createRes = await fetch(`${baseUrl}/labels`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: labelName,
      labelListVisibility: "labelShow",
      messageListVisibility: "show",
    }),
  });

  const newLabel = await createRes.json();
  return newLabel.id;
}

export async function labelEmailsByKeywords(
  emails: Array<{ id: string; subject: string; from: string; snippet: string }>,
  subjectKeywords: string[],
  names: string[],
  labelName: string,
  accessToken: string
): Promise<number> {
  let count = 0;
  const baseUrl = "https://gmail.googleapis.com/gmail/v1/users/me";
  const labelId = await getOrCreateMailLensLabel(accessToken, labelName);

  for (const email of emails) {
    const subject = email.subject?.toLowerCase();
    const from = email.from?.toLowerCase() || "";
    const matchedSubject = subjectKeywords.some((kw) =>
      subject.includes(kw?.toLowerCase())
    );
    const matchedFrom = names.some((name) =>
      from.includes(name?.toLowerCase())
    );

    if (matchedSubject || matchedFrom) {
      matchedFrom && console.log("📌 Matched Sender:", email.from);
      matchedSubject && console.log("📌 Matched Email:", email.subject);
      await fetch(`${baseUrl}/messages/${email.id}/modify`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addLabelIds: [labelId],
          removeLabelIds: ["INBOX"],
        }),
      });
      count++;
    }
  }
  return count;
}
