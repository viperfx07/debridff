//Click event listener of the context menu
on("click",function(node,data){
	var thelink = node.href; //node.textContent is the selected text.
	if(data=="ddl")
		generateBy(setHost(thelink),thelink); //generate the links
	else{
			
		var message = {
			"type" : "send_link_to_subwin",
			"content" : thelink
		};
		console.log("thelink: " + thelink);
		postMessage(JSON.stringify(message));
	}
});