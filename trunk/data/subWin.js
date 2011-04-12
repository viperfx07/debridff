//Event for debridff-generate button
$("#debridff-generate").click(function(){
	$("img#debridff-sw-loader").show(); //show loader gif
	if(isLoginToDebridmax() == 1) //if logged in
	{
		links = jQuery.trim($("#debridff-link").val());
		host_url = setHost((links.split("\n"))[0];
		if(host_url == MD_DM)
		{
			if($("#debridff-mu_pass").val() != "")
				links = links + "&" + $("#debridff-mu_pass").val();
			else
				links = links + "&" + "";
		}
		generateBy(host_url,links); //generate links
	}
	else
	{
		alert("You are not currently logged in to Debridmax. Please login before using the tool.");
		$("img#debridff-sw-loader").hide(); //hide loader
	}
});

$(document).ready(function(){
	$("img#debridff-sw-loader").hide(); //hide loader
});