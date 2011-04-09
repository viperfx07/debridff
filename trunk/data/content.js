//DebridMax
const DM_ROOT = 'http://www.debridmax.com/';
const HF_DM = 'http://www.debridmax.com/hotfile/';
const MU_DM = 'http://www.debridmax.com/mega/';
const FS_DM = 'http://www.debridmax.com/fileserve/';
const FN_DM = 'http://s02.debridmax.com/filesonic/';
const UL_DM = 'http://www.debridmax.com/uploading/';
const RS_DM = 'http://www.debridmax.com/rapidshare/';
const DF_DM = 'http://www.debridmax.com/depositfiles/';
const UD_DM = 'http://www.debridmax.com/uploaded/';
const VBB_DM = 'http://www.debridmax.com/videobb/';

//Draw buttons near the code tag
function setButtons(theControl)
{
	if(theControl.html().indexOf('rapidshare')>=0 ||
			theControl.html().indexOf('megaupload')>=0 ||
			theControl.html().indexOf('hotfile')>=0 ||
			theControl.html().indexOf('uploading')>=0 ||
			theControl.html().indexOf('fileserve')>=0 ||
			theControl.html().indexOf('filesonic')>=0 || 
			theControl.html().indexOf('depositfiles')>=0 ||
			theControl.html().indexOf('videobb')>=0 ||
			theControl.html().indexOf('uploaded')>=0
		)
			
		theControl.before(
				"<input type='button' class='downloadAll' value='" + "Download All" + "' />"+
				"<input type='button' class='downloadSelected' value='" + "Download Selected" + "' />"
		);
		
}

//set the host (rapidshare/megaupload/hotfile)
function setHost(theString)
{
	var host="";
	
	if (theString.indexOf("rapidshare")>=0)
		host=RS_DM;
	else if (theString.indexOf("megaupload")>=0)
		host=MU_DM;
	else if (theString.indexOf("megavideo")>=0)
		host=MU_DM;
	else if (theString.indexOf("hotfile")>=0)
		host=HF_DM;
	else if (theString.indexOf("uploading")>=0)
		host=UL_DM;
	else if (theString.indexOf("fileserve")>=0)
		host=FS_DM;
	else if (theString.indexOf("filesonic")>=0)
		host=FN_DM;
	else if (theString.indexOf("depositfile")>=0)
		host=DF_DM;
	else if (theString.indexOf("uploaded")>=0)
		host=UD_DM;
	else if (theString.indexOf("videobb")>=0)
		host=VBB_DM;
	else
		host="";
	
	return host;
}

//for phpBB's code tag users: warez-bb.org
$("td.code").each(function() {
		setButtons($(this));
});

//for vBulletin's code tag users: katzforums.com, tehparadox.com
$("pre").each(
		function() {
		setButtons($(this));
});

//"Download Selected" button on page
$('.downloadSelected').click(
	function(){
			
		var leecher = $(this).attr('id');
		var selectedText = window.getSelection().toString();
		if(selectedText == "")
		{
			alert("Select the link first");
		}
		else
		{
			postMessage(selectedText);
		}
	
	});
	
function generateBy(theURL,linksControlValue) {
		
	postdata="";
	err="";
	totallinks=0;
	linksControlValue = jQuery.trim(linksControlValue);
	
	switch(theURL)
	{
		case RS_DM :
			postdata = "rslinks="+encodeURIComponent(linksControlValue);
			break;
		
		case MU_DM :
			var value = linksControlValue.split("&");
			postdata = "link="+encodeURIComponent(value[0])+"&pass="+encodeURIComponent(value[1]);
			break;
		
		case HF_DM :
			postdata = "hotlink="+encodeURIComponent(linksControlValue);
			break;
		
		case UL_DM :
			postdata = "up_link="+encodeURIComponent(linksControlValue);
			break;
		
		case FN_DM :
			postdata = "fs_link="+encodeURIComponent(linksControlValue);
			break;
			
		case FS_DM :
			postdata = "fs_link="+encodeURIComponent(linksControlValue);
			break;
			
		case DF_DM :
			postdata = "url="+encodeURIComponent(linksControlValue);
			break;
			
		case VBB_DM:
			postdata = "link="+encodeURIComponent(linksControlValue);
			break;
			
		case UD_DM:
			postdata = "uplink="+encodeURIComponent(linksControlValue);
			break;
	}
	
	postdata += "&x=99&y=99"; // random numbers are allowed for x and y.
	
	var index=0;
	var linksarray = [];
	var textInLink = [];
	
	gen_window = window.open('generated_link.html','name','height=300,width=510');
	gen_window.focus();
	
	$.ajax({
	type:"POST",
	timeout: 30000,
	url: theURL + "index.php",
	data: postdata,
	success:function(msg)
	{
		$("div.entry > p > a, div.entry > form ~ a",msg).each(function(i)
		{
			linksarray[index]=$(this).attr('href');
			textInLink[index]=$(this).text();
			index++;
		});
		
		if(index>0)
		{
			openLinksWindow(linksarray,textInLink,index,theURL);
		}
		else
		{
			alert("DebridMax: " + "background_error_when_generate" + " " + "background_verify_message");
			
		}	
	},
	
	error: function(msg){
		alert("DebridMax: Timeout. " + "background_verify_message");
		
	}
	});
		
	return true;
  }
  
 
 
//This file works as background.js for submissionWindow.html
//Event for debridff-generate button
$("#generate").click(function(){
	
	links = jQuery.trim($("#link").val());
	host_url = setHost((links.split("\n"))[0]);
	alert(host_url);
	if(host_url == MD_DM)
	{
		if($("#mu_pass").val() != "")
			links = links + "&" + $("#mu_pass").val();
		else
			links = links + "&" + "";
	}
	//generateBy(host_url,links);
}); 
 
 
 
/*
//BEGIN Direct Download Functions
function requestLink(thelinks)
{
	thehost = setHost(thelinks);
	chrome.extension.sendRequest({requestType:"dl", the_links:thelinks, the_host:thehost});
}


//change the link element's class for certain filehosts into class directlyDownloaded
//It enables users to directly generate the link the users click.
chrome.extension.sendRequest({requestType:"getAutoGenVal"}, function(response){
	if(response.auto_gen_val==1)
	{
		$("a[href]").each(
			function()
			{
				
					var ori_link = $(this).attr('href');		
					if(ori_link.indexOf('megaupload.com/?d=')>=0 || 
					   ori_link.indexOf('hotfile.com/dl/')>=0 ||
					   ori_link.indexOf('rapidshare.com/files/')>=0 ||
					   ori_link.indexOf('4shared.com/file/')>=0 ||
					   ori_link.indexOf('fileserve.com/file/')>=0 ||
					   ori_link.indexOf('uploading.com/files/')>=0 ||
					   ori_link.indexOf('depositfiles.com/files/')>=0 ||
					   ori_link.indexOf('uploaded.to/file/') >=0 )
					{			
						$(this).attr({class:"directlyDownload"});
					}
				}
			
		);

		$("a.directlyDownload").click(function(){
			requestLink($(this).attr('href'));
			return false;
		});
	}
});


//END Direct Download Functions

//"Download" button on page
$('.downloadAll').click(
	function(){
		unparsedlinks = "";
		var s = $(this).next().next().html();//get the text next to the button
		
		//BEGIN Google Dict div element removal
		var dom = document.createElement('span');
		dom.innerHTML = s;
		var children = dom.childNodes;
		for(var i = 0; i<children.length; i++)
		{
			if(children[i].nodeType!=1)
				unparsedlinks += children[i].data;
		}
		//END
		
		parsedlinks = unparsedlinks.split("\n\n");
		
		thelinks = jQuery.trim(parsedlinks.join("\n"));
		
		var thehost = setHost(thelinks);
		if(thehost.length>0)
		{	
			chrome.extension.sendRequest({requestType:"dl", the_links:thelinks, the_host:thehost});
		}
		else
			alert(chrome.i18n.getMessage("content_supported_hosts"));
	});
*/



