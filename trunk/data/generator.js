//Generate premium download links
//theURL: the filehost url string
//linksControlValue: the filesharing links
function generateBy(theURL,linksControlValue) {
	
	if(isLoginToDebridmax()==1)
	{	
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
		var linksarray = new Array(); //array for links
		var textInLink = new Array(); //array for text in the link i.e. <a>text</a>
		
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
						"index" : index
					}; //json to be passed to message handler in main.js
					
					let strJSON = JSON.stringify(objJSON);
					
					//generatedLinkWin variable is defined in the contentScript in main.js
					//generatedLinkWin: the URL of generated_link.html
					window.open(generatedLinkWin,'name','height=300,width=510'); 
					postMessage(strJSON);
				}
				else
				{
					alert("DebridMax: " + "Error when generate. " + "\nPossible reasons: \n1. The link and/or password is invalid.\n2. The service is down.\n3. The premium accounts are out of order.");
				}
				
			},	
			error: function(msg){
				alert("DebridMax: Timeout. " + "\nPossible reasons: \n1. The link and/or password is invalid.\n2. The service is down.\n3. The premium accounts are out of order.");
			},
			
			complete: function(){ 
				$("img#debridff-sw-loader").hide(); //hides the load.gif on submissionWindow.html
				postMessage("finish_loading"); //change the widget icon into the default one
			}
				
		});
	}
	else
	{
		alert("You are not currently logged in to Debridmax. Please login before using the tool.");
		$("img#debridff-sw-loader").hide();
		postMessage("finish_loading");
	}
		
	return true;
}