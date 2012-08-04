self.on('message',function(msg){	
	console.log("popup.js: " + msg.type); 
	
	switch(msg.type){
		default: 
			$(".debridff-loader").show(); //show loader
			$("#dm_details").hide(); //hide details
			$("#subWindowButton").hide(); //hide "Open Downloader" link
			return;
	}
});


//Set login details and other properties for popup.html
function setPopupPage(isLoggedIn,login_details){ 
	if(isLoggedIn){
		$("p#user").text(login_details.user);
		$("p#acc_type").text(login_details.acc_type);
		$("p#points").text(login_details.points);
		if(login_details.premium_days) $("p#premium_days").text(login_details.premium_days);
		$("#subWindowButton").show();
	}
	else{
		$("#subWindowButton").hide();
		$("p#user").html("Note: You are not currently logged in to MultiDebrid. Please login before using the tool." + '(<a href="#" id="login">Login</a>)');
		$("p#acc_type").text('');
		$("p#points").text('');
		$("p#premium_days").text('');
	}
		
	$("#dm_details").show();
	
	//Add root server url prior to the img src (this for "OK" image)
	$("img").each(function(){
		$(this).attr({src:"http://www.multi-debrid.com/" + $(this).attr('src')});
	});
	
	$(".debridff-loader").hide(); //hide loader
	$("a.translate-this-button").hide(); //hide "Translate" button/link
		
	//if subWindowButton is clicked
	$("#subWindowButton").click(function(){ openSubOrGenWindow();});

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
	myWindow = window.open("resource://jid0-HE5HvmWWBQaDXgq7A7fBAL0UUCs-at-jetpack/debridff/data/submissionWindow.html", "subWind", windowFeatures);
	myWindow.focus();
	
	self.postMessage('hidePanel');
}