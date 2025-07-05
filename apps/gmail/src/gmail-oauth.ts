export const getAccessToken = async (): Promise<string | null> => {
  return new Promise((resolve) => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError) {
        console.error("Auth error:", chrome.runtime.lastError);
        resolve(null);
      } else {
        resolve(token || null);
      }
    });
  });
};

export const isAuthorized = async (): Promise<boolean> => {
  const token = await getAccessToken();
  return !!token;
};
