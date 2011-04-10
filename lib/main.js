//Defining components variable
var ss = require("simple-storage");
const data = require("self").data;
var pagemods = require("page-mod");
var panels = require("panel");

//Declaring workers
var contentWorker, subWinWorker, genLinkWorker;

function subWindowMsgHandler(msg) {
	ss.storage.parsedJSONfromSubWin = JSON.parse(msg);
} 

function genLinkMsgHandler(msg){
	genLinkWorker.postMessage(ss.storage.parsedJSONfromSubWin);
}

function contentMsgHandler(msg){
	contentWorker.postMessage("test");
}

//Page-mod object for submissionWindow.html
pagemods.PageMod({
	include: data.url("submissionWindow.html"),
	contentScriptWhen: 'ready',
	contentScriptFile: [data.url("jquery.js"), data.url("generator.js"), data.url("hostSetter.js"), data.url("subWin.js")],
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
  contentScriptFile: [data.url("jquery.js"), data.url("generator.js"), data.url("hostSetter.js"),data.url("pageModder.js")],
  onAttach: function onAttach(worker, mod) {
    // Register the handleMessage function as a listener
    worker.on('message', contentMsgHandler);
    contentWorker = worker;
  }
});

require("widget").Widget({
	id: "debrid_widget",
	label: "DebridMax",
	contentURL: data.url("icon19.png"),
	onClick: function() { 
		require("panel").Panel({
		height: 100,
		width : 250,
		contentURL: data.url("popup.html"),
		contentScriptWhen: "ready",
		contentScriptFile: [data.url("jquery.js"),data.url("popup.js"),data.url("hostSetter.js")],
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
		}).show();
	}
});



