onMessage = function onMessage(msg){
	console.log(msg.type);
	if(msg.type=='cached_links')
	{
		$("#debridff-link").val(msg.content);
		countLinks();
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
	generateBy(host_url,links);
	postMessage("clearLinkCache");
});

$(document).ready(function(){
	$("#debridff-link").keyup(countLinks);
	$("#debridff-link").focus(countLinks);
	
	countLinks();
	
	$("img#debridff-sw-loader").hide(); //hide loader
	$("a#donatelink").click(function(){ postMessage("open_donate");});
	$("a#logolink").click(function(){ postMessage("open_debrid");});
});