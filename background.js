const browser = typeof window !== 'undefined' ? window.browser || window.chrome : self.browser || self.chrome;
browser.runtime.onInstalled.addListener(() => {
    browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (tab.url && tab.url.includes('instagram.com')) {
            browser.scripting.executeScript({
                target: { tabId: tabId },
                files: ['content.js']
            });
        }
    });
});
