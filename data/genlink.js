onMessage = function onMessage(msg)
{
	//Temporary variables
	let links="";
	let anchorlinks="";
	let startIndex = 0;
	let endIndex;
	
	//From message
	let totallinks = msg.index;
	let linksarray = msg.linksarray;
	let textInLink = msg.textInLink;
	let theURL = msg.theURL;
	
	endIndex = startIndex + totallinks - 1
			
	for(i=startIndex;i<=endIndex;i++)
	{
		links+=linksarray[i]+"\r\n";
		anchorlinks += "Link " + (i+1) + ': <a href='+linksarray[i]+'>'+textInLink[i]+'</a><br/>';
	}
	
	document.getElementById('links').value += links;
	$("#anchorlinks").append(anchorlinks);
	$("#loader").hide();
	$("#links").attr('rows',totallinks*2)
}

$(document).ready(function(){
	postMessage("ready");
	$("#loader").show();
});