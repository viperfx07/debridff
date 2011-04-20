//Event for debridff-generate button
$("#debridff-generate").click(function(){
	links = jQuery.trim($("#debridff-link").val());
	host_url = setHost((links.split("\n"))[0]);
	if(host_url == MD_DM)
	{
		if($("#debridff-mu_pass").val() != "")
			links = links + "&" + $("#debridff-mu_pass").val();
		else
			links = links + "&" + "";
	}
	 //generate links
	generateBy(host_url,links);
	
});

$(document).ready(function(){
	$("img#debridff-sw-loader").hide(); //hide loader
	$("a#donatelink").click(function(){ postMessage("open_donate");});
	$("a#logolink").click(function(){ postMessage("open_debrid");});
});