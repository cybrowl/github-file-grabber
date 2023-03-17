// content.js
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log("content");
  if (request.action === "fetchUrl") {
    try {
      const response = await fetch(request.url);
      const text = await response.text();
      sendResponse({ success: true, text });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  }
  return true; // Required for async sendResponse
});
