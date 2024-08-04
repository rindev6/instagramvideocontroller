browser.runtime.onInstalled.addListener(() => {
    browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (tab.url.includes('instagram.com')) {
        browser.tabs.executeScript(tabId, { file: 'content.js' });
      }
    });
  });