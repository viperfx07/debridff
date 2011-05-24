onMessage = function onMessage(msg){
	console.log(msg.type);
	if(msg.type=='cached_links')
	{
		$("#debridff-link").val(msg.content);
		countLinks();
	}
	else if(msg.type=="generateLink")
	{
		generateBy({'username':msg.username,'password':msg.password},msg.links);
	}
}

function countLinks(){
	var str = $.trim($("#debridff-link").val());
	var total;
	if(str.length == 0)
		total = 0;
	else
		total = str.split("\n").length;
		
	$("#line_counter").html("You've entered " + total + " link(s)");
}

//Event for debridff-generate button
$("#debridff-generate").click(function(){
	links = jQuery.trim($("#debridff-link").val());
	host_url = setHost((links.split("\n"))[0]);
	if(host_url == MD_DM)
	{
		if($("#debridff-pass").val() != "")
			links = links + "&" + $("#debridff-pass").val();
		else
			links = links + "&" + "";
	}
	 //generate links
	console.log("links: "+links);
	postMessage({'type':'generate','links' : links});
	postMessage({'type':"clearLinkCache"});
});

$(document).ready(function(){
	$("#debridff-link").keyup(countLinks);
	$("#debridff-link").focus(countLinks);
	
	countLinks();
	
	$("img#debridff-sw-loader").hide(); //hide loader
	$("a#donatelink").click(function(){ postMessage({'type':"open_donate"});});
	$("a#logolink").click(function(){ postMessage({'type':"open_debrid"});});
});