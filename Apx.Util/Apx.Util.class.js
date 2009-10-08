/**
 * Aphex Utility Class - Bridge between jQuery and Prototype
 *
 * @package Aphex Toolkit
 * @author  
 * @version	1.0
 * @see http://toolkit.aphexcreations.net
 * @created 2008-01-01
 * @copyright
 *
 *  Copyright 2007,2008 
 *
 * @license
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU Affero General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU Affero General Public License for more details.
 *
 *   You should have received a copy of the GNU Affero General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

if(!window.Apx) {alert('Apx.class.js is required.');}

Apx.Util = new Object;

/**
 * Creates a stylesheet
 * @param {String} url
 * @return {StylesheetElement}
 */
Apx.Util.ss = function(url) {
 var st, s;
	if(document.createStyleSheet) {
		if(url){
		 s = document.createStyleSheet(url);
		}
		else {
		 s = document.createStyleSheet();		
		}
	}
	else {
		if(url) {
		 st = document.createElement('link');
		 st.setAttribute('rel', 'stylesheet');
		 st.setAttribute('href', url);	
		}
		else {
		 st = document.createElement('style');
		 st.setAttribute('type', 'text/css');
		}
	 document.getElementsByTagName('head')[0].appendChild(st);
	 s = document.styleSheets[document.styleSheets.length - 1];
	}
 return s;
}

/**
 * Get element by ID
 * @param {Object} elmid
 * @return {HTMLElement}
 */
Apx.Util.i = function(elm) {
	if(elm.nodeName) {
	 return elm;
	}
	else {
	 return document.getElementById(elm);
	}
}

/**
 * get mouse event coords
 * @param {Object[Event]} e
 * @return {Object}
 * @returnparam {Int} x
 * @returnparam {Int} y
 */
Apx.Util.coords = function(e) {
	if(Apx.Core.tk.Prototype) {
	 return {
		x : Event.pointerX(e),
		y : Event.pointerY(e)
	 };
	}
	else if(Apx.Core.tk.JQuery) {
	 return {
		x : e.pageX,
		y : e.pageY
	 };	
	}
}

/**
 * Hide effect
 * @param {HTMLElement} elm
 * @param {Function} callback
 * 		Optional.
 * @return {Bool}
 */
Apx.Util.hide = function(elm, callback) {
	if(Apx.Core.tk.Prototype) {
		if(callback){
		 Effect.SlideUp(elm,{
		 	afterFinish : callback
		 });
		}
		else {
		 Effect.SlideUp(elm);			
		}
	}
	else if(Apx.Core.tk.JQuery) {
		if(callback){
		 jQuery(elm).hide('slow', callback);
		}
		else {
		 jQuery(elm).hide('slow');
		}
	}
 return true;
}

/**
 * Gets scroll offset
 * @return {Object}
 * @returnparam {Int} x
 * @returnparam {Int} y
 */
Apx.Util.scrollOffset = function(){
 var s;
	if(Apx.Core.tk.Prototype) {
	 s = document.viewport.getScrollOffsets();
	 return {
	 	x : s.left,
		y : s.top
	 };
	}
	else if(Apx.Core.tk.JQuery) {
		if(
			document.body.scrollLeft !== undefined &&
			document.body.scrollTop !== undefined
		) {
		 return {
		 	x : document.body.scrollLeft,
			y : document.body.scrollTop
		 };
		}
		if(
			window.pageXOffset !== undefined &&
			window.pageYOffset !== undefined
		) {
		 return {
		 	x : window.pageXOffset,
			y : window.pageYOffset
		 };
		}
	}
}

/**
 * Get target element for a mouse event
 * @param {Object[Event]} e
 * @return {HTMLElement}
 */
Apx.Util.toElm = function(e) {
 var t;
	if(window.event && window.event.toElement) {
	 t = window.event.toElement;
	}
	else if(e.relatedTarget) {
	 t = e.relatedTarget;
	}
 return t;
}

/**
 * HTML String insertion
 * @param {HTMLElement} elm
 * @param {String} str
 * @param {String} w
 * 		Can be 'top' or 'before'
 * @return {HTMLElement}
 */
Apx.Util.append = function(elm, str, w) {
 var e;
	if(Apx.Core.tk.Prototype) {
		if(w === 'top') {
		 e = new Insertion.Top(elm, str);
		 return elm.firstChild;
		}
		else if(w === 'before') {
		 e = new Insertion.Before(elm, str);
		 return elm.previous();
		}
	}
	else if(Apx.Core.tk.JQuery) {
	 e = jQuery(str);
		if(w === 'top') {
		 jQuery(elm).append(e);
		}
		else if(w === 'before') {
		 jQuery(elm).prepend(e);
		}
	 return e;
	}
}

/**
 * Builds an html element from a string
 * @param {String} str
 * @return {HTMLElement}
 */
Apx.Util.makeElement = function(str) {
 var d, e, n;
	if(Apx.Core.tk.Prototype) {
	 d = document.createElement('div');
	 e = new Insertion.Top(d, str);
	 n = e.element.firstChild.cloneNode(false);
	 delete d;
	 return n;
	}
	else if(Apx.Core.tk.JQuery) {
	 return jQuery(str);
	}
}

/**
 * Replaces data arguments
 * @param {String} str
 * @param {Object} args
 * @return {String}
 */
Apx.Util.getData =
Apx.Util.data = function(str, args) {
 var key, val, out;
 out = str;
	for(arg in args) {
	 key = new RegExp("\{" + arg + "\}", "ig");
	 out = out.replace(key, args[arg]);
	}
 return out;
}

/**
 * Determines if an event is within view of an element
 * @param {Object[Event]} e
 * @param {HTMLElement} elm
 * @return {Bool}
 */
Apx.Util.mouseInElementView = function(e, elm) {
 var c;
 c = Apx.Util.coords(e);
 p = Apx.Util.elementCoords(elm);
	if(
		c.x < p.x ||
		c.x > (p.x + p.w) ||
		c.y < p.y ||
		c.y > (p.y + p.h)
	) {
	 return false;
	}
	else {
	 return true;
	}
}

/**
 * CSS Selector wrapper
 * @param {String} str
 * @param {HTMLElement} root
 * 		Optonal. Root element.
 * @return {HTMLElement}
 */
Apx.Util.selector = function(str, root) {
	if(Apx.Core.tk.Prototype) {
		if(root) {
		 return $(root).getElementsBySelector(str);
		}
		else {
		 return $$(str);
		}
	}
	else if(Apx.Core.tk.JQuery) {
		if(root) {
		 return jQuery(str, root);
		}
		else {
		 return jQuery(str);
		}
	}
}

/**
 * Listener for domload
 * @param {Function} cb
 * @return {Bool}
 */
Apx.Util.domload = function(cb) {
	if(Apx.Core.tk.Prototype) {
	 Apx.Util.listen(window, 'load', cb);
	}
	else if(Apx.Core.tk.JQuery) {
	 jQuery(cb);
	}
 return true;
}

/**
 * Stop an event listenr
 * @param {HTMLElement} elm
 * @param {String} action
 * @param {Function} cb
 * @return {Bool}
 */
Apx.Util.stopListen = function(elm, action, cb) {
	if(Apx.Core.tk.Prototype) {
	 Event.stopObserving(elm, action,cb);
	}
	else if(Apx.Core.tk.JQuery) {
	 jQuery(elm).unbind(action, cb);
	}
 return true;
}

/**
 * Determines if element is descendant
 * @param {Object} child
 * @param {Object} parent
 * @return {Bool}
 */
Apx.Util.isDescendant = function(child, parent) {
 var s;
	if(Apx.Core.tk.Prototype) {
	 return $(child).descendantOf(parent);
	}
	else if(Apx.Core.tk.JQuery) {
	 s = false;
		jQuery(child).parents(parent.tagName).each(function(){
			if(this === parent) {
			 s = true;
			 return false;
			}
		});
	 return s;
	}
}

/**
 * Get the event element
 * @param {Object[Event]} e
 * @param {Bool} real
 *		Whether or not to get the actual element
 * @return {HTMLElement}
 */
Apx.Util.eventElement = function(e, real) {
 var evt;
	if(e) {
	 evt = e;
	}
	else if(window.event) {
	 evt = window.event;
	}
	if(real) {
		if(evt.fromElement) {
		 return evt.fromElement;
		}
		else if(evt.currentTarget) {
		 return evt.currentTarget;
		}
	}
	else {
		if(evt.srcElement) {
		 return evt.srcElement
		}
		else if(evt.target) {
		 return evt.target;
		}
	}
 return null;
}

/**
 * Kill an event.
 * @param {Object[Event]} e
 * @return {Bool}
 */
Apx.Util.killEvent = function(e){
	if(Apx.Core.tk.Prototype) {
	 Event.stop(e);
	}
	else if(Apx.Core.tk.JQuery) {
	 e.stopPropagation();
	}
 return true;
}

/**
 * Adds css class
 * @param {HTMLElement} elm
 * @param {String} c
 * @return {Bool}
 */
Apx.Util.addClass = function(elm, c) {
	if(Apx.Core.tk.Prototype) {
	 $(elm).addClassName(c)
	}
	else if(Apx.Core.tk.JQuery) {
	 jQuery(elm).addClass(c);
	}
 return true;
}

/**
 * Removes css class
 * @param {Object} elm
 * @param {Object} c
 * @return {Bool}
 */
Apx.Util.removeClass = function(elm, c) {
	if(Apx.Core.tk.Prototype) {
	 $(elm).removeClassName(c)
	}
	else if(Apx.Core.tk.JQuery) {
	 jQuery(elm).removeClass(c);
	}
}

/**
 * Get coordinates of an element
 * @param {HTMLElement} elm
 * @return {Object}
 * @returnprop {Int} x
 * @returnprop {Int} y
 * @returnprop {Int} w
 * @returnprop {Int} h
 */
Apx.Util.elementCoords = function(elm) {
 var o;
	if(Apx.Core.tk.Prototype) {
	 o = Position.cumulativeOffset(elm);
	 elm = $(elm);
	 return {
		x : o[0],
		y : o[1],
		w : elm.getWidth(),
		h : elm.getHeight()
	 };
	}
	else if(Apx.Core.tk.JQuery) {
	 elm = jQuery(elm);
	 o = elm.offset();
	 return {
		x : o.left,
		y : o.top,
		w : elm.width(),
		h : elm.height()
	 };
	}
}

/**
 * Set up an event listener
 * @param {HTMLElement} elm
 * @param {String} action
 * @param {Function} cb
 * @return {Bool}
 */
Apx.Util.listen = function(elm, action, cb) {
	if(Apx.Core.tk.Prototype) {
	 Event.observe(elm, action, cb);
	}
	else if(Apx.Core.tk.JQuery) {
	 jQuery(elm).bind(action, cb);
	}
 return true;
}

/**
 * Get the text within an element
 * @param {HTMLElement} elm
 * @return {String}
 */
Apx.Util.getText = function(elm) {
	if(Apx.Core.tk.Prototype) {
		if(elm.innerText) {
		 return elm.innerText;
		}
		else if(elm.textContent) {
		 return elm.textContent;
		}
	}
	else if(Apx.Core.tk.JQuery) {
	 return jQuery(elm).text();
	}
}

/**
 * Converts UBB style tags to HTML tags
 * @param {String} str
 * @return {String}
 */
Apx.Util.replaceTags = function(str) {
 str = new String(str);
 str = str.replace( /\[\[([\s\S]+?)\]\]/g, "<$1>" );
 return str;
}

/**
 * Get first child that is an element
 * @param {HTMLElemen} elm
 * @return {HTMLElement}
 */
Apx.Util.first = function(elm) {
	if(Apx.Core.tk.Prototype) {
	 return $(elm).firstDescendant();
	}
	else if(Apx.Core.tk.JQuery) {
	 return jQuery("*:first-child", elm)[0];
	}
}

/**
 * Get child elements
 * @param {HTMLElement} elm
 * @return {Array[HTMLElement]}
 */
Apx.Util.kids = function(elm) {
	if(Apx.Core.tk.Prototype) {
	 return $(elm).childElements();
	}
	else if(Apx.Core.tk.JQuery) {
	 return
		jQuery(elm).children().map(function(){
	 	 return this[0];
		});
	}
}

/**
 * Gets arguments from a html class attribute
 * @param {HTMLElement} elm
 * @return {Array}
 */
Apx.Util.classArgs = function(elm) {
 var list, i, _i, o, s;
	if( !(p = elm.className.match(/args:([a-z0-9:]+)/) ) ) {
	 return false;
	}
 o = [];
 list = p[1].toString().split(':');
	for(i = 0, _i = list.length; i < _i; i++) {
	 s = null;
		if(list[i] === '') {
		 continue;
		}
		else if(!isNaN(list[i])) {
		 s = parseInt(list[i]);
		}
		else {
		 s = list[i];
		}
	 o[o.length] = s;
	}
 return o;
}

/**
 * Used to extend default args in a function
 * @param {Object} args1
 * @param {Object} args2
 * @return {Object}
 */
Apx.Util.args = function(args1, args2) {
 var h;
	if(Apx.Core.tk.Prototype) {
	 return $H(args2).update(args1)._object;
	}
	else if(Apx.Core.tk.JQuery) {
	 return jQuery.extend(args2, args1);
	}
}

/**
 * Build a range
 * @param {Number} r1
 * @param {Number} r2
 * @return {Array}
 */
Apx.Util.makeRange = function(r1,r2) {
 var r, i;
	if(Apx.Core.tk.Prototype) {
	 return $R(r1,r2);
	}
	else if(Apx.Core.tk.JQuery) {
	 r = new Array;
		for(i = r1; i <= r2; i++) {
		 r[r.length] = i;
		}
	 return r;
	}
}

/**
 * Wrapper for an AJAX request
 * @param {String} url
 * @param {Object} options
 * @paramprop options {String} method
 * @paramprop options {Object} parameters
 * @paramprop options {Function} onSuccess
 * @paramprop options {Function} onFailure
 * @return {Bool}
 */
Apx.Util.ajax = function(url, options) {
 var o;
 o = {};
	if(Apx.Core.tk.Prototype) {
		if(options.method !== undefined)		o.method = options.method;
		if(options.parameters !== undefined)	o.parameters = options.parameters;
		if(options.onSuccess !== undefined)		o.onSuccess = function(transport) { options.onSuccess(transport.responseText) };
		if(options.onFailure !== undefined)		o.onFailure = function(transport) { options.onFailure(transport.responseText) };
	 new Ajax.Request(url, o);
	}
	else if(Apx.Core.tk.JQuery) {
	 o.url = url;
		if(options.method !== undefined)		o.type = options.method;
		if(options.parameters !== undefined)	o.data = options.parameters;
		if(options.onSuccess !== undefined)		o.success = function(data) { options.onSuccess(data) };
		if(options.onFailure !== undefined)		o.error = function(data) { options.onFailure(data) };
	 jQuery.ajax(o);
	}
 return true;
}

/**
 * Recursively clone any data type
 * @param {Any} arr
 * @return {Any}
 */
Apx.Util.clone = function(arr) {
 var i, _i, temp;
	if( typeof arr !== 'object' ) {
	 return arr;
	}
	else {
		if(arr.concat) {
		 temp = [];
			for(i = 0, _i = arr.length; i < _i; i++) {
			 temp[i] = arguments.callee(arr[i]);
			}
		}
		else {
		 temp = {};
			for(i in arr) {
			 temp[i] = arguments.callee(arr[i]);
			}		
		}
	 return temp;
	}
}

/**
 * Get size of array or object
 * @param {Object,Array} arr
 * @return {Int}
 */
Apx.Util.size = function(arr) {
 var temp, i;
 temp = 0;
	if(arr.concat) {
	 temp = arr.length;
	}
	else {
		for(i in arr) {
		 temp++;
		}		
	}
 return temp;
}

/**
 * Empty function
 */
Apx.Util.emptyFunction = function(){
 //nothing
}

/**
 * Gets random value
 * @param {Int} max
 * return {Int}
 */
Apx.Util.ran = function(max) {
 return Math.round(Math.random() * max);
}

/**
 * Writes an error message
 * @param {String} url
 * @param {String} text
 * @return {Bool}
 */
Apx.Util.handleError = function(url, text) {
 alert( "[" + url + "] -- An error occurred: " + text + " -- Please check FireBug console for more details." );
 return true;
}

/**
 * Writes a string an element or adds an element to an element.
 * TODO: Consider the possibiity of using a library here.
 * 
 * @param {HTMLElement} thisElm
 * @param {Any} adder
 * 		This can either be a string of text or an HTML Element to be added
 * @return {Bool}
 * 
 */
Apx.Util.writeText = function( thisElm, adder ) {
	//Because speed is a consideration, we will manually check if its a string
	if( thisElm.charAt ) {
	 thisElm = document.getElementById(thisElm);
	}
	/*
	 * String
	 */
	if(
		(adder.nodeName && adder.nodeName === '#text') ||
		adder.charAt != undefined ||
		!isNaN(adder))
	{
		/*
		 * Text nodes
		 */
		if(adder.nodeValue !== undefined) {
		 adder = adder.nodeValue;
		}
		/*
		 * HTML String 
		 */
		if(adder.toString().match(/<[^>]+>/mi)) {
		 Apx.Util.empty(thisElm);
		 Apx.Util.append(thisElm, adder.toString(), 'top');
		}
		/*
		 * Text String 
		 */
		else {
			if( thisElm.firstChild ) {
				//Currently has a non string, so we need to remove it
				if(thisElm.firstChild.charAt == undefined && isNaN(thisElm.firstChild)) {
				 Apx.Util.empty(thisElm);
				 thisElm.appendChild( document.createTextNode( adder ) );				 
				}
				//Currently has text string
				else {
				 thisElm.firstChild.replaceData( 0 , thisElm.firstChild.length , adder );
				}
			}
			//Currently has no text
			else {
			 thisElm.appendChild( document.createTextNode( adder ) );
			}			
		}
	}
	/*
	 * HTML Element 
	 */
	else if(adder.nodeName != undefined) {
	 //_adder = adder.cloneNode(true);
	 _adder = adder;
	 Apx.Util.empty(thisElm);
	 thisElm.appendChild(_adder);
	}
 return true;
} 

/**
 * Emptys an element
 * 
 * @param {HTMLElement} elm
 * @return {Bool}
 * 
 */	
Apx.Util.empty = function(elm) {
	//Because speed is a consideration, we will manually check if its a string
	if( elm.charAt ) {
	 elm = document.getElementById(elm);
	}
	while( elm.firstChild ) {
	 elm.removeChild( elm.firstChild );
	}
 return true;
} 

/**
 * Converts a string to JSON
 * 
 * @param {String} text
 * @return {Object}
 * 
 */	
Apx.Util.getJSON = function(text) {
	try {
	 data = eval( "(" + text + ")" );
	 return data;
	}
	catch(e) {
	 return false;	
	}
}

/**
 * Helper/Wrapper for the Date object
 * 
 * @param {Object} options
 * @paramprop options {Int} month(false)
 * @paramprop options {Int} year(false)
 * @paramprop options {Int} monthOffset(0)
 * @return {Object}
 * @returnprop {Int} indexMonth
 * @returnprop {Int} humanMonth
 * @returnprop {Int} year
 */
Apx.Util.setupDate = function(options) {
 options = Apx.Util.args(options, {
	month : false ,
	humanMonth : false,
	year : false ,
	monthOffset : 0
 });
 theDate = new Date;
 //this is needed for a wierd firefox date quirk
 theDate.setDate(1);
 theDate.setHours(0,0,0,0);
	//year must be set before month
	if(options.year !== false ) {
 	 theDate.setFullYear(options.year);
	}
	if( options.month !== false ) {
  	 theDate.setMonth(options.month);
 	}
	else if( options.humanMonth !== false ) {
  	 theDate.setMonth(options.humanMonth-1);
	}
 theDate.setMonth(theDate.getMonth() + options.monthOffset);
 theIndexMonth = theDate.getMonth();
 theHumanMonth = theIndexMonth + 1;
 theYear = theDate.getFullYear();
 theSeconds = theDate.getTime();
 return {
 	indexMonth : theIndexMonth,
	humanMonth : theHumanMonth,
	year : theYear,
	seconds : theSeconds
 };
}

/**
 * Formats the number.
 * 
 * @param {Number} valText
 * @param {Int} floatPrecision 
 * @return {Number}
 *		If input is not a number, this will return a 0
 * 
 */	
 Apx.Util.formatNumber = function(valText, floatPrecision) {
	//round it if we need to
	if(!isNaN(floatPrecision) && floatPrecision !== false && !isNaN(valText)) {
	 valText = parseFloat(valText).toFixed(floatPrecision);
	}
	else {
	 valText = 0;
	}
 return valText;
}

/**
 * Trims whitespace from front and back
 * @param {String} str
 * @return {String}
 */
Apx.Util.trim = function(str) {
 return str.replace( /^\s+|\s+$/g, "" );
}

/**
 * Makes a link.
 * 
 * @param {String} text
 * @param {String} href
 * @return {String}
 * 
 */
Apx.Util.anchor = function(text, href) {
 a = document.createElement('a');
 a.appendChild(document.createTextNode(text));
 a.setAttribute('href', href);
 return a;
}
