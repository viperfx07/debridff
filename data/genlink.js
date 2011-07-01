//links to be copied to clipboard
var links="";

//Event listener to get the generated links.
self.on('message',function(msg){
	var href; //temporary variable for href from linksarray
	var inner; //temporary variable for text content from linksarray
		
	//Temporary variables
	var anchorlinks="";
	var startIndex = 0;
		
	//From message
	var linksarray = msg.linksarray;
			
	var endIndex = startIndex + linksarray.length - 1
	
	for(i=startIndex;i<=endIndex;i++)
	{
		href = $("a[href]:first",linksarray[i]).attr('href');
		inner = $("a[href]:first",linksarray[i]).html()
		
		if(i==endIndex)
			links+=linksarray[i];
		else
			links+=linksarray[i]+"\r\n";
			anchorlinks += "Link " + (i+1) + ': <a href='+href+'>'+inner+'</a><br/>';
	}
	
	$("#anchorlinks").append(anchorlinks);
	$("#loader").hide();
	self.postMessage({'type':"clearLinksStorage"});
});

$(document).ready(function(){
	
	self.postMessage({'type':'ready'}); //ready to get the generated links.
		
	$("#copy").click(function(){ //copy to clipboard
		self.postMessage({'type':'copy', 'content':links});
		alert("Link(s) copied");
	});
});