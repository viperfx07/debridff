//Defining components variable
var ss = require("simple-storage");
const data = require("self").data;
var pagemods = require("page-mod");
var panels = require("panel");
var contextMenu = require("context-menu");

//Declaring workers
var contentWorker, subWinWorker, genLinkWorker;

//Show load.gif as widget icon
function showLoaderIconOnWidget(){
	debridWidget.contentURL = data.url("load.gif");
}

//Show default icon (icon19.png) as widget icon
function showDefaultIconOnWidget(){
	debridWidget.contentURL = data.url("icon19.png");
}

//submission window message handler for its page-mod
function subWindowMsgHandler(msg) {
	if(msg=="finish_loading")
		showDefaultIconOnWidget();
	else if(msg=="loading")
		showLoaderIconOnWidget();
	else if(msg=="open_debrid")
		require("windows").browserWindows.open("http://www.debridmax.com/en/");
	else if(msg=="open_donate")
		require("windows").browserWindows.open("https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VPJ5YQHBG7L36");
	else{
		ss.storage.parsedJSONfromSubWin = JSON.parse(msg);
	}
} 

//generated link window message handler for its page-mod
function genLinkMsgHandler(msg){
	var m = JSON.parse(msg);
	
	if(m.type=="ready")
		genLinkWorker.postMessage(ss.storage.parsedJSONfromSubWin);
	else
		require("clipboard").set(m.content);
}

//content message handler for its page-mod
function contentMsgHandler(msg){
	if(msg=="loading")
		showLoaderIconOnWidget();
	else if(msg=="finish_loading")
		showDefaultIconOnWidget();
	else
		ss.storage.parsedJSONfromSubWin = JSON.parse(msg);
}

//Page-mod object for submissionWindow.html
pagemods.PageMod({
	include: data.url("submissionWindow.html"),
	contentScriptWhen: 'ready',
	contentScriptFile: [data.url("jquery.js"), data.url("generator.js"), data.url("hostSetter.js"), data.url("subWin.js"), data.url("loginChecker.js"), data.url("htmlparser.js")],
	contentScript: 'var generatedLinkWin="' + data.url("generated_link.html") + '";',
	onAttach: function onAttach(worker, mod){
		worker.on('message', subWindowMsgHandler);
		subWinWorker = worker;
	}
});

//Page-mod object for generated_link.html
pagemods.PageMod({
	include: data.url("generated_link.html"),
	contentScriptWhen: 'ready',
	contentScriptFile: [data.url("jquery.js"), data.url("genlink.js")],
	onAttach: function onAttach(worker, mod){
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
  contentScript: 'var generatedLinkWin="' + data.url("generated_link.html") + '";',
  onAttach: function onAttach(worker, mod) {
    worker.on('message', contentMsgHandler);
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
		contentScriptFile: [data.url("jquery.js"),data.url("popup.js"),data.url("hostSetter.js"),data.url("loginChecker.js"),data.url("htmlparser.js")],
		onShow: function(){this.postMessage("load");},
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


//Selection context menu
var selectionContextMenu = contextMenu.Item({
	label: "Download selected with Debridmax",
	context: contextMenu.SelectionContext(),
	contentScriptWhen: 'ready',
	contentScriptFile: [data.url("generator.js"), data.url("hostSetter.js"),data.url("selectioncontextMenu.js"),data.url("loginChecker.js"),data.url("htmlparser.js")],
	contentScript: 'var generatedLinkWin="' + data.url("generated_link.html") + '";',
	onMessage: function(m){
		switch (m)
		{
			case "loading" :
				showLoaderIconOnWidget();
				break;
			case "finish_loading" :
				showDefaultIconOnWidget();
				break;
			default:
				ss.storage.parsedJSONfromSubWin = JSON.parse(m);
				return;
		}
	}
});

//Link context menu
var linkContextMenu = contextMenu.Item({
	label: "Download link with Debridmax",
	context: contextMenu.SelectorContext("a[href]"),
	contentScriptWhen: 'ready',
	contentScriptFile: [data.url("generator.js"), data.url("hostSetter.js"),data.url("linkcontextMenu.js"),data.url("loginChecker.js"),data.url("htmlparser.js")],
	contentScript: 'var generatedLinkWin="' + data.url("generated_link.html") + '";',
	onMessage: function(m){
		switch (m)
		{
			case "loading" :
				showLoaderIconOnWidget();
				break;
			case "finish_loading" :
				showDefaultIconOnWidget();
				break;
			default:
				ss.storage.parsedJSONfromSubWin = JSON.parse(m);
				return;
		}
	}
});
