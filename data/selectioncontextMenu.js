//Click event listener of the context menu
self.on("click",function(node,data){
	console.log(encodeURIComponent(window.getSelection().toString()));
	var selectedText = ((window.getSelection()).toString()).trim(); //node.textContent is the selected text.
	var links = (selectedText.indexOf("\r")>=0) ? selectedText.split("\r\n") : selectedText.split("\n");
	var links = ((encodeURIComponent(selectedText)).indexOf('%20')>=0) ? selectedText.split(" ") : links;
	
	if(data=="ddl"){
		var len, link;
		for(var i=0, len=links.length; i<len; i++){
			link = links[i];
			self.postMessage({'type': "generateLink", 'link': link, "length": len, 'index': i});
		}
	}
	else{
		self.postMessage({'type' : "send_link_to_subwin", 'content' : links.join("\r\n")});
	}
});