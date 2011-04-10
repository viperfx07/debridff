//DebridMax URLs
const DM_ROOT = 'http://www.debridmax.com/';
const MD_DM = 'http://www.debridmax.com/multimax/';
const RS_DM = 'http://www.debridmax.com/rapidshare/';
const VBB_DM = 'http://www.debridmax.com/videobb/';

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
