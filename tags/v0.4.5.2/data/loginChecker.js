//Check DebridMax Login status
function isLoginToDebridmax(callback) {
	
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		var login_details = {'user':''};
		var isLoginOK=false;
	  if (xhr.readyState == 4) {
		if (xhr.status == 200) {
			var data = xhr.responseText;
			if(data.indexOf("document.location.href")>=0){ //not logged in
				login_details.user="Note: You are not currently logged in to Debridmax. Please login before using the tool." + '(<a href="#" id="login">Login</a>)';
				console.log("notgood");
			}
			else{
				isLoginOK=true;
				var data_DOM = HTMLParser(data);
				var username = data_DOM.querySelector("h3").innerHTML;
				login_details.user = username;
			}
		} else {
			login_details.user="Note: You are not currently logged in to Debridmax. Please login before using the tool." + '(<a href="#" id="login">Login</a>)';
		}
		callback(isLoginOK,login_details);
	  }
	}
	var timestamp = new Date();
	var times = timestamp.getTime().toString();
	xhr.open("GET", "http://www.debridmax.com/multimax/?" + times, false);
	xhr.send("");
}