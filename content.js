// Debounce function for performance optimization
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Function to create and inject the search bar
function injectSearchBar() {
  const searchContainer = document.createElement('div');
  searchContainer.className = 'playlist-search-element';

  const searchBar = document.createElement('input');
  searchBar.type = 'text';
  searchBar.id = 'playlist-search-bar';
  searchBar.className = 'playlist-search-bar';
  searchBar.placeholder = 'Search in playlist';

  const clearButton = document.createElement('button');
  clearButton.textContent = '✕';
  clearButton.className = 'playlist-clear-button';
  clearButton.addEventListener('click', () => {
    searchBar.value = '';
    filterPlaylist();
  });

  searchContainer.appendChild(searchBar);
  searchContainer.appendChild(clearButton);
  document.body.appendChild(searchContainer);

  searchBar.addEventListener('input', debounce(filterPlaylist, 300));
}

// Function to filter the playlist
function filterPlaylist() {
  try {
    const searchTerm = document.getElementById('playlist-search-bar').value.toLowerCase().replace(/\s+/g, '');
    const playlistItems = document.querySelectorAll('ytd-playlist-video-renderer');

    playlistItems.forEach(item => {
      try {
        const title = item.querySelector('#video-title').textContent.toLowerCase().replace(/\s+/g, '');
        const channelName = item.querySelector('#channel-name yt-formatted-string').textContent.toLowerCase().replace(/\s+/g, '');
        
        const matchesSearch = title.includes(searchTerm) || channelName.includes(searchTerm);
        item.style.display = matchesSearch ? '' : 'none';
      } catch (error) {
        console.error('Error processing playlist item:', error);
      }
    });
  } catch (error) {
    console.error('Error filtering playlist:', error);
  }
}

// Function to check if we're on a playlist page
function isPlaylistPage() {
  return window.location.href.includes('youtube.com/playlist?list=');
}

// Function to observe playlist changes for dynamic content loading
function observePlaylistChanges() {
  const playlistContainer = document.querySelector('ytd-playlist-video-list-renderer');
  if (!playlistContainer) return;

  const observer = new MutationObserver(() => {
    filterPlaylist();
  });

  observer.observe(playlistContainer, { childList: true, subtree: true });
}

// Function to handle URL changes (client-side routing)
function listenForPageChanges() {
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      onUrlChange();
    }
  }).observe(document, {subtree: true, childList: true});
}

function onUrlChange() {
  if (isPlaylistPage()) {
    if (!document.getElementById('playlist-search-bar')) {
      injectSearchBar();
    }
    observePlaylistChanges();
  } else {
    const searchContainer = document.querySelector('.playlist-search-element');
    if (searchContainer) searchContainer.remove();
  }
}

// Main function to run when the script loads
function init() {
  if (isPlaylistPage()) {
    injectSearchBar();
    observePlaylistChanges();
  }
  listenForPageChanges();
}

// Run the init function when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}