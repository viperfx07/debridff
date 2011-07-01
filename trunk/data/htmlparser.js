function HTMLParser(aHTMLString){
  var html = document.implementation.createDocument("http://www.w3.org/1999/xhtml", "html", null),
    body = document.createElementNS("http://www.w3.org/1999/xhtml", "body");
  html.documentElement.appendChild(body);

  body.appendChild(Components.classes["@mozilla.org/feed-unescapehtml;1"]
    .getService(Components.interfaces.nsIScriptableUnescapeHTML)
    .parseFragment(aHTMLString, false, null, body));

  return body;
}

/*
function HTMLParser(HTMLstring)
{
	var docBody = document.body || document.documentElement;
	if (!docBody) return;

	if (document.createRange && (rangeObj = document.createRange())){
		var docFrag, rangeObj;
		rangeObj.selectNode(docBody);

		if ( rangeObj
		&& rangeObj.createContextualFragment
		&& (docFrag = rangeObj.createContextualFragment(HTMLstring))){
		return docFrag;
		}
	} else if (
	'string' == typeof docBody.innerHTML
	&& document.createElement
	&& document.createDocumentFragment)
	{
		var div = document.createElement('div');
		var docFrag = document.createDocumentFragment();
		div.innerHTML = HTMLstring;

		while (div.firstChild){
		docFrag.appendChild(div.firstChild)
		};

		return docFrag;
	}

	return null;
}
*/