//Click event listener of the context menu
on("click",function(node,data){
	var thelinks = ((window.getSelection()).toString()).trim(); //node.textContent is the selected text.
	var host_url = setHost((thelinks.split("\r\n"))[0]); //get the filehosting URL
	generateBy(host_url,thelinks); //generate the links
});