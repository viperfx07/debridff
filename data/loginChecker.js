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

//login to debridmax using username/password saved in option page
function loginWithSavedDetails(username,password,callback)
{
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		var login_details = {'user':''};
		var isLoginOK=false;
	  if (xhr.readyState == 4) {
		if (xhr.status == 200) {
			var data = xhr.responseText;
			var data_DOM = HTMLParser(xhr.responseText);
			if(data_DOM.querySelector("div.msg_log")){ //hasn't been tested yet
				alert("Saved login details are wrong");
				login_details.user="Note: You are not currently logged in to Debridmax. Please login before using the tool." + '(<a href="#" id="login">Login</a>)';
			}
			else {
				isLoginOK=true;
				login_details.user = data_DOM.querySelector("h3").innerHTML;
			}
			
		} else {
			login_details.user="Note: You are not currently logged in to Debridmax. Please login before using the tool." + '(<a href="#" id="login">Login</a>)';
		}
		console.log("isLoginOK: " +isLoginOK + "username: " + login_details.user);
		callback(isLoginOK,login_details);
	  }
	}
	
	var postdata = "usr_email=" + username + "&pwd=" + password + "&remember=1&doLogin=Login";
	xhr.open("POST", "http://www.debridmax.com/login.php", false);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send(postdata);
}