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
    let externalUrl = "https://docs.google.com/document/d/e/2PACX-1vTGWZQmI-GhKJ2GP0c4wAGhVf5bMPDdbXzNJnYGOYKbxjCNSRxtAEvvmlHafs6oln44MFCH8aW_6uIC/pub";

    if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.tabs.create({ url: externalUrl }, function (tab) {

        });
    }
});
