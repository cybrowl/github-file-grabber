// popup.js
document.getElementById("grabFiles").addEventListener("click", () => {
  console.log("click");

  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tab = tabs[0];

    // Use the imported function here
    const fileLinks = await getFileLinksRecursively(tab.url);

    console.log("fileLinks: ", fileLinks);

    document.getElementById("output").textContent = JSON.stringify(
      fileLinks,
      null,
      2
    );
  });
});

async function getFileLinksRecursively(url) {
  if (url.startsWith("https://github.com/")) {
    console.log("working on: ", url);

    const response = await fetch(url).catch((error) => {
      console.error("Error fetching data:", error);
    });

    const text = await response.text().catch((error) => {
      console.error("Error getting text:", error);
    });

    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    const fileLinks = [];
    const dirLinks = []; // Declare dirLinks here
    const repoItems = doc.querySelectorAll(
      ".js-navigation-container .js-navigation-open"
    );

    console.log("repoItems:", repoItems);

    for (const item of repoItems) {
      const linkElement = item.querySelector(".js-navigation-open");
      const fileType = item.querySelector(".js-navigation-item .octicon-file")
        ? null
        : "Directory";
      if (linkElement && fileType === "Directory") {
        const link = linkElement.href;
        dirLinks.push(link);
      }
    }

    for (const item of repoItems) {
      const linkElement = item.querySelector(".js-navigation-open");
      const fileType = item.querySelector(".js-navigation-item .octicon-file")
        ? null
        : "Directory";
      if (linkElement && fileType === "Directory") {
        const link = linkElement.href;
        dirLinks.push(link);
      }
    }

    for (const dirLink of dirLinks) {
      if (!dirLink.startsWith("https://github.com/")) continue;
      const subdirFileLinks = await getFileLinksRecursively(dirLink);
      fileLinks.push(...subdirFileLinks);
    }

    return fileLinks;
  } else {
    console.error("Invalid URL provided:", url);
    return [];
  }
}
