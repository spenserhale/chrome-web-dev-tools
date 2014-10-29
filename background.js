// Add icon to URL bar
function checkForValidUrl(tabId, changeInfo, tab) {
    'use strict';
    chrome.pageAction.show(tab.id);
}

// Listen for any changes to the URL of any tab
chrome.tabs.onUpdated.addListener(checkForValidUrl);

// Set the item in the localstorage
function setItem(key, value) {
    'use strict';
    window.localStorage.removeItem(key);
    window.localStorage.setItem(key, value);
}

// Get the item from local storage with the specified key
function getItem(key) {
    'use strict';
    var value;
    try {
        value = window.localStorage.getItem(key);
    } catch (e) {
        value = "null";
    }
    return value;
}

// get IP using webRequest
var currentIPList = {};
chrome.webRequest.onCompleted.addListener(
    function (info) {
        'use strict';
        currentIPList[info.url] = info.ip;
    },
    {
        urls: [],
        types: []
    },
    []
);

// Listeners
chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        'use strict';
        switch (request.name) {

        case "setOptions":
            // request from the content script to set the options.
            //localStorage["serverIP_status"] = serverIP_status;
            localStorage.setItem("serverIP_status", request.status);
            break;

        case "getOptions":
            // request from the content script to get the options.
            sendResponse({
                enableDisableIP: localStorage["serverIP_status"]
            });
            break;

        case "getIP":
            var currentURL = sender.tab.url;
            if (currentIPList[currentURL] !== undefined) {
                sendResponse({
                    domainToIP: currentIPList[currentURL]
                });
            } else {
                sendResponse({
                    domainToIP: null
                });
            }
            break;

        default:
            sendResponse({});
        }
    }
);