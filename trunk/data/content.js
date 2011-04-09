//DebridMax
const DM_ROOT = 'http://www.debridmax.com/';
const MD_DM = 'http://www.debridmax.com/multimax/';
const RS_DM = 'http://www.debridmax.com/rapidshare/';
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
		host=MD_DM;
	else if (theString.indexOf("megavideo")>=0)
		host=MD_DM;
	else if (theString.indexOf("hotfile")>=0)
		host=MD_DM;
	else if (theString.indexOf("uploading")>=0)
		host=MD_DM;
	else if (theString.indexOf("fileserve")>=0)
		host=MD_DM;
	else if (theString.indexOf("filesonic")>=0)
		host=MD_DM;
	else if (theString.indexOf("depositfile")>=0)
		host=MD_DM;
	else if (theString.indexOf("uploaded")>=0)
		host=MD_DM;
	else if (theString.indexOf("videobb")>=0)
		host=VBB_DM;
	else
		host="";
	
	return host;
}

//Draw Download and Download All for tag that contains download links.
$("td.code, pre, blockquote").each(function() {
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
	
//Generate premium download links
function generateBy(theURL,linksControlValue) {
		
	postdata="";
	err="";
	totallinks=0;
	linksControlValue = jQuery.trim(linksControlValue);
	
	// DebridMax
	switch(theURL)
	{
		case RS_DM :
			postdata = "rslinks="+encodeURIComponent(linksControlValue);
			break;
		
		case MD_DM :
			var value = linksControlValue.split("&");
			postdata = "hotlink="+encodeURIComponent(value[0])+"&pass="+encodeURIComponent(value[1]);
			break;
		
		case VBB_DM:
			postdata = "link="+encodeURIComponent(linksControlValue);
			break;
	}
	
	postdata += "&x=99&y=99"; // random numbers are allowed for x and y.
	
	var index=0;
	var linksarray = [];
	var textInLink = [];
	var objJSON;
	var strJSON
	
	$.ajax({
	type:"POST",
	timeout: 100000,
	url: theURL + "index.php",
	data: postdata,
	success:function(msg)
	{
		$("div.entry > p > a, div#debridmax > a",msg).each(function(i)
		{
			linksarray[index]=$(this).attr('href');
			textInLink[index]=$(this).text();
			index++;
			
		});
		
		if(index>0)
		{
			objJSON = {
				"linksarray" : linksarray,
				"textInLink" : textInLink,
				"index" : index,
				"theURL" : theURL
			};
			
			strJSON = JSON.stringify(objJSON);
			
		}
		else
		{
			alert("DebridMax: " + "Error when generate" + " " + "background_verify_message");
		}	
	},
	
	error: function(msg){
		alert("DebridMax: Timeout. " + "background_verify_message");
	},
	
	complete: function(msg){
		postMessage(strJSON);
	}
	});
		
	return true;
  }
  
 
//BEGIN Background codes for submissionWindow.html

//Event for debridff-generate button
$("#debridff-generate").click(function(){
	
	postMessage("test");
	links = jQuery.trim($("#debridff-link").val());
	host_url = setHost((links.split("\n"))[0]);
	if(host_url == MD_DM)
	{
		if($("#debridff-mu_pass").val() != "")
			links = links + "&" + $("#debridff-mu_pass").val();
		else
			links = links + "&" + "";
	}
	generateBy(host_url,links);
}); 
 
//END Background codes for submissionWindow.html

//BEGIN Background codes for generated_link.html
function setLinks(linksarray,textInLink,totallinks,theURL)
{
	var links="";
	var anchorlinks="";
	var startIndex = 0;
	var endIndex;
	
	endIndex = startIndex + totallinks - 1
			
	for(i=startIndex;i<=endIndex;i++)
	{
		links+=linksarray[i]+"\r\n";
		anchorlinks += chrome.i18n.getMessage("generatedlink_link") + (i+1) + ': <a href='+linksarray[i]+'>'+textInLink[i]+'</a><br/>';
	}
	
	document.getElementById('links').value += links;
	$("#anchorlinks").append(anchorlinks);
	$("#loader").hide();
	$("#links").attr('rows',totallinks*2)
}

//END


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



