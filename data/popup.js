onMessage= function onMessage(msg){	
	
	if(msg=="openSubWin")
		openSubWindow();
	else
	{
		$(".debridff-loader").show(); //show loader
		$("#dm_details").hide(); //hide details
		$("#subWindowButton").hide(); //hide "Open Downloader" link
		isLoginToDebridmax(function(isLoggedIn,login_details){
			
			var notloggedinMsg = "Note: You are not currently logged in to Debridmax. Please login before using the tool." + '(<a href="#" id="login">Login</a>)';
			if(login_details.user=="" || login_details.user==notloggedinMsg)
				login_details.user= notloggedinMsg;
			else
				$("#subWindowButton").show();
					
			//Write login, credit, and server load;
			$("#dm_details").html(login_details.user);
			$("#dm_details").show();
					
			//Add root server url prior to the img src (this for "OK" image)
			$("img").each(function(){
				$(this).attr({src:DM_ROOT + $(this).attr('src')});
			});
			
			$(".debridff-loader").hide(); //show loader
			//if subWindowButton is cliked
			
			$("#subWindowButton").click(openSubWindow);
		
			//If (Login) link is clicked
			$("#login").click(function(){
				postMessage('openLoginTab');
				postMessage('hidePanel');
			});
		});
	}
	
	
}

//Open the Submission Window
function openSubWindow() {
	var width = 435;
	var height = 400;
	var left = parseInt((screen.availWidth/2) - (width/2));
	var top = parseInt((screen.availHeight/2) - (height/2));
	var windowFeatures = "width=" + width + ",height=" + height + ",status,resizable,left=" + left + ",top=" + top + "screenX=" + left + ",screenY=" + top;
	myWindow = window.open("resource://jid0-he5hvmwwbqadxgq7a7fbal0uucs-debridff-data/submissionWindow.html", "subWind", windowFeatures);
	postMessage('hidePanel');
}