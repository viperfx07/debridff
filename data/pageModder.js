//Add Download All and Download Selected buttons before td.code, pre, and blockquote element
var elementsWithButtons = document.querySelectorAll("td.code, pre, blockquote");
for(var i = 0; i < elementsWithButtons.length; ++i)
{
	if(elementsWithButtons[i].innerHTML.indexOf('rapidshare')>=0 ||
		elementsWithButtons[i].innerHTML.indexOf('megaupload')>=0 ||
		elementsWithButtons[i].innerHTML.indexOf('hotfile')>=0 ||
		elementsWithButtons[i].innerHTML.indexOf('uploading')>=0 ||
		elementsWithButtons[i].innerHTML.indexOf('fileserve')>=0 ||
		elementsWithButtons[i].innerHTML.indexOf('filesonic')>=0 ||
		elementsWithButtons[i].innerHTML.indexOf('depositfiles')>=0 ||
		elementsWithButtons[i].innerHTML.indexOf('uploaded')>=0 ||
		elementsWithButtons[i].innerHTML.indexOf('videobb')>=0
	)
	{
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
		
		var insertedElement = elementsWithButtons[i].parentNode.insertBefore(downSelected,elementsWithButtons[i]);
		insertedElement.parentNode.insertBefore(downAll,insertedElement);
	}
}

function dsFunction(){
	var selectedText = window.getSelection().toString();
	if(selectedText == "")
		alert("Select the link first");
	else
	{
		var thehost = setHost(selectedText); //get the filehosting URL 
		generateBy(thehost,selectedText); //generate the links
	}
}

function daFunction()
{
	var unparsedlinks = this.nextSibling.nextSibling.textContent;//get the text next to the button
	var parsedlinks = unparsedlinks.split("\n\n");
	var thelinks = ((parsedlinks.join("\n")).toString()).trim();
	var thehost = setHost(thelinks);
	generateBy(thehost,thelinks);
	
}