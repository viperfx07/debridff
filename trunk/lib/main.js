//Coder: viperfx07
var ss = require("simple-storage");
const data = require("self").data;
var panels = require("panel");
var pagemods = require("page-mod");
var pageWorkers = require("page-worker");
var contentWorker;
var subWinWorker;
var genlinkWorker;

function subWindowMsgHandler(msg) {
  if(msg)
	var m = JSON.parse(msg);
	
  var links = m.linksarray;
  for(var i=0; i<links.length; i++)
	console.log(links[i])
  
  console.log(m.index);
}

function genLinkMsgHandler(msg){
	genlinkWorker.postMessage("test");
}

var contentMod = pagemods.PageMod({
  include: "*",
  contentScriptWhen: 'ready',
  contentScriptFile: [data.url("jquery.js"), data.url("content.js")],
  onAttach: function onAttach(worker, mod) {
    // Register the handleMessage function as a listener
    worker.on('message', handleMessage);
    contentWorker = worker;
  }
});

//page-mod object for submissionWindow.html
var subWin = pagemods.PageMod({
	include: "resource://*",
	contentScriptWhen: 'ready',
	contentScriptFile: [data.url("jquery.js"), data.url("content.js")],
	onAttach: function onAttach(worker, mod){
		worker.on('message', subWindowMsgHandler);
		subWinWorker = worker;
	}
});

var genlink = pagemods.PageMod({
	include: "resource://*",
	contentScriptWhen: 'ready',
	contentScriptFile: [data.url("jquery.js"), data.url("genlink.js")],
	onAttach: function onAttach(worker, mod){
		worker.on('message', genLinkMsgHandler);
		genlinkWorker = worker;
	}
});



require("widget").Widget({
	id: "debrid_widget",
	label: "DebridMax",
	contentURL: "http://www.debridmax.com/favicon.ico",
	onClick: function() { 
	
	require("panel").Panel({
	contentURL: data.url("popup.html"),
	contentScriptWhen: "ready",
	contentScriptFile: [data.url("jquery.js"),data.url("popup.js"),data.url("const.js")],
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



