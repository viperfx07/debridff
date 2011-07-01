//Click event listener of the context menu
self.on("click",function(node,data){
	var link = node.href; //node.textContent is the selected text.
	if(data=="ddl")
		self.postMessage({'type': "generateLink", 'link': link, "length": 1, 'index': 0});
	else
		self.postMessage({"type" : "send_link_to_subwin","content" : link});
	
});