var login_details = {'user':''};
self.port.on("parseLoginDetails",function(data){
	console.log("parseLoginDetails");
	if(data.msg)
		login_details.user = data.msg;
	else
	{
		var details = data.htmlstr;
		login_details.user = "Hello, " + details[0];
		login_details.user += "Account type: " + details[1];
		login_details.user += "Points: " + details[2];
		login_details.user += (details.length==4) ? "Premium days: " + details[3]: "";
	}
	setPopupPage(data.isLoggedIn,login_details);	
});
