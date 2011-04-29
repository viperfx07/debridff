//Generate premium download links
//theURL: the filehost url string
//linksControlValue: the filesharing links

//Check DebridMax Login status
function generateBy(theURL,linksControlValue) {
	postMessage("loading");
	isLoginToDebridmax(function(isLoggedIn,login_details){
		if(isLoggedIn)
		{
			var postdata="";
			linksControlValue = (linksControlValue.toString()).trim();
			
			// DebridMax
			switch(theURL)
			{
				case RS_DM :
					postdata = "rslinks="+encodeURIComponent(linksControlValue);
					break;
				
				case MD_DM :
					var value = linksControlValue.split("&");
					postdata = "hotlink="+encodeURIComponent(value[0])+"&pass="+encodeURIComponent(value[1]);
					break;
				
				case VBB_DM:
					postdata = "link="+encodeURIComponent(linksControlValue);
					break;
				
				default:
					alert("The link is invalid");
					postMessage("finish_loading");
					return;
			}
			
			postdata += "&x=99&y=99"; // random numbers are allowed for x and y.
			
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
			  if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					var totallinks=0;
					var index=0;
					var linksarray = new Array(); //array for links
					var textInLink = new Array(); //array for text in the link i.e. <a>text</a>
					
					var links_DOM = (HTMLParser(xhr.responseText)).querySelectorAll("div.entry > p > a, div#debridmax > a");
					
					for (var i = 0; i < links_DOM.length; ++i) {
						linksarray[i]= links_DOM[i].getAttribute('href');
						textInLink[i]= links_DOM[i].textContent;;
						index++;
					}
					
					if(index>0)
					{
						var objJSON = {
							"linksarray" : linksarray,
							"textInLink" : textInLink,
							"index" : index
						}; //json to be passed to message handler in main.js
						
						var strJSON = JSON.stringify(objJSON);
						
						//generatedLinkWin variable is defined in the contentScript in main.js
						//generatedLinkWin: the URL of generated_link.html
						openGenWindow(generatedLinkWin);
						postMessage(strJSON);
					}
					else
					{
						alert("DebridMax: " + "Error when generate. " + "\nPossible reasons: \n1. The link and/or password is invalid.\n2. The service is down.\n3. The premium accounts are out of order.");
					}
					postMessage("finish_loading");
				} 
				else {
					alert("DebridMax: Timeout. " + "\nPossible reasons: \n1. The link and/or password is invalid.\n2. The service is down.\n3. The premium accounts are out of order.");
				}
			  }
			}
			
			xhr.open("POST", theURL + "index.php", true);
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhr.send(postdata);
		}
		else
		{
			alert("You are not currently logged in to Debridmax. Please login before using the tool.");
			postMessage("finish_loading");
		}
	});
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