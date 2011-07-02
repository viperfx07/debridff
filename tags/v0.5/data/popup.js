self.on('message',function(msg){	
	console.log("popup.js: " + msg.type); 
	
	switch(msg.type){
		case "openSubWin":
			try{
			if(myWindow)
				{myWindow.close();}
			}
			catch(err){
				console.log("err: "+err);
				break;
			}
			openSubOrGenWindow("subwin");
			break;
		
		case "openGenWin" :
			openSubOrGenWindow("genwin"); break;
			
		case 'noLinkGeneratedAlert' :
			alert("Debridmax: Error. " + "Possible reasons: \n1. You're not logged in.\n2. The link and/or password is invalid.\n3. The service is down.\n4. The premium accounts are out of order. \n5. The server is overloaded.");
			break;
		
		default: 
			$(".debridff-loader").show(); //show loader
			$("#dm_details").hide(); //hide details
			$("#subWindowButton").hide(); //hide "Open Downloader" link
			return;
	}
});

//Set login details and other properties for popup.html
function setPopupPage(isLoggedIn,login_details){ 
				
	var notloggedinMsg = "Note: You are not currently logged in to Debridmax. Please login before using the tool." + '(<a href="#" id="login">Login</a>)';
	if(login_details.user=="" || login_details.user==notloggedinMsg)
	{
		login_details.user= notloggedinMsg;
		$("#subWindowButton").hide();
	}
	else
		$("#subWindowButton").show();
			
	//Write login, credit, and server load;
	$("#dm_details").html(login_details.user);
	$("#dm_details").show();
			
	//Add root server url prior to the img src (this for "OK" image)
	$("img").each(function(){
		$(this).attr({src:"http://www.debridmax.com/" + $(this).attr('src')});
	});
	
	$(".debridff-loader").hide(); //hide loader
	$("a.translate-this-button").hide(); //hide "Translate" button/link
		
	//if subWindowButton is clicked
	$("#subWindowButton").click(function(){ openSubOrGenWindow("subwin");});

	//If (Login) link is clicked
	$("#login").click(function(){
		self.postMessage('openLoginTab');
		self.postMessage('hidePanel');
	});
}

//Open the Submission Window
function openSubOrGenWindow(windowType) {
	var width = 435;
	var height = 400;
	var left = parseInt((screen.availWidth/2) - (width/2));
	var top = parseInt((screen.availHeight/2) - (height/2));
	var windowFeatures = "width=" + width + ",height=" + height + ",status,resizable,left=" + left + ",top=" + top + "screenX=" + left + ",screenY=" + top;
	if(windowType=="subwin"){
		myWindow = window.open("resource://jid0-HE5HvmWWBQaDXgq7A7fBAL0UUCs-debridff-data/submissionWindow.html", "subWind", windowFeatures);
		myWindow.focus();
	}
	else
	{
		var genWindow = window.open("resource://jid0-HE5HvmWWBQaDXgq7A7fBAL0UUCs-debridff-data/generated_link.html", "genWind", windowFeatures);
		genWindow.focus();
	}
	self.postMessage('hidePanel');
}