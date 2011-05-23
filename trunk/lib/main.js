//Defining components variable
var ss = require("simple-storage");
const data = require("self").data;
var pagemods = require("page-mod");
var panels = require("panel");
var contextMenu = require("context-menu");

ss.storage.genlink_href = []; //href
ss.storage.genlink_text = []; //inner text

//clear storage for saved login details
ss.storage.savedUsername = ss.storage.savedPassword = "";

//set cachedLinks to null when the addon's started
ss.storage.cachedLinks="";

//Declaring workers
var contentWorker, subWinWorker, genLinkWorker;

//passing on login details and instruction to generate links
function generateLinks(worker,links)
{
	console.log("getSavedLogin");
	require("passwords").search({
		onComplete: function onComplete(credentials) {
			credentials.forEach(function(credential) {
				if(credential.url== "http://www.debridmax.com" || credential.url == "http://debridmax.com")
				{
					console.log("got credential");
					ss.storage.savedUsername = credential.username;
					ss.storage.savedPassword = credential.password;
					ss.storage.hasSavedDetails = true;
				}
				else
				{
					ss.storage.savedUsername = ss.storage.savedPassword = "";
					ss.storage.hasSavedDetails = false;
				}
			});
			worker.postMessage({
					'type': 'generateLink',
					'username':ss.storage.savedUsername, 
					'password':ss.storage.savedPassword,
					'links': links
				});	
		}
	});
}

//Show load.gif as widget icon
function showLoaderIconOnWidget(){
	debridWidget.contentURL = data.url("load.gif");
}

//Show default icon (icon19.png) as widget icon
function showDefaultIconOnWidget(){
	debridWidget.contentURL = data.url("icon19.png");
}

//submission window message handler for its page-mod
function subWindowMsgHandler(msg){
	if(msg=="finish_loading")
		showDefaultIconOnWidget();
	else if(msg=="loading")
		showLoaderIconOnWidget();
	else if(msg=="open_debrid")
		require("windows").browserWindows.open("http://www.debridmax.com/en/");
	else if(msg=="open_donate")
		require("windows").browserWindows.open("https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VPJ5YQHBG7L36");
	else if(msg=="clearLinkCache")	
		ss.storage.cachedLinks="";
	else
		ss.storage.parsedJSONfromSubWin = JSON.parse(msg);
}

//generated link window message handler for its page-mod
function genLinkMsgHandler(msg){
	if(msg.type=="ready")
		genLinkWorker.postMessage({'linksarray':ss.storage.genlink_href, 'textInLink':ss.storage.genlink_text});
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
		showDefaultIconOnWidget();
	else if(msg.type=="saveResult")
		storeLinksInStorage(msg.link,msg.text);
	else if(msg.type=="generate")
		generateLinks(contentWorker,msg.links);
	else
		return;
}

function clearLinksStorage()
{
	console.log("clear links storage");
	ss.storage.genlink_href=[];
	ss.storage.genlink_text=[];
}

//store generated links in storage
function storeLinksInStorage(link,text)
{
	console.log("link stored");
	ss.storage.genlink_href.push(link);
	ss.storage.genlink_text.push(text);
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
	contentScriptFile: [data.url("jquery.js"), data.url("generator.js"), data.url("hostSetter.js"), data.url("subWin.js"), data.url("loginChecker.js"), data.url("htmlparser.js")],
	contentScript: 'var generatedLinkWin="' + data.url("generated_link.html") + '";',
	onAttach: function onAttach(worker){
		worker.on('message', subWindowMsgHandler);
		subWinWorker = worker;
		this.contentScript += 
		" var savedPassword = '" + ss.storage.savedPassword + "'; " + 
		" var savedUsername = '" + ss.storage.savedUsername + "'; " +
		" var hasSavedDetails = '" + ss.storage.hasSavedDetails + "'; ";
		postLinksToSubWin();
	}
});

//Page-mod object for generated_link.html
pagemods.PageMod({
	include: data.url("generated_link.html"),
	contentScriptWhen: 'ready',
	contentScriptFile: [data.url("jquery.js"), data.url("genlink.js")],
	onAttach: function onAttach(worker){
		worker.on('message', genLinkMsgHandler);
		genLinkWorker = worker;
		
	}
});

//Page-mod object for websites
pagemods.PageMod({
  include: "*",
  contentScriptWhen: 'ready',
  contentScriptFile: [data.url("generator.js"), data.url("hostSetter.js"),
					 data.url("pageModder.js"),data.url("loginChecker.js"),data.url("context_button.js"),data.url("htmlparser.js")],
  contentScript: 'var generatedLinkWin="' + data.url("generated_link.html") + '"; ',
  onAttach: function onAttach(worker) {
	worker.on('message', contentMsgHandler);
    contentWorker = worker;
	this.contentScript += 
		" var savedPassword = '" + ss.storage.savedPassword + "'; " + 
		" var savedUsername = '" + ss.storage.savedUsername + "'; " +
		" var hasSavedDetails = '" + ss.storage.hasSavedDetails + "'; ";
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
		contentScriptFile: [data.url("jquery.js"),data.url("popup.js"),data.url("hostSetter.js"),data.url("loginChecker.js"),data.url("htmlparser.js")],
		onShow: function(){
			this.postMessage({'type':'saved_login_details', 'username' : ss.storage.savedUsername, 'password':ss.storage.savedPassword});
		},
		onMessage: function(m){
			switch (m)
			{
				case "hidePanel":
					this.hide();
					break;
				case "openLoginTab":
					require("tabs").open("http://www.debridmax.com/en/login.php");
					break;
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
	' var generatedLinkWin="' + data.url("generated_link.html") + '"; ' +
	' var savedPassword = "' + ss.storage.savedPassword + '"; ' + 
	' var savedUsername = "' + ss.storage.savedUsername + '"; ' +
	' var hasSavedDetails = ' + ss.storage.hasSavedDetails + ';',
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
	'var generatedLinkWin="' + data.url("generated_link.html") + '"; ' +
	' var savedPassword = "' + ss.storage.savedPassword + '"; ' + 
	' var savedUsername = "' + ss.storage.savedUsername + '"; ' +
	' var hasSavedDetails = ' + ss.storage.hasSavedDetails + ';',
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
			showDefaultIconOnWidget();
			break;
		case "saveResult" :
			storeLinksInStorage(m.link,m.text);
			break;
		case "send_link_to_subwin" :
			sendLinkToSubWin(m.content);
			break;
		case "generate" :
			generateLinks(contentWorker,m.links);
			break;
		default:
			return;
	}
}
		
//END Context menu
