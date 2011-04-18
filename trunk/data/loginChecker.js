//Login details json
var login_details = {'DM' : {'user':'','limit':'','quota':''}};

//Check DebridMax Login status
function isLoginToDebridmax() {
	
	var isLoginOK=0;
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function(callback){
		if(xhr.readyState == 4) {
			if(xhr.status == 200){
				var data = xhr.responseText;
				if(data.indexOf("Remember")>=0){
					login_details.DM.user="Note: You are not currently logged in to Debridmax. Please login before using the tool." + '(<a href="#" id="login">Login</a>)';
					alert("a" + isLoginOK);
				}
				else{
					isLoginOK=1;
					var data_DOM = HTMLParser(data);
					
					var username = data_DOM.querySelector("h3").innerHTML;
					var rsdm_details = [];
					
					var rsdm_DOM = data_DOM.querySelectorAll("#blockblockB > p");
					for (var i = 0; i < rsdm_DOM.length; ++i) {
						rsdm_details[i] = rsdm_DOM[i].textContent;
					}
					var limit = (rsdm_details[0].split(" "))[4];
					var quota = (parseFloat((rsdm_details[1].split(" "))[0])/1000000).toFixed(3); //in GBs
					
					login_details.DM.user = username;
					login_details.DM.limit = "<b>"+"RS limit" +"</b> " + limit;
					login_details.DM.quota = "<b>"+"RS credits" +"</b> " + quota + " GB" ;
					alert("b" + isLoginOK);
				}
			}
			else
				login_details.DM.user="Note: You are not currently logged in to Debridmax. Please login before using the tool." + '(<a href="#" id="login">Login</a>)';
		}
	}(login_details,isLoginOK);
	
	xhr.open("GET", "http://www.debridmax.com/en/rapidshare/");
	xhr.send("");
	
 	document.querySelector(".debridff-loader").style.display = "none";
	return isLoginOK;
}