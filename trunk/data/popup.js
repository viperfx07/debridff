//First thing to do
var login_details = {'DM' : {'user':'','limit':'','quota':''}};
	
function init() {
	//BEGIN Preparing to set status
		
	$.ajaxSetup ({ cache: false	});
	var dmStatus = isLoginToDebridmax();
	//END Preparing to set status
	
	return dmStatus;
}

//Check DebridMax Login status
function isLoginToDebridmax() {
	var ajax_url = "http://www.debridmax.com/" + "rapidshare";
	
	$.ajax({
  	type:"GET",
	url: ajax_url,
	async: false,
	timeout: 30000,
	success:function(data, request, status){
		isLoginOK = 0;
		index=0;
		
		if(data.indexOf("Souvenir")>=0) // Not Logged in
		{
			isLoginOK=0;
			login_details.DM.user="background_notloggedin" + '<(<a href="' + "http://www.debridmax.com/" + "login.php" + '")>'+"background_login_link"+'</a>).';
		}
		else //Logged in
		{
			isLoginOK=1;
			
			var username = $("h3",data).html();
			
			var rsdm_details = [];
			$("div.entry>p",data).each(function(i){
				rsdm_details[index]=$(this).text();
				index++;
			});
			
			var limit = (rsdm_details[0].split(" "))[4];
			var quota = (parseFloat((rsdm_details[1].split(" "))[0])/1000000).toFixed(3);
			
			login_details.DM.user = username;
			login_details.DM.limit = "<b>"+"background_RS_limit" +"</b> " + limit + " " + "background_files";
			login_details.DM.quota = "<b>"+"background_RS_credits" +"</b> " + quota + " GB" ;
			$(".loader").hide();
		} 
	},
	error:function(data){
			isLoginOK=0;
			login_details.DM.user="background_notloggedin" + '<(<a href="' + "http://www.debridmax.com/" + "login.php" + '")>'+"background_login_link"+'</a>).';
	}
	});
	
	return isLoginOK;
}


var myWindow;
	
function openSubWindow() {
			var width = 435;
			var height = 400;
			var left = parseInt((screen.availWidth/2) - (width/2));
			var top = parseInt((screen.availHeight/2) - (height/2));
			var windowFeatures = "width=" + width + ",height=" + height + ",status,resizable,left=" + left + ",top=" + top + "screenX=" + left + ",screenY=" + top;
			myWindow = window.open("submissionWindow.html", "subWind", windowFeatures);
			myWindow.focus();
			postMessage('hidePanel');
}


//Set login, credit, and server load html;
function setDetails()
{
	$("#dm_details").html(login_details.DM.user +"<br/>"+ login_details.DM.limit +"<br/>"+ login_details.DM.quota);
	
}

$(document).ready(function(){
   
	$.ajaxSetup ({  
			cache: false
			});
			
	//Initiate refresh button for login/server details
	if(!init())
		$("#subWindow").hide();
	else
		$("#subWindow").show();
	
	//Write login, credit, and server load;
	setDetails();
	
	//Add root server url prior to the img src 
	$("img").each(function(){
		$(this).attr({src:DM_ROOT + $(this).attr('src')});
	});
	
	$("#subWindow").text("popup_downloader_text");
	$("#subWindow").click(openSubWindow);
});

