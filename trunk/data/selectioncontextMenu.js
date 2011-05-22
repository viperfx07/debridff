//Click event listener of the context menu
on("click",function(node,data){
	console.log("pwd: " + savedPassword);
	console.log("uname: " + savedUsername);
	console.log("has: " +  hasSavedDetails);
	var thelinks = ((window.getSelection()).toString()).trim(); //node.textContent is the selected text.
	if(data=="ddl")
		generateBy(setHost((thelinks.split("\r\n"))[0]),thelinks); //generate the links
	else
		postMessage({'type' : "send_link_to_subwin", 'content' : thelinks});
		
});