

if (window.chrome && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
        if (message.type === 'LOGOUT') {
            chrome.storage.local.remove('token');
            sendResponse({ success: true });
            }
        else if (message.type === 'AUTH_SUCCESS') {
            const token = message.token;
            chrome.storage.local.set({ token: token });
            sendResponse({ success: true });
            }
        });
        }
else if (window.browser && browser.runtime && browser.runtime.onMessage) {
    browser.runtime.onMessageExternal.addListener((message:any, sender:any, sendResponse:any) => {
        if (message.type === 'LOGOUT') {
            browser.storage.local.remove('token');
            sendResponse({ success: true });
            }
        else if (message.type === 'AUTH_SUCCESS') {
            const token = message.token;
            browser.storage.local.set({ token: token });
            sendResponse({ success: true });
            }
        });
    }