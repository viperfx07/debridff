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
		$(".loader").hide();
	},
	error:function(data){
			isLoginOK=0;
			login_details.DM.user="Note: You are not currently logged in to Debridmax. Please login before using the tool." + '(<a href="#" id="login">Login</a>)';
	}
	});
	
	return isLoginOK;
}

function openSubWindow() {
	postMessage('openSubWindow');
	postMessage('hidePanel');
}



$(document).ready(function(){
   
	$.ajaxSetup ({  
			cache: false
			});
	
	$("#subWindowButton").hide();		
	
	//If logged in, show the "Open downloader link/button"
	if(isLoginToDebridmax()==1)
		$("#subWindowButton").show();
	
	//Write login, credit, and server load;
	$("#dm_details").html(login_details.DM.user +"<br/>"+ login_details.DM.limit +"<br/>"+ login_details.DM.quota);
	
	//Add root server url prior to the img src 
	$("img").each(function(){
		$(this).attr({src:DM_ROOT + $(this).attr('src')});
	});
	
	$("#subWindowButton").click(openSubWindow);
	
	$("#login").click(function(){
		postMessage('openLoginTab');
		postMessage('hidePanel');
	});
	
});

