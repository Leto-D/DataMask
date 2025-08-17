chrome.runtime.onInstalled.addListener(() => {
  console.log('GRID Extension installed');
});

chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked on tab:', tab.id);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received in service worker:', request);
  
  if (request.action === 'getTabInfo') {
    sendResponse({
      tabId: sender.tab?.id,
      url: sender.tab?.url,
      title: sender.tab?.title
    });
  }
  
  return true;
});