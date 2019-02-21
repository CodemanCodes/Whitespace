wireUpClickListener();

function wireUpClickListener(){
    if (document.getElementsByClassName('tabnav-tab') !== null){
        var elements = document.getElementsByClassName('tabnav-tab');
        for (var el of elements){
            if (el.href.endsWith("/files")){
                el.onclick = fireEvent;
            }
        }
    }
}


function fireEvent(e){
    e.preventDefault();
    chrome.runtime.sendMessage(null, {url: e.target.href})
}

chrome.runtime.onMessage.addListener(
    function(request, sender){
        if (request.navChanged){
            wireUpClickListener();
        }
});