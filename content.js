// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'toggleTheme':
      window.themeManager.toggle();
      break;
    
    case 'analyzeCode':
      window.codeAnalyzer.analyzeCurrent().then(result => {
        sendResponse(result);
      });
      return true; // Keep connection open for async response
  }
});