//Event for debridff-generate button
$("#debridff-generate").click(function(){
	$("img#debridff-sw-loader").show();
	if(isLoginToDebridmax() == 1)
	{
		links = jQuery.trim($("#debridff-link").val());
		host_url = setHost((links.split("\n"))[0]);
		if(host_url == MD_DM)
		{
			if($("#debridff-mu_pass").val() != "")
				links = links + "&" + $("#debridff-mu_pass").val();
			else
				links = links + "&" + "";
		}
		generateBy(host_url,links);
	}
	else
	{
		alert("background_notloggedin");
		$("img#debridff-sw-loader").hide();
	}
});

$(document).ready(function(){
	$("img#debridff-sw-loader").hide();
});