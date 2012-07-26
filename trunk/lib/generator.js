//Hostname
const DM_ROOT = "http://www.multi-debrid.com/";
const MD_DM = 'http://www.multi-debrid.com/downloader/';

// Import the APIs we need.
var Request = require("request").Request;

// Define the 'translate' function using Request
function generate(link,pass,callback) {
  new Request({
	 url: MD_DM + "p.php",
	 content: "hotlink=" + link.trim() + "&pass=" + pass + "&t=2e", 
	 onComplete: function(){
			var txt=this.response.text;
			
			if(txt.indexOf('document.location.href="../login.php"')>=0)
				txt = '<span><a href="' + DM_ROOT + 'login.php">Please login before using this extension</a></span>';
			else if(txt.indexOf("</font>")>=0)
			{
				console.log(txt);
				var start = txt.indexOf("<b>");
				var end = txt.indexOf("</b>");
				txt =  txt.substring(start+3,end);
				txt = txt.replace(/(<([^>]+)>)/ig,""); //replace the tags with null
				txt = '<span><a href="#">' + txt +'</span>';
			}
			callback(txt);
		}
	}).post();
}

 
// Export the 'generate' function
exports.generate = generate;