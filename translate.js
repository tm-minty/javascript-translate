var Dictionary = function(dictionary){
	var dict = dictionary;

	dict.has = function(type, element){
		for( var i = this.length; i--; ){
			if( this[i][type] == element )
				return i + 1;
		};
		return false;
	};

	dict.translate = function(type, text){
		var i = this.has(type, text);
		if( i ){
			return this[i - 1];
		}
	}

	return dict;
};

var Translate = function(dictionary){
	var elements = document.body.getElementsByTagName('*');
	var textNodes = [];
	var dictionary = dictionary;

	for( var i = elements.length; i--; ){
		if( elements[i].nodeName in {	// Ignore Script and Link elements
				"SCRIPT": "",
				"LINK": ""
			} )
			continue;
		var childs = elements[i].childNodes;
		if( childs.length ){
			for(var j = childs.length; j--; ){	
				if( childs[j].nodeType == 3 ){
					textNodes.push(childs[j]);
				};
			};
		};
	};

	var clear = function(word){
		return word.replace( /[,\.-:_"']/gi, '');
	};

	this.words = function(from, to){
		for( var i = textNodes.length; i--; ){
			var node = textNodes[i];
			var text = node.textContent;
			var words = text.split(' ');
			for( var w = words.length; w--; ){
				var word = words[w];
				if( dictionary.has(from, clear(word)) )
					words[w] = word.replace( clear(word), dictionary.translate(from, clear(word))[to] );
			};
			node.textContent = words.join(' ');
		};
		return this;
	};

	this.phrases = function(from, to){
		for( var i = textNodes.length; i--; ){
			var node = textNodes[i];
			var text = node.textContent;
			for( var d = dictionary.length; d--; ){
				text = text.replace( dictionary[d][from], dictionary[d][to]);
			};
			node.textContent = text;
		}
		return this;
	};

	this.attributes = function(from, to){ // Translate value and placeholder attributes in INPUT nodes
		for( var i = elements.length; i--; ){
			var element = elements[i];
			if( element.nodeName == 'INPUT' ){
				if( element.hasAttribute('value') ){
					for( var d = dictionary.length; d--; ){
						element.value = element.value.replace( dictionary[d][from], dictionary[d][to]);
					};
				}else if( element.hasAttribute('placeholder') && typeof element.placeholder != 'undefined' ){
					for( var d = dictionary.length; d--; ){
						element.placeholder = element.placeholder.replace( dictionary[d][from], dictionary[d][to]);
					};
				};
			};
		};
		return this;
	};

	return this;
};