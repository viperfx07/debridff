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
	var linksarray = new Array();
	var textInLink = new Array();
	
	$.ajax({
		type:"POST",
		timeout: 100000, //100 seconds
		url: theURL + "index.php",
		data: postdata,
		success:function(msg)
		{
			$("div.entry > p > a, div#debridmax > a",msg).each(function(i)
			{
				linksarray[index]=($(this).attr('href')).toString();
				textInLink[index]=($(this).text()).toString();
				index++;
				
			});
			
			if(index>0)
			{
				let objJSON = {
					"linksarray" : linksarray,
					"textInLink" : textInLink,
					"index" : index,
					"theURL" : theURL
				};
				
				let strJSON = JSON.stringify(objJSON);
				window.open(generatedLinkWin,'name','height=300,width=510');
				postMessage(strJSON);
			}
			else
			{
				alert("DebridMax: " + "Error when generate" + " " + "background_verify_message");
			}
			
		},	
		error: function(msg){
			alert("DebridMax: Timeout. " + "background_verify_message");
		},
		
		complete: function(){ 
			$("img#debridff-sw-loader").hide();
			$("#debridff-loader-on-page").hide();
		}
			
	});
		
	return true;
}