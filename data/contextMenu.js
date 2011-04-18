//Click event listener of the context menu
on("click",function(node,data){
	postMessage("loading"); //show loading icon on widget

	var thelinks = ((window.getSelection()).toString()).trim(); //node.textContent is the selected text.
	var host_url = setHost((thelinks.split("\r\n"))[0]); //get the filehosting URL
	generateBy(host_url,thelinks); //generate the links
});