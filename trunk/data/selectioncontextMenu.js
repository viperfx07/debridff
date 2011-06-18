//Click event listener of the context menu
self.on("click",function(node,data){
	var thelinks = ((window.getSelection()).toString()).trim(); //node.textContent is the selected text.
	if(data=="ddl")
		generateBy(thelinks);
	else
		self.postMessage({'type' : "send_link_to_subwin", 'content' : thelinks});
		
});