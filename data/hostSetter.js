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
	/http:\/\/(\w+\.)?netload\.in\/[^\"\r\n< ]+/g,
	/http:\/\/(\w+\.)?wupload\.com\/file\/[^\"\r\n< ]+/g,
	/http:\/\/(\w+\.)?4shared\.com\/[a-z]+\/[^( |"|>|<|\r\n\|\n|$)]+/g,
	/http:\/\/(\w+\.)?filefactory\.com\/file\/[0-9a-zA-Z]+\//g,
	/http:\/\/(\w+\.)?oron\.com\/[^\"\r\n< ]+/g,
	/http:\/\/(\w+\.)?megashares\.com\/(dl\/[0-9a-zA-Z]+\/[^( |"|>|<|\r\n\|\n|$)]+|[0-9a-zA-Z?\/=]+)/g,   
	/http:\/\/(\w+\.)?transitfiles.com\/dl\/[0-9a-zA-Z]{8}/g,
	/http:\/\/(\w+\.)?bitshare\.com\/(files\/[^( |"|>|<|\r\n\|\n|$)]+|\?f=[^( |"|>|<|\r\n\|\n|$)]+)/g,
	/http:\/\/(\w+\.)?(easy-share|crocko)\.com\/[0-9]{10}\//g,
	/http:\/\/(\w+\.)?uploadbox\.com\/([a-zA-Z]+\/)?files\/[0-9a-z]+[^( |"|>|<|\r\n\|\n|$)]+/g,
	/http:\/\/(www\.)?purevid\.com\/v\/[^( |"|>|<|\r\n\|\n|$)]+/g,
	/http:\/\/(www\.)?(uploadhere|uploadking|jumbofiles)\.com\/[^( |"|>|<|\r\n\|\n|$)]+/g	,
	/http:\/\/(\w+\.)?freakshare\.(net|com)\/files\/[0-9a-zA-Z]+\/[^( |"|>|<|\r\n\|\n|$)]+/g,
	/http:\/\/(www\.)?uptobox\.com\/[^( |"|>|<|\r\n\|\n|$)]+/g,
	/(http):\/\/(([0-9a-zA-Z]+)\.)?1fichier\.com\//g,
	/http:\/\/(\w+\.)?bayfiles\.com\/([a-zA-Z]+\/)?file\/[^\"\r\n< ]+/g,
	/http:\/\/(\w+\.)?extabit\.com\/file\/[0-9a-zA-Z]+/g,
	/(http):\/\/(\w+\.)?filepost\.com\/(files\/[^\"\r\n< ]+|#!download[^\"\r\n< ]+)/g,
	/http:\/\/(\w+\.)?gigasize\.com\/(get)\/[^\/\"\r\n< ]+/g,
	/http:\/\/(\w+\.)?letitbit\.net\/(download)\/[^\/\"\r\n< ]+/g,
	/http:\/\/(\w+\.)?purevid\.com\/(v)\/[^\/\"\r\n< ]+/g,
	/http:\/\/(\w+\.)?(turbobit.net|uploadboost.com|queenshare.com)\/[0-9a-zA-Z]+/g
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
