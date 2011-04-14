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
			let thehost = setHost(selectedText); //get the filehosting URL 
			generateBy(thehost,selectedText); //generate the links
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
		
		let thehost = setHost(thelinks);
		generateBy(thehost,thelinks);
});