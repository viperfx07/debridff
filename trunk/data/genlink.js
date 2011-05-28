var links="";
//Event listener to get the generated links.
onMessage = function onMessage(msg)
{
	//Temporary variables
	var anchorlinks="";
	var startIndex = 0;
		
	//From message
	var linksarray = msg.linksarray;
	var textInLink = msg.textInLink;
		
	var endIndex = startIndex + linksarray.length - 1
	
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
	postMessage({'type':"clearLinksStorage"});
}

$(document).ready(function(){
	
	postMessage({'type':'ready'}); //ready to get the generated links.
		
	$("#loader").show(); //show load.gif
	
	$("#copy").click(function(){ //copy to clipboard
		postMessage({'type':'copy', 'content':links});
		alert("Link(s) copied");
	});
});