//Generate premium download links
//linksControlValue: the filesharing links
function generateBy(linksControlValue) {

	self.postMessage({'type':'loading'});
	isLoginToDebridmax(function(isLoggedIn,login_details){

		if(isLoggedIn)
		{
			console.log("logged in");
			linksControlValue = (linksControlValue.toString()).trim();
			var postdata;
			var value = linksControlValue.split("&");
			console.log(encodeURIComponent(value[0]));
			
			var the_links = (value[0].indexOf("\r")>=0) ? value[0].split("\r\n") : value[0].split("\n");
			var totallinks=0;
			var index=0;
			var xhr;
			for(var i=0; i<the_links.length; i++){
				
				console.log("loop link: " + the_links[i]);
				postdata = "hotlink="+encodeURIComponent(the_links[i])+"&pass="+encodeURIComponent(value[1])+"&t=2e";
							
				xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						console.log("200");			
						var data= xhr.responseText;
						console.log(data);
						var links_DOM = (HTMLParser(data)).querySelectorAll("a[href]");
											
						if(data.indexOf("<b>Lien")<0 && 
						data.indexOf("<b>Vous")<0 &&
						data.indexOf("<b>Serveur")<0
						) //if valid
							self.postMessage({'type':"saveResult", "link":links_DOM[0].getAttribute("href"), "text":links_DOM[0].innerHTML});
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
		}
		self.postMessage({'type':"finish_loading"});
		
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