//Defining components variable
var ss = require("simple-storage");
const data = require("self").data;
var pagemods = require("page-mod");
var panels = require("panel");

//Declaring workers
var contentWorker, subWinWorker, genLinkWorker;



function showLoaderIconOnWidget(){
	debridWidget.contentURL = data.url("load.gif");
}

function showDefaultIconOnWidget(){
	debridWidget.contentURL = data.url("icon19.png");
}

function subWindowMsgHandler(msg) {
	if(msg=="finish_loading")
		showDefaultIconOnWidget();
	else
		ss.storage.parsedJSONfromSubWin = JSON.parse(msg);
} 

function genLinkMsgHandler(msg){
	var m = JSON.parse(msg);
	
	if(m.type=="ready")
		genLinkWorker.postMessage(ss.storage.parsedJSONfromSubWin);
	else
		require("clipboard").set(m.content);
}

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
	contentScriptFile: [data.url("jquery.js"), data.url("generator.js"), data.url("hostSetter.js"), data.url("subWin.js")],
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
  contentScriptFile: [data.url("jquery.js"), data.url("generator.js"), data.url("hostSetter.js"),
					 data.url("pageModder.js"),data.url("loginChecker.js")],
  contentScript: 'var generatedLinkWin="' + data.url("generated_link.html") + '";',
  onAttach: function onAttach(worker, mod) {
    worker.on('message', contentMsgHandler);
    contentWorker = worker;
  }
});

var debridWidget = require("widget").Widget({
	id: "debrid_widget",
	label: "DebridMax",
	contentURL: data.url("icon19.png"),
	panel: panels.Panel({
		height: 150,
		width : 250,
		contentURL: data.url("popup.html"),
		contentScriptFile: [data.url("jquery.js"),data.url("popup.js"),data.url("hostSetter.js"),data.url("loginChecker.js")],
		onShow: function(){this.postMessage("load the init method");},
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



