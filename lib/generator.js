// Import the APIs we need.
var Request = require("request").Request;

// Define the 'translate' function using Request
function generate(link,pass,callback) {
  new Request({
	 url: "http://www.debridmax.com/multimax/p.php",
	 content: "hotlink=" + link + "&pass=" + pass + "&t=2e", 
	 onComplete: function(){
			var txt=this.response.text;
			if(txt.indexOf('document.location.href="../login.php"')>=0)
				txt = '<span><a href="http://www.debridmax.com/login.php">Please login before using this extension</a></span>';
			else if(txt.indexOf("<b>lien")>=0)
				txt = '<span><a href="#">The link is invalid</a></span>';
			else if(txt.indexOf("<b>Serveur")>=0)
				txt = '<span><a href="http://www.debridmax.com/premium.php">The server is overload. Buy premium to avoid this.</a></span>';
			else if(txt.indexOf("<b>Vous")>=0)
				txt = '<span><a href="#">Buy premium to use this feature.</a></span>';
					   
			callback(txt);
		}
	}).post();
}
 
// Export the 'generate' function
exports.generate = generate;