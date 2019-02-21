var isEnabled;

chrome.storage.local.get(['github_whitespace_isEnabled'], function(result) {
		if (result && typeof result.github_whitespace_isEnabled !== 'undefined') {
			isEnabled = result.github_whitespace_isEnabled;
			chrome.runtime.sendMessage({isEnabled: isEnabled});
		} else {
			setIsEnabled();
		}
});

chrome.runtime.onInstalled.addListener(function() {
	setIsEnabled();
});

chrome.webRequest.onBeforeRequest.addListener(
	function(details) {
   		if (isEnabled) {
   			return {redirectUrl: details.url + "?w=1"};
   		}
	},
  	{
  		urls: [
  			"*://github.com/*/*/pull/*/files",
  			"*://www.github.com/*/*/pull/*/files"
  		],
		types: [
		"main_frame", 
		"sub_frame"
		]
	},
  	["blocking"]
);

chrome.webNavigation.onHistoryStateUpdated.addListener(
	function() {
		chrome.tabs.query({active: true}, function(tabs){
			for (var tab of tabs){
				chrome.tabs.sendMessage(tab.id, {navChanged: true});
			}
		});
	},
	{
		url: [
			{hostSuffix: "github.com" }
		]
	});

/*chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    if (isEnabled && !details.url.endsWith("?w=1")) {
		chrome.history.deleteUrl({url: details.url});
		chrome.tabs.update(details.tabId, {url: details.url + "?w=1", loadReplace: true})
    }
},
{
	url: [
		{hostSuffix: "github.com", pathContains: "/files" }
	]
});*/

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(typeof request.isEnabled !== 'undefined') {
    	isEnabled = request.isEnabled;
    	chrome.storage.local.set({github_whitespace_isEnabled: isEnabled});
    }else if (typeof request.getEnabledStatus !== 'undefined') {
    	return sendResponse({isEnabled: isEnabled});
    }

    sendResponse({received: true});
 });

 chrome.runtime.onMessage.addListener(
	function(request, sender) {
		console.log(request);
		if (isEnabled && request.url.endsWith("/files"))
		{
			chrome.history.deleteUrl({url: request.url});
			chrome.tabs.update(sender.tab.Id, {url: request.url + "?w=1", loadReplace: true})
		}
	}
 )

function setIsEnabled(){
	chrome.storage.local.set({github_whitespace_isEnabled: true}, function() {
    		isEnabled = true;
    		chrome.runtime.sendMessage({isEnabled: isEnabled});
	});
}