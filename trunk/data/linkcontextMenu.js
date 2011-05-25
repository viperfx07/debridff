//Click event listener of the context menu
on("click",function(node,data){
	var thelink = node.href; //node.textContent is the selected text.
	if(data=="ddl")
		generateBy(thelink);
	else
		postMessage({"type" : "send_link_to_subwin","content" : thelink});
	
});