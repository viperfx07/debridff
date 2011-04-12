//Add Download All and Download Selected buttons before td.code, pre, and blockquote element
$("td.code, pre, blockquote").each(function() {
	if($(this).html().indexOf('rapidshare')>=0 ||
		$(this).html().indexOf('megaupload')>=0 ||
		$(this).html().indexOf('hotfile')>=0 ||
		$(this).html().indexOf('uploading')>=0 ||
		$(this).html().indexOf('fileserve')>=0 ||
		$(this).html().indexOf('filesonic')>=0 || 
		$(this).html().indexOf('depositfiles')>=0 ||
		$(this).html().indexOf('videobb')>=0 ||
		$(this).html().indexOf('uploaded')>=0
	)
	{
		$(this).before(
				"<input type='button' class='downloadAll' value='" + "Download All" + "' />"+
				"<input type='button' class='downloadSelected' value='" + "Download Selected" + "' />"
		);
	}
});
	
	
//"Download Selected" button on page
$('.downloadSelected').click(
	function(){
		let selectedText = window.getSelection().toString();
		if(selectedText == "")
			alert("Select the link first");
		else
		{
			postMessage("loading"); //show loading icon on widget
			if(isLoginToDebridmax() == 1){ //if logged in
				let thehost = setHost(selectedText); //get the filehosting URL 
				generateBy(thehost,selectedText); //generate the links
			}	
			else
			{
				alert("You are not currently logged in to Debridmax. Please login before using the tool.");
				postMessage("finish_loading"); //show the default loading icon on widget
			}
		}
});
	
//"Download" button on page
$('.downloadAll').click(
	function(){
		let unparsedlinks = jQuery.trim($(this).next().next().text());//get the text next to the button
		let parsedlinks = unparsedlinks.split("\n\n");
		let thelinks = jQuery.trim(parsedlinks.join("\n"));
		let thehost = setHost(thelinks);
		postMessage("loading");
		if(isLoginToDebridmax() == 1){
			let thehost = setHost(thelinks);
			generateBy(thehost,thelinks);
		}	
		else
		{
			alert("You are not currently logged in to Debridmax. Please login before using the tool.");
			postMessage("finish_loading");
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




