//Click event listener of the context menu
on("click",function(node,data){
	var thelinks = ((window.getSelection()).toString()).trim(); //node.textContent is the selected text.
	if(data=="ddl")
		generateBy(setHost((thelinks.split("\r\n"))[0]),thelinks); //generate the links
	else{
		var message = {'type' : '', 'content' : ''};
		message.type='send_link_to_subwin';
		message.content=thelinks;
		postMessage(JSON.stringify(message));
	}	
});