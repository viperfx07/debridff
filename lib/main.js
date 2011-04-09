//Coder: viperfx07

const data = require("self").data;
var panels = require("panel");
var myWorker;

function handleMessage(message) {
  console.log(message);
}

require("page-mod").PageMod({
  include: ["*"],
  contentScriptWhen: 'ready',
  contentScriptFile: [data.url("jquery.js"), data.url("content.js")],
  onAttach: function onAttach(worker, mod) {
    // Register the handleMessage function as a listener
    worker.on('message', handleMessage);
    myWorker = worker;
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



