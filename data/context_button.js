/*
* Source: adapted from Real-Debrid Plugin (which is also adapted from http://code.google.com/p/contextsearch/source/browse/trunk/context_search.js?spec=svn11&r=11)
* Modified by: viperfx07
*/

var _linkFounds = [];
var selectedText = '';
var buttonIcon = 'url(http://debridmax.com/favicon.ico)';

var hostFilter = new Array(
    /(http|https):\/\/(\w+\.)?rapidshare\.com\/(files\/[^\"\r\n< ]+|#!download[^\"\r\n< ]+)/g,
    /http:\/\/(\w+\.)?megaupload\.com\/([a-zA-Z]+\/)?\?[a-zA-Z]=[0-9a-zA-Z]{8}/g,
    /http:\/\/(\w+\.)?megavideo\.com\/([a-zA-Z]+\/)?\?[a-zA-Z]=[0-9a-zA-Z]{8}/g,
    /http:\/\/(\w+\.)?depositfiles\.com\/([a-zA-Z]+\/)?files\/[^\"\r\n< ]+/g,
    /http:\/\/(\w+\.)?hotfile\.com\/dl\/[0-9a-zA-Z]+\/[\/[0-9a-zA-Z]+\//g,
    /http:\/\/(\w+\.)?u(ploaded|l)\.to\/(file\/|\?id=|)[0-9a-zA-Z]{6}/g,  
    /http:\/\/(\w+\.)?uploading\.com\/files\/[a-zA-Z0-9]+\//g,    
    /http:\/\/(\w+\.)?filesonic\.(com|fr|de|it|net|org)\/file\/[^\"\r\n< ]+/g,
    /http:\/\/(\w+\.)?fileserve\.com\/file\/[^\"\r\n< ]+/g,
	/http:\/\/(\w+\.)?videobb.com\/video\/[^\"\r\n< ]+/g,
	/http:\/\/dl\.free\.fr\/[^\"\r\n< ]+/g
	);
	
function checkMultiLink(link) {
    if(!link) return 0;
    var result = new Array();
    var i;
    for(i=0;i<hostFilter.length;i++) {
            var res = link.match(hostFilter[i]);
            if(res)
                result = result.concat(res);
    }
	return (result.length) ? result : 0;
}

var ContextButton = function()
{
	this._button;
	this._isAppended = false;
	this._hova = false;

	this._init = function()
	{
        _linkFounds = "";
		this._button = document.createElement('button');
		with (this._button.style)
		{
			margin = '0px';
			padding = '0px';
			width = '16px';
			height = '16px';
			position = 'absolute';
			cursor = 'pointer';
			border = 'none';
			display = 'none';
			background = buttonIcon + ' no-repeat';
			zIndex = 4294967296;
			opacity = 1;
		}

		this._button.addEventListener('mouseup', function(e) { e.stopPropagation(); }, false);
		this._button.addEventListener('mousedown', function(e) { e.stopPropagation(); }, false);
		this._button.addEventListener('dblclick', function(e) { e.stopPropagation(); }, false);
		this._button.addEventListener('click',
			function(e)
			{
				thelinks = ((_linkFounds.toString()).split(",")).join("\n");
				var the_host  = setHost(_linkFounds[0]);
				generateBy(the_host,thelinks);
				e.stopPropagation();
			},
			false);
	}

	this._init();

	this.isActive = false;
	this.isFrozen = false;
	this.pos = { x: NaN, y: NaN };

	this.updateButtonStyle = function(topPxs, leftPxs, displayStyle)
	{
		with (this._button.style)
		{
			if (topPxs != NaN) top = topPxs + 'px';
			if (leftPxs != NaN) left = leftPxs + 'px';
			display = displayStyle;
		}
	}

	this.setOpacity = function(opacity)
	{
		this._button.style.opacity = opacity;
	}

	this.open = function(pos)
	{
        _linkFounds = checkMultiLink(viewPartialSourceForSelection());
        if(!_linkFounds)
            return;

		if (!this._isAppended)
		{
			document.body.appendChild(this._button);
			this._isAppended = true;
		}
		this.pos = pos;
		this.updateButtonStyle(this.pos.y, this.pos.x, 'block');
		this.isActive = true;
		this.isFrozen = false;
	}


	this.show = function()
	{
		this.updateButtonStyle(this.pos.y, this.pos.x, 'block');
		this.isActive = true;
		this.isFrozen = false;
	}

	this.hide = function()
	{
		this.updateButtonStyle(NaN, NaN, 'none');
		this.isActive = true;
		this.isFrozen = false;
	}

	this.close = function()
	{
		this._button.style.opacity = 1;
		this.pos = { x: NaN, y: NaN };
		this.updateButtonStyle(NaN, NaN, 'none');
		this.isActive = false;
		this.isFrozen = false;
        this._linkFounds = "";
	}

}

function viewPartialSourceForSelection(){
    if(window.getSelection){
		var selection = window.getSelection();
		if(selection.rangeCount > 0)
		{
			var range = selection.getRangeAt(0);
			if (range) {
				var div = range.startContainer.ownerDocument.createElement('div');
				div.appendChild(range.cloneContents());
				return(div.innerHTML);
			}
			return selection.toString();
		}
	}
}

var btn = new ContextButton();
var mouseStatus = { pressed: false, pressedEventArgs: {}, pressedAndMoved: false };

document.addEventListener('mouseup',
	function(e)
	{
		if (e.button == 0)
		{
			updateContextButton(e, true);
		}
		mouseStatus.pressed = false;
		mouseStatus.pressedAndMoved = false;
	},
	false);

document.addEventListener('mousedown',
	function(e)
	{
		if (btn.isActive)
		{
			btn.close();
		}
		mouseStatus.pressed = true;
		mouseStatus.pressedEventArgs = e;
		mouseStatus.pressedAndMoved = false;
	},
	false);

document.addEventListener('dblclick',
	function(e)
	{
		updateContextButton(e, false);
		mouseStatus.pressed = false;
		mouseStatus.pressedAndMoved = false;
	},
	false);

document.addEventListener('mousemove',
	function(e)
	{
		if (btn.isActive && !btn.isFrozen)
		{
			var distance = Math.sqrt(Math.pow(e.pageX - btn.pos.x, 2) + Math.pow(e.pageY - btn.pos.y, 2));
			if (distance < 30)
				btn.setOpacity(1);
			else if (30 < distance && distance < 530)
				btn.setOpacity(-7.0 * distance / 5000 + 1.042);
			else
				btn.setOpacity(0.3);
		}
		if (mouseStatus.pressed && !mouseStatus.pressedAndMoved)
		{
			mouseStatus.pressedAndMoved = true;
		}
	},
	false);

document.addEventListener('keydown',
	function(e)
	{
		if ((e.keyCode == 27 && e.shiftKey == false && e.ctrlKey == false && e.altKey == false) ||
			(trim(window.getSelection().toString()) == ''))
		{
			if (btn.isActive) btn.close();
		}
	},
	false);


function updateContextButton(eventArgs, checkMouseStatus)
{
	var target = eventArgs.target;
	var pressedTarget = mouseStatus.pressedEventArgs.target;
	var selection = window.getSelection();
	selectedText = selection.toString();

	if (target.nodeName != 'TEXTAREA' && target.nodeName != 'INPUT' &&
		pressedTarget.nodeName != 'TEXTAREA' && pressedTarget.nodeName != 'INPUT')
	{
		if (trim(selectedText) != '' && (!checkMouseStatus || mouseStatus.pressedAndMoved))
		{
			var buttonShift;
			if (checkMouseStatus)
			{
				var d = 20;
				var horShift = eventArgs.pageX - mouseStatus.pressedEventArgs.pageX;
				var verShift = eventArgs.pageY - mouseStatus.pressedEventArgs.pageY;
				buttonShift = (verShift > d) ? { x: 5, y: 5 } :
					(verShift < -d || horShift < 0) ? { x: -15, y: -20 } : { x: 5, y: 5 };
			}
			else
			{
				buttonShift = { x: 5, y: 10 };
			}
			btn.open({ x: eventArgs.pageX + buttonShift.x, y: eventArgs.pageY + buttonShift.y });
		}
		else
		{
			btn.close();
		}
	}
}

function trim(string)
{
	return string.replace(/^\s+|\s+$/g, '');
}