// Import the APIs we need.
var Request = require("request").Request;

// Define the 'translate' function using Request
function generate(link,pass,callback) {
  new Request({
	 url: "http://www.debridmax.com/multimax/p.php",
	 content: "hotlink=" + link.trim() + "&pass=" + pass + "&t=2e", 
	 onComplete: function(){
			var txt=this.response.text;
			
			if(txt.indexOf('document.location.href="../login.php"')>=0)
				txt = '<span><a href="http://www.debridmax.com/login.php">Please login before using this extension</a></span>';
			else if(txt.indexOf("</font>")>=0)
			{
				var start = txt.indexOf("<b>");
				var end = txt.indexOf("</b>");
				txt =  txt.substring(start+3,end);
				txt = txt.replace(/(<([^>]+)>)/ig,"");
				txt = '<span><a href="#">' + txt +'</span>';
			}
			console.log(txt);
			callback(txt);
		}
	}).post();
}

 
// Export the 'generate' function
exports.generate = generate;