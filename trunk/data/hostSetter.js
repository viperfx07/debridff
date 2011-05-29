//DebridMax URLs
const DM_ROOT = 'http://www.debridmax.com/';
const MD_DM = 'http://www.debridmax.com/multimax/';
const RS_DM = 'http://www.debridmax.com/rapidshare/';
const VBB_DM = 'http://www.debridmax.com/videobb/';
var hostFilter = new Array(
    /(http|https):\/\/(\w+\.)?rapidshare\.com\/(files\/[^\"\r\n< ]+|#!download[^\"\r\n< ]+)/g,
    /http:\/\/(\w+\.)?megaupload\.com\/([a-zA-Z]+\/)?\?[a-zA-Z]=[0-9a-zA-Z]{8}/g,
    /http:\/\/(\w+\.)?megavideo\.com\/([a-zA-Z]+\/)?\?[a-zA-Z]=[0-9a-zA-Z]{8}/g,
    /http:\/\/(\w+\.)?depositfiles\.com\/([a-zA-Z]+\/)?files\/[^\"\r\n< ]+/g,
    /http:\/\/(\w+\.)?hotfile\.com\/dl\/[0-9a-zA-Z]+\/[\/[0-9a-zA-Z]+\//g,
    /http:\/\/(\w+\.)?u(ploaded|l)\.to\/(file\/|\?id=|)[0-9a-zA-Z]{6}/g,  
    /http:\/\/(\w+\.)?uploading\.com\/files\/[a-zA-Z0-9]+\//g,    
    /http:\/\/(\w+\.)?filesonic\.(com|fr|de|it|net|org)\/file\/[^\"\r\n< ]+/g,
    /http:\/\/(\w+\.)?fileserve\.com\/file\/[^\"\r\n< ]+/g,
	/http:\/\/(\w+\.)?videobb.com\/video\/[^\"\r\n< ]+/g,
	/http:\/\/dl\.free\.fr\/[^\"\r\n< ]+/g,
	/http:\/\/(\w+\.)?uploadstation\.com\/file\/[^\"\r\n< ]+/g,
	/http:\/\/(\w+\.)?duckload\.com\/(download|dl|play)\/[^\/\"\r\n< ]+/g,
	/http:\/\/(\w+\.)?netload\.in\/[^\"\r\n< ]+/g
	);

//filter link for respective host
function filterTheLink(link) {
	
    if(!link) return 0;
	var filterIndex = -1;
    for(var i=0;i<hostFilter.length;i++) {
        var res = link.match(hostFilter[i]);
		if(res)
		{
			filterIndex = i;
			break;
		}
	}
	return filterIndex;
}

//set the host (rapidshare/megaupload/hotfile/etc)
function setHost(theString)
{
	var host="";
	var hostFilterIndex = filterTheLink(theString);

	if(hostFilterIndex==0)
		host=RS_DM;
	else
		host=MD_DM;
	
	return host;
}
