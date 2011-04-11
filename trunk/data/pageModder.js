var loaderGIF;
onMessage= function onMessage(msg)
{	
	loaderGIF = msg;
}


//Draw buttons near the code tag
function setButtons(theControl)
{
	postMessage("getLoaderImgSrc");
	console.log(loaderGIF);
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
				"<input type='button' class='downloadSelected' value='" + "Download Selected" + "' />"+
				"<img id='debridff-loader-on-page' src='" + loaderGIF + "' />"
		);
		$("#debridff-loader-on-page").hide();
}

//Draw Download and Download All for tag that contains download links.
$("td.code, pre, blockquote").each(function() {
	setButtons($(this));
});

//"Download Selected" button on page
$('.downloadSelected').click(
	function(){
		$("#debridff-loader-on-page").show();	
		let selectedText = window.getSelection().toString();
		if(selectedText == "")
			alert("Select the link first");
		else
		{
			if(isLoginToDebridmax() == 1){
				let thehost = setHost(selectedText);
				generateBy(thehost,selectedText);
			}	
			else
				alert("background_notloggedin");
		}
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
*/

//"Download" button on page
$('.downloadAll').click(
	function(){
		$("#debridff-loader-on-page").show();
		let unparsedlinks = jQuery.trim($(this).next().next().text());//get the text next to the button
		let parsedlinks = unparsedlinks.split("\n\n");
		let thelinks = jQuery.trim(parsedlinks.join("\n"));
		let thehost = setHost(thelinks);
		if(isLoginToDebridmax() == 1){
			let thehost = setHost(thelinks);
			generateBy(thehost,thelinks);
		}	
		else
			alert("background_notloggedin");
	});
