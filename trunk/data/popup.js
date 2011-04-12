onMessage= function onMessage(msg){	
	init();
}

//Open the Submission Window
function openSubWindow() {
	var width = 435;
	var height = 400;
	var left = parseInt((screen.availWidth/2) - (width/2));
	var top = parseInt((screen.availHeight/2) - (height/2));
	var windowFeatures = "width=" + width + ",height=" + height + ",status,resizable,left=" + left + ",top=" + top + "screenX=" + left + ",screenY=" + top;
	myWindow = window.open("submissionWindow.html", "subWind", windowFeatures);
	postMessage('hidePanel');
}

function init()
{
	$(".debridff-loader").show(); //show loader
	$("#dm_details").hide(); //hide details
	$("#subWindowButton").hide(); //h
	login_details.DM.user = login_details.DM.limit = login_details.DM.quota = "";
	
	//If logged in, show the "Open downloader link/button"
	if(isLoginToDebridmax()==1)
		$("#subWindowButton").show();
	
	//Write login, credit, and server load;
	$("#dm_details").html(login_details.DM.user +"<br/>"+ login_details.DM.limit +"<br/>"+ login_details.DM.quota);
	$("#dm_details").show();
	
	
	//Add root server url prior to the img src (this for "OK" image)
	$("img").each(function(){
		$(this).attr({src:DM_ROOT + $(this).attr('src')});
	});
	
	//if subWindowButton is cliked
	$("#subWindowButton").click(openSubWindow);
	
	//If (Login) link is clicked
	$("#login").click(function(){
		postMessage('openLoginTab');
		postMessage('hidePanel');
	});
}
