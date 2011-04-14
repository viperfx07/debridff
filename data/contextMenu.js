//Click event listener of the context menu
on("click",function(node,data){
	postMessage("loading"); //show loading icon on widget
	if(isLoginToDebridmax() == 1){ //if logged in
		var thelinks = jQuery.trim(window.getSelection()); //node.textContent is the selected text.
		var host_url = setHost((thelinks.split("\r\n"))[0]); //get the filehosting URL
		generateBy(host_url,thelinks); //generate the links
	}	
	else
	{
		alert("You are not currently logged in to Debridmax. Please login before using the tool.");
		postMessage("finish_loading"); //show the default loading icon on widget
	}
});