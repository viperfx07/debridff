//Click event listener of the context menu
self.on("click",function(node,data){
	var thelink = node.href; //node.textContent is the selected text.
	if(data=="ddl")
		generateBy(thelink);
	else
		self.postMessage({"type" : "send_link_to_subwin","content" : thelink});
	
});