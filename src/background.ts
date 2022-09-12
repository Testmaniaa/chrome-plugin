// This file is ran as a background script (v3 it runs over service worker)
export const requestFilter: chrome.webRequest.RequestFilter = {urls: ['<all_urls>'], types: ['xmlhttprequest'] };
function handleOnCompleted(): void {
  chrome.browserAction.setBadgeBackgroundColor({ color: '#FF2' }, () => {
    chrome.browserAction.setBadgeText({ text: 'req' });
  });
}
chrome.webRequest?.onCompleted.addListener(handleOnCompleted, requestFilter );