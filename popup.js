// popup.js
document.getElementById("grabFiles").addEventListener("click", () => {
  console.log("click");

  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tab = tabs[0];

    // Use the imported function here
    const urlParts = tab.url.split("/");
    const user = urlParts[3];
    const repo = urlParts[4];
    const fileLinks = await getFileLinksFromGitHubAPI(user, repo);

    console.log("fileLinks: ", fileLinks);

    document.getElementById("output").textContent = JSON.stringify(
      fileLinks,
      null,
      2
    );
  });
});

async function getFileLinksFromGitHubAPI(user, repoName) {
  const apiEndpoint = `https://api.github.com/repos/${user}/${repoName}/git/trees/master?recursive=1`;
  const response = await fetch(apiEndpoint);
  const data = await response.json();

  console.log("data: ", data);

  const fileLinks = data.tree
    .filter((node) => node.type === "blob")
    .map((node) =>
      node.url
        .replace("https://api.github.com/repos", "https://github.com")
        .replace("git/blobs", `blob/master/${node.path}`)
        .replace(/\/[a-f0-9]+$/, "")
    );

  return fileLinks;
}
