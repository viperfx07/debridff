//Add Download All and Download Selected buttons before td.code, pre, and blockquote element
var ewb = document.querySelectorAll("td.code, pre, blockquote, div.code"); //ewb = element with buttons

for(var i = 0; i< ewb.length; i++){
	if(filterTheLink(ewb[i].innerHTML)>=0){
		var downAll = document.createElement("input");
		downAll.setAttribute("class","downloadAll");
		downAll.setAttribute("type","button");
		downAll.setAttribute("value","Download All");
		downAll.addEventListener("click",daFunction,false);
		
		var downSelected = document.createElement("input");
		downSelected.setAttribute("class","downloadSelected");
		downSelected.setAttribute("type","button");
		downSelected.setAttribute("value","Download Selected");
		downSelected.addEventListener("click",dsFunction,false);
	
		var insertedElement = ewb[i].parentNode.insertBefore(downSelected,ewb[i]);
		insertedElement.parentNode.insertBefore(downAll,insertedElement);
	}
}

function dsFunction(){
	var selectedText = window.getSelection().toString();
	if(selectedText == "")
		alert("Select the link first");
	else{
		var links = (selectedText.indexOf("\r")>=0) ? selectedText.split("\r\n") : selectedText.split("\n");
		var len;
		var link;
		for(var i=0, len=links.length; i<len; i++){
			link = links[i];
			self.port.emit("generateLink", [link,"",len,i]);
		}
	}
}

function daFunction(){
	var unparsedlinks = this.nextSibling.nextSibling.textContent;//get the text next to the button
	var parsedlinks = unparsedlinks.split("\n\n");
	var links = (((parsedlinks.join("\n")).toString()).trim()).split("\n");;
	var len, link;
	for(var i=0, len=links.length; i<len; i++){
		link = links[i];
		self.port.emit("generateLink", [link,"",len,i]);
	}
}