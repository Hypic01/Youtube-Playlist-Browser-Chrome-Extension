document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-input').value;
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: "search", query: query});
    });
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "searchResults") {
      displayResults(message.results);
    }
  });
  
  function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    // Display results here
  }