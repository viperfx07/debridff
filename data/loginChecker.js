//Check DebridMax Login status
function isLoginToDebridmax(callback) {
	
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		var login_details = {'user':'','limit':'','quota':''};
		var isLoginOK=false;
	  if (xhr.readyState == 4) {
		if (xhr.status == 200) {
			var data = xhr.responseText;
			if(data.indexOf("Remember")>=0){
				login_details.user="Note: You are not currently logged in to Debridmax. Please login before using the tool." + '(<a href="#" id="login">Login</a>)';
			}
			else{
				isLoginOK=true;
				var data_DOM = HTMLParser(data);
				
				var username = data_DOM.querySelector("h3").innerHTML;
				var rsdm_details = [];
				
				var rsdm_DOM = data_DOM.querySelectorAll("#blockblockB > p");
				for (var i = 0; i < rsdm_DOM.length; ++i) {
					rsdm_details[i] = rsdm_DOM[i].textContent;
				}
				var limit = (rsdm_details[0].split(" "))[4];
				var quota = (parseFloat((rsdm_details[1].split(" "))[0])/1000000).toFixed(3); //in GBs
				
				login_details.user = username;
				login_details.limit = "<b>"+"RS limit" +"</b> " + limit;
				login_details.quota = "<b>"+"RS credits" +"</b> " + quota + " GB" ;
			}
		} else {
			login_details.user="Note: You are not currently logged in to Debridmax. Please login before using the tool." + '(<a href="#" id="login">Login</a>)';
		}
		callback(isLoginOK,login_details);
	  }
	}
	var timestamp = new Date();
	var times = timestamp.getTime().toString();
	xhr.open("GET", "http://www.debridmax.com/en/rapidshare/?" + times);
	xhr.send("");
}
