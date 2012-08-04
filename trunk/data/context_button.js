/*
* Source: adapted from http://code.google.com/p/contextsearch/source/browse/trunk/context_search.js?spec=svn11&r=11
* Modified by: viperfx07
*/

var _linkFounds = [];
var selectedText = '';
var buttonIcon = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACH0lEQVQ4jYWSXU8TQRSGn5ldytJtK13aQAtob8CvhKBRb7w38eOn+Ls08cIbY/TOCyExWmOkgAYJgUKEFhCWFtx2d2e82N02TQDPZCaZc86ced9zXlHdcDX/sQ+rh+y5nXNjphCXP948+MvesXdh3AQQyaEhgZP4lrdb8aWXMpBnGhKkECBAK42KE6UQNNwOQaiwUwamBCEFSmn8UNMNFKHSmFII3nxZo+11eXhzmkrxCkGoeLmwwu5xh/H8GPMVh9H0UJ/W/hkNt4PnK0whBG+razTcU9pel+eP71GrN3m1uALAs/tZ7lzLMVvKDHB//XmX2vYJphQR5kIuTW2rgQa+ru+Sty2OTr0e1+rGMe+/NxkekjyZH+fRXJGl+gkyqTg9lqPtdWm6ZyzXm8xVJuJIf8rDQxIJfPr1h4xlkksbyGSKhpRUiqNU13+zte9yY6oQv49arrXG90M8P8QPVFTQlH0dZEZSjI/avPhYo+xkydtW738do7AtAzTk7aih7qnfp5AyJbemChy1PWbLDk7GGmBQzltcL2W5PZ3j6d0Jfuy06PgKU/cKGMyUHQBmSg6GEUELVQR30hlh0hkBYGnL5d23PYIwRKzutHQiMykioQghEAIWfx6w2WgRKI3WkV9rjWlIglBFOkiUh4ZQ67hvUeOuFm1W6keAjtQaxzp+SBgXNQcHNWilvEU2neLQPbsgA6Tg8vVgptD7+bz9D8Hb+X4S9sQHAAAAAElFTkSuQmCC)';

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
	/http:\/\/dl\.free\.fr\/[^\"\r\n< ]+/g,
	/http:\/\/(\w+\.)?uploadstation\.com\/file\/[^\"\r\n< ]+/g,
	/http:\/\/(\w+\.)?duckload\.com\/(download|dl|play)\/[^\/\"\r\n< ]+/g,
	/http:\/\/(\w+\.)?netload\.in\/[^\"\r\n< ]+/g,
	/http:\/\/(\w+\.)?wupload\.com\/file\/[^\"\r\n< ]+/g,
	/http:\/\/(\w+\.)?4shared\.com\/[a-z]+\/[^( |"|>|<|\r\n\|\n|$)]+/g,
	/http:\/\/(\w+\.)?filefactory\.com\/file\/[0-9a-zA-Z]+\//g,
	/http:\/\/(\w+\.)?oron\.com\/[^\"\r\n< ]+/g,
	/http:\/\/(\w+\.)?megashares\.com\/(dl\/[0-9a-zA-Z]+\/[^( |"|>|<|\r\n\|\n|$)]+|[0-9a-zA-Z?\/=]+)/g,   
	/http:\/\/(\w+\.)?transitfiles.com\/dl\/[0-9a-zA-Z]{8}/g,
	/http:\/\/(\w+\.)?bitshare\.com\/(files\/[^( |"|>|<|\r\n\|\n|$)]+|\?f=[^( |"|>|<|\r\n\|\n|$)]+)/g,
	/http:\/\/(\w+\.)?(easy-share|crocko)\.com\/[0-9]{10}\//g,
	/http:\/\/(\w+\.)?uploadbox\.com\/([a-zA-Z]+\/)?files\/[0-9a-z]+[^( |"|>|<|\r\n\|\n|$)]+/g,
	/http:\/\/(www\.)?purevid\.com\/v\/[^( |"|>|<|\r\n\|\n|$)]+/g,
	/http:\/\/(www\.)?(uploadhere|uploadking|jumbofiles)\.com\/[^( |"|>|<|\r\n\|\n|$)]+/g	,
	/http:\/\/(\w+\.)?freakshare\.(net|com)\/files\/[0-9a-zA-Z]+\/[^( |"|>|<|\r\n\|\n|$)]+/g,
	/http:\/\/(www\.)?uptobox\.com\/[^( |"|>|<|\r\n\|\n|$)]+/g,
	/(http):\/\/(([0-9a-zA-Z]+)\.)?1fichier\.com\//g,
	/http:\/\/(\w+\.)?bayfiles\.com\/([a-zA-Z]+\/)?file\/[^\"\r\n< ]+/g,
	/http:\/\/(\w+\.)?extabit\.com\/file\/[0-9a-zA-Z]+/g,
	/(http):\/\/(\w+\.)?filepost\.com\/(files\/[^\"\r\n< ]+|#!download[^\"\r\n< ]+)/g,
	/http:\/\/(\w+\.)?gigasize\.com\/(get)\/[^\/\"\r\n< ]+/g,
	/http:\/\/(\w+\.)?letitbit\.net\/(download)\/[^\/\"\r\n< ]+/g,
	/http:\/\/(\w+\.)?purevid\.com\/(v)\/[^\/\"\r\n< ]+/g,
	/http:\/\/(\w+\.)?(turbobit.net|uploadboost.com|queenshare.com)\/[0-9a-zA-Z]+/g
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

var ContextButton = function(){
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
				var links = (_linkFounds.toString().trim()).split(",")
				var len;
				var link;
				for(var i=0, len=links.length; i<len; i++)
				{
					link = links[i];
					console.log("length:" + len);
					self.port.emit("generateLink", [link,"",len,i]);
				}
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
			(window.getSelection().toString().trim() == ''))
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
		if ((selectedText.trim() != '') && (!checkMouseStatus || mouseStatus.pressedAndMoved))
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