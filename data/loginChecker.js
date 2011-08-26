var login_details = {'user':'','acc_type':'','points':'','premium_days':''};
self.port.on("parseLoginDetails",function(data){
	console.log("parseLoginDetails");
	if(data.isLoggedIn)
	{
		var details = data.htmlstr;
		login_details.user = "Hello, " + details[0];
		login_details.acc_type = "Account type: " + details[1];
		login_details.points = "Points: " + (details[2]).replace(/&nbsp;/ig,'');
		login_details.premium_days = (details.length==4) ? "Premium days: " + details[3]: "";
	}
	setPopupPage(data.isLoggedIn,login_details);	
});
