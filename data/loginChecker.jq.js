//Login details json
var login_details = {'DM' : {'user':'','limit':'','quota':''}};

//Check DebridMax Login status
function isLoginToDebridmax() {
	var ajax_url = "http://www.debridmax.com/en/" + "rapidshare";
	
	$.ajaxSetup ({ cache: false	});
	
	$.ajax({
  	type:"GET",
	url: ajax_url,
	async: false,
	timeout: 30000, //30 seconds
	success:function(data, request, status){
		isLoginOK = 0;
		index=0;
		
		if(data.indexOf("Remember")>=0) // Not Logged in
		{
			login_details.DM.user="Note: You are not currently logged in to Debridmax. Please login before using the tool." + '(<a href="#" id="login">Login</a>)';
		}
		else //Logged in
		{
			isLoginOK=1;
			
			var username = $("h3",data).html(); //get the username
			
			//BEGIN get the Rapidshare details
			var rsdm_details = [];
			$("#blockblockB > p",data).each(function(i){
				rsdm_details[index]=$(this).text();
				index++;
			});
						
			var limit = (rsdm_details[0].split(" "))[4];
			var quota = (parseFloat((rsdm_details[1].split(" "))[0])/1000000).toFixed(3); //in GBs
			//END get the Rapidshare details
			
			login_details.DM.user = username;
			login_details.DM.limit = "<b>"+"RS limit" +"</b> " + limit;
			login_details.DM.quota = "<b>"+"RS credits" +"</b> " + quota + " GB" ;
		} 
		
	},
	error:function(data){
		login_details.DM.user="Note: You are not currently logged in to Debridmax. Please login before using the tool." + '(<a href="#" id="login">Login</a>)';
	}
	});
	$(".debridff-loader").hide(); 
	return isLoginOK;
}