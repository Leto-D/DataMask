console.log('GRID Content Script loaded');

const initializeContentScript = () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const textAreas = document.querySelectorAll('textarea, [contenteditable="true"]');
        textAreas.forEach((textarea) => {
          if (!textarea.getAttribute('data-grid-enhanced')) {
            textarea.setAttribute('data-grid-enhanced', 'true');
          }
        });
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeContentScript);
} else {
  initializeContentScript();
}

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'insertPrompt') {
    const activeElement = document.activeElement as HTMLElement;
    
    if (activeElement && (
      activeElement.tagName === 'TEXTAREA' || 
      activeElement.isContentEditable
    )) {
      if (activeElement.tagName === 'TEXTAREA') {
        (activeElement as HTMLTextAreaElement).value = request.prompt;
        activeElement.dispatchEvent(new Event('input', { bubbles: true }));
      } else {
        activeElement.textContent = request.prompt;
        activeElement.dispatchEvent(new Event('input', { bubbles: true }));
      }
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, error: 'No active text input found' });
    }
  }
  
  return true;
});