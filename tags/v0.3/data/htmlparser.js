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