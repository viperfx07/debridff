//First thing to do
var login_details = {'DM' : {'user':'','limit':'','quota':''}};

//Check DebridMax Login status
function isLoginToDebridmax() {
	var ajax_url = "http://www.debridmax.com/en/" + "rapidshare";
	
	$.ajaxSetup ({ cache: false	});
	
	$.ajax({
  	type:"GET",
	url: ajax_url,
	async: false,
	timeout: 30000,
	success:function(data, request, status){
		isLoginOK = 0;
		index=0;
		
		if(data.indexOf("Remember")>=0) // Not Logged in
		{
			isLoginOK=0;
			login_details.DM.user="Note: You are not currently logged in to Debridmax. Please login before using the tool." + '(<a href="#" id="login">Login</a>)';
		}
		else //Logged in
		{
			isLoginOK=1;
			
			var username = $("h3",data).html();
			
			var rsdm_details = [];
			$("#blockblockB > p",data).each(function(i){
				rsdm_details[index]=$(this).text();
				index++;
			});
			
			var limit = (rsdm_details[0].split(" "))[4];
			var quota = (parseFloat((rsdm_details[1].split(" "))[0])/1000000).toFixed(3);
			
			login_details.DM.user = username;
			login_details.DM.limit = "<b>"+"RS limit" +"</b> " + limit;
			login_details.DM.quota = "<b>"+"RS credits" +"</b> " + quota + " GB" ;
		} 
		
	},
	error:function(data){
			isLoginOK=0;
			login_details.DM.user="Note: You are not currently logged in to Debridmax. Please login before using the tool." + '(<a href="#" id="login">Login</a>)';
	}
	});
	$(".loader").hide();
	return isLoginOK;
}