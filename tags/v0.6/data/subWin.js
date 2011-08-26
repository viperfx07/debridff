self.on('message',function(msg){
	console.log(msg.type);
	switch(msg.type){
		case 'cached_links': $("#debridff-link").val(msg.content); 	countLinks(); break;
		default: return;
	}
});

function countLinks(){
	var str = $.trim($("#debridff-link").val());
	var total;
	if(str.length == 0)
	{
		total = 0;
		$("#debridff-generate").attr("disabled",true);
	}
	else
	{
		total = str.split("\n").length;
		$("#debridff-generate").attr("disabled",false);
	}
			
	$("#line_counter").text("You've entered " + total + " link(s)");
}

//Event for debridff-generate button
$("#debridff-generate").click(function(){
	var links = ($.trim($("#debridff-link").val())).split("\n");
	var pass = ($("#debridff-pass").val()) ? $("#debridff-pass").val() : " ";
	//generate links
	var len;
	var link;
	for(var i=0, len=links.length; i<len; i++)
	{
		link = links[i];
		console.log(len);
		self.port.emit("generateLink", [link,pass,len,i]);
	}
	self.postMessage({'type':"clearLinkCache"});
	
});

$("#debridff-clearlinks").click(function(){
	$("#debridff-link").val("");
	self.postMessage({'type':"clearLinkCache"});
	countLinks();
});

$(document).ready(function(){
	$("#debridff-link").keyup(countLinks);
	$("#debridff-link").focus(countLinks);
	
	countLinks();
	
	$("a#donatelink").click(function(){ self.postMessage({'type':"open_donate"});});
	$("a#logolink").click(function(){ self.postMessage({'type':"open_debrid"});});
});