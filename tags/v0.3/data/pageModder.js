onMessage = function onMessage(msg){
	console.log("onMsg: " + msg.type + msg.username + msg.password + msg.links);
	switch(msg.type)
	{
		case 'generateLink':
			generateBy({'username':msg.username,'password':msg.password},msg.links);
			break;
		default:
			return;
	}
}

//Add Download All and Download Selected buttons before td.code, pre, and blockquote element
var ewb = document.querySelectorAll("td.code, pre, blockquote"); //ewb = element with buttons
for(var i = 0; i< ewb.length; i++)
{
	if(filterTheLink(ewb[i].innerHTML)>=0)
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
	
		var insertedElement = ewb[i].parentNode.insertBefore(downSelected,ewb[i]);
		insertedElement.parentNode.insertBefore(downAll,insertedElement);
	}
}

function dsFunction(){
	var selectedText = window.getSelection().toString();
	console.log(encodeURIComponent(selectedText));
	if(selectedText == "")
		alert("Select the link first");
	else
	{
		var thehost = setHost(selectedText); //get the filehosting URL 
		postMessage({'type':'generate','links' : selectedText}); //it was generateBy(thehost,selectedText);
	}
}

function daFunction()
{
	var unparsedlinks = this.nextSibling.nextSibling.textContent;//get the text next to the button
	var parsedlinks = unparsedlinks.split("\n\n");
	var thelinks = ((parsedlinks.join("\n")).toString()).trim();
	postMessage({'type':'generate','links' : thelinks}); //it was using generateBy
}