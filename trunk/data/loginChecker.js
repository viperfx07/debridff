var login_details = {'user':''};
self.port.on("parseLoginDetails",function(data){
	console.log("parseLoginDetails");
	login_details.user = data.msg;
	setPopupPage(data.isLoggedIn,login_details);	
});
