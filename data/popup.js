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
				
	var notloggedinMsg = "Note: You are not currently logged in to Debridmax. Please login before using the tool." + '(<a href="#" id="login">Login</a>)';
	if(login_details.user=="" || login_details.user==notloggedinMsg)
	{
		login_details.user= notloggedinMsg;
		$("#subWindowButton").hide();
	}
	else
		$("#subWindowButton").show();
			
	/*
	var href = "http://www.google.com/";
	var text = "Google";
	$("body").append(
		$("<div>", { class: "foo" })
			.append($("<a>", { href: href, text: text })
				.click(function (event) { alert(event.target.href) }))
        .append($("<span>").text("Foo")));
	
	*/
	
	
	//Write login, credit, and server load;
	$("#dm_details").text(login_details.user);
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
		myWindow = window.open("resource://jid0-HE5HvmWWBQaDXgq7A7fBAL0UUCs-at-jetpack-debridff-data/submissionWindow.html", "subWind", windowFeatures);
		myWindow.focus();
	}
	else
	{
		console.log("trying to open genwin");
		var genWindow = window.open("resource://jid0-HE5HvmWWBQaDXgq7A7fBAL0UUCs-at-jetpack-debridff-data/generated_link.html", "genWind", windowFeatures);
		//genWindow.focus();
	}
	self.postMessage('hidePanel');
}