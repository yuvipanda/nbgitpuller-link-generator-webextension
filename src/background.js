chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url.startsWith("https://github.com/")) {
        chrome.action.setIcon({ tabId, path: "icon_32.png" });
        chrome.action.setPopup({ tabId, popup: "popup.html" });
    } else {
        chrome.action.setIcon({ tabId, path: "icon_32_disabled.png" });
        chrome.action.setPopup({ tabId, popup: "popup_disabled.html" });
    };
});

chrome.runtime.onInstalled.addListener(function (object) {
    let externalUrl = "https://robust-cry-f5f.notion.site/nbgitpuller-extension-cc643bb29b79492aa3e841e7dc18a9b2?pvs=4";

    if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.tabs.create({ url: externalUrl }, function (tab) {

        });
    }
});
