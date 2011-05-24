//Generate premium download links
//theURL: the filehost url string
//linksControlValue: the filesharing links

//Link generator
function generateBy(loginDetails,linksControlValue) {

	postMessage({'type':'loading'});
	isLoginToDebridmax(function(isLoggedIn,login_details){
		if(!isLoggedIn){ //if not logged in
			console.log("notLoggedIn generateBy");
			if(loginDetails.username && loginDetails.password)
			{
				loginWithSavedDetails(loginDetails.username,loginDetails.password,function(isLoggedIn,login_details){	
					linkGenerator(linksControlValue,isLoggedIn);
				});
			}
			else
				linkGenerator(linksControlValue,isLoggedIn);
		}
		else
			linkGenerator(linksControlValue,isLoggedIn);
	});
	
	/*
	//The correct codes but it's not perfect
	if(hasSavedDetails){
		console.log("with loginWith " + savedUsername);
		loginWithSavedDetails(savedUsername,savedPassword,function(isLoggedIn,login_details){
			linkGenerator(linksControlValue,isLoggedIn);
		});
	}
	else{
		console.log("with isLogin");
		isLoginToDebridmax(function(isLoggedIn,login_details){
			linkGenerator(linksControlValue,isLoggedIn);
		});
	}
	*/
}

function linkGenerator(linksControlValue,isLoggedIn)
{
	if(isLoggedIn)
	{
		console.log("logged in");
		linksControlValue = (linksControlValue.toString()).trim();
		var postdata;
		var value = linksControlValue.split("&");
		var the_links = (value[0].indexOf("\r")) ? value[0].split("\r\n") : value[0].split("\n");
		var totallinks=0;
		var index=0;
		
		for(var i=0; i<the_links.length; i++){
			console.log("loop link: " + the_links[i]);
			postdata = "hotlink="+encodeURIComponent(the_links[i])+"&pass="+encodeURIComponent(value[1])+"&t=2e";
						
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					console.log("200");			
					var data= xhr.responseText;
					var links_DOM = (HTMLParser(data)).querySelectorAll("a[href]");
										
					if(data.indexOf("<b>Lien mort</b>")<0)
						postMessage({'type':"saveResult", "link":links_DOM[0].getAttribute("href"), "text":links_DOM[0].innerHTML});
				} 
				else {
					alert("DebridMax: Timeout. " + "\nPossible reasons: \n1. The link and/or password is invalid.\n2. The service is down.\n3. The premium accounts are out of order.");
				}
			  }
			}
			
			xhr.open("POST", MD_DM + "p.php", false);
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
			xhr.send(postdata);
		}
		
		postMessage({'type': "finish_loading"});
		openGenWindow(generatedLinkWin);
	}
	else
	{
		alert("You are not currently logged in to Debridmax. Please login before using the tool.");
		postMessage({'type':"finish_loading"});
	}
}


//Open the Submission Window
function openGenWindow(url) {
	var width = 435;
	var height = 400;
	var left = parseInt((screen.availWidth/2) - (width/2));
	var top = parseInt((screen.availHeight/2) - (height/2));
	var windowFeatures = "width=" + width + ",height=" + height + ",status,resizable,left=" + left + ",top=" + top + "screenX=" + left + ",screenY=" + top;
	myWindow = window.open(url, "genWind", windowFeatures);
}