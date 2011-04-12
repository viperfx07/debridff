on("click",function(node,data){
	postMessage("loading");
	if(isLoginToDebridmax() == 1){
		var thelinks = node.textContent;
		var host_url = setHost((thelinks.split("\n"))[0]);
		generateBy(host_url,thelinks);
	}	
	else
	{
		alert("You are not currently logged in to Debridmax. Please login before using the tool.");
		postMessage("finish_loading");
	}
});