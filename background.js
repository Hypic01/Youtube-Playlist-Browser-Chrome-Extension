chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "storePlaylistData") {
      chrome.storage.local.set({playlistData: message.data});
    }
  });