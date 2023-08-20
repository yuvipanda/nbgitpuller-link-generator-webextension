chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log(tab.url);
    if (tab.url.startsWith("https://github.com/")) {
        chrome.action.setIcon({ tabId, path: "icon_32.png" });
        chrome.action.setPopup({ tabId, popup: "popup.html" });
    } else {
        chrome.action.setIcon({ tabId, path: "icon_32_disabled.png" });
        chrome.action.setPopup({ tabId, popup: "popup_disabled.html" });
    };
});