var isEnabled;

chrome.runtime.sendMessage({getEnabledStatus: 'getStatus'}, function(response){
	if (typeof response.isEnabled !== 'undefined') {
		isEnabled = response.isEnabled;
		setButtonText();
	}
})

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (typeof request.isEnabled !== 'undefined') {
    	isEnabled = request.isEnabled;
    }

    sendResponse({received: true});
});

function toggle()
{
	isEnabled = !isEnabled;
	chrome.runtime.sendMessage({isEnabled: isEnabled}, function() {
  		setButtonText();
	});
}
document.getElementById('toggleButton').onclick = toggle;

function setButtonText(){
	if (isEnabled){
		document.getElementById('toggleButton').textContent = "Disable";
	} else {
		document.getElementById('toggleButton').textContent = "Enable";
	}
}
