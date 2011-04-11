var links="";

onMessage = function onMessage(msg)
{
	//Temporary variables
	
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
		if(i==endIndex)
			links+=linksarray[i];
		else
			links+=linksarray[i]+"\r\n";
		anchorlinks += "Link " + (i+1) + ': <a href='+linksarray[i]+'>'+textInLink[i]+'</a><br/>';
	}
	
	document.getElementById('links').value += links;
	$("#anchorlinks").append(anchorlinks);
	$("#loader").hide();
	$("#links").attr('rows',totallinks*2)
}

$(document).ready(function(){
	let message = {'type' : '', 'content' : ''};
	message.type='ready';
	message.content='ready';
	postMessage(JSON.stringify(message));
		
	$("#loader").show();
	
	$("#copy").click(function(){
		message.type='copy';
		message.content = links;
		postMessage(JSON.stringify(message));
	});
});