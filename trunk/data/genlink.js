var links="";

//Event listener to get the generated links.
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
		
	endIndex = startIndex + totallinks - 1
			
	for(i=startIndex;i<=endIndex;i++)
	{
		if(i==endIndex)
			links+=linksarray[i];
		else
			links+=linksarray[i]+"\r\n";
		anchorlinks += "Link " + (i+1) + ': <a href='+linksarray[i]+'>'+textInLink[i]+'</a><br/>';
	}
	
	$("#anchorlinks").append(anchorlinks);
	$("#loader").hide();
}

$(document).ready(function(){
	let message = {'type' : '', 'content' : ''};
	message.type='ready';
	message.content='ready';
	postMessage(JSON.stringify(message)); //ready to get the generated links.
		
	$("#loader").show(); //show load.gif
	
	$("#copy").click(function(){ //copy to clipboard
		message.type='copy';
		message.content = links;
		postMessage(JSON.stringify(message));
		alert("Link(s) copied");
	});
});