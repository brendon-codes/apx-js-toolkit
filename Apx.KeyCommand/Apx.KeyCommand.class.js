/**
 * KeyCommander - The comprehensive key handling library.
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

Apx.KC = new Object;

Apx.KC.stackWiper = null;

Apx.KC.keyStack = {};

Apx.KC.listeners = [];

Apx.KC.p = {
	o : {
		osx : false,
		win : false
	},
	b : {
		gecko : false,
		webkit : false,
		opera : false,
		ie : false
	}
};

/**
 * PLATFORM SPECIFIC NOTES
 * Firefox/OSX
 *		unfixable:
 *			no alt+e
 *			no alt+i
 *			no alt+n
 *			no alt+u
 *			cannot stack printable characters with alt
 *			cannot stack more than 5 printable characters
 *			ctrl with any number will not register multiple times on keypress
 *			cannot properly detect ctrl+semicolon
 *		fixed:
 *			any printable character used with alt will not register a valid keyup
 *
 * Firefox/Win
 *		fixed:
 *			alt with any other key will not register a keyup
 */
 Apx.KC.map = {
	'ESC' : { v : '[Esc]', p : false, k : 27, s : [], c : [] },
	'F1' : { v : 'F1', p : false, k : 112, s : [], c : [] },
	'F2' : { v : 'F2', p : false, k : 113, s : [], c : [] },
	'F3' : { v : 'F3', p : false, k : 114, s : [], c : [] },
	'F4' : { v : 'F4', p : false, k : 115, s : [], c : [] },
	'F5' : { v : 'F5', p : false, k : 116, s : [], c : [] },
	'F6' : { v : 'F6', p : false, k : 117, s : [], c : [] },
	'F7' : { v : 'F7', p : false, k : 118, s : [], c : [] },
	'F8' : { v : 'F8', p : false, k : 119, s : [], c : [] },
	'F9' : { v : 'F9', p : false, k : 120, s : [], c : [] },
	'F10' : { v : 'F10', p : false, k : 121, s : [], c : [] },
	'F11' : { v : 'F11', p : false, k : 122, s : [], c : [] },
	'F12' : { v : 'F12', p : false, k : 123, s : [], c : [] },
	'TICK' : { v : '`', p : true, k : 192, s : [], c : [ 96, 126 ] },
	'HYPHEN' : { v : '-', p : true, k : 45, s : [], c : [ 95, 8211, 8212 ] },
	'PLUS' : { v : '+', p : true, k : 43, s : [], c : [ 177 ] },
	'BACKSPACE' : { v : '[BckSpce]', p : false, k : 8, s : [], c : [] },
	'DELETE' : { v : '[Del]', p : false, k : 46, s : [], c : [] },
	'TAB' : { v : '[Tab]', p : false, k : 9, s : [], c : [] },
	'BRACKET_LEFT' : { v : '[', p : true, k : 219, s : [], c : [ 91, 27, 123, 8220, 8221 ] },
	'BRACKET_RIGHT' : { v : ']', p : true, k : 221, s : [], c : [ 93, 29, 125, 8216, 8217 ] },
	'SLASH_BACK' : { v : '\\', p : true, k : 220, s : [], c : [ 92, 28, 124, 171, 187 ] },
	'ARROW_UP' : { v : '[ArrowUp]', p : false, k : 38, s : [], c : [] },
	'ARROW_DOWN' : { v : '[ArrowDn]', p : false, k : 40, s : [], c : [] },
	'ARROW_LEFT' : { v : '[ArrowLt]', p : false, k : 37, s : [], c : [] },
	'ARROW_RIGHT' : { v : '[ArrowRt]', p : false, k : 39, s : [], c : [] },
	'SHIFT' : { v : '[Shift]', p : false, k : 16, s : [], c : [] },
	'CONTROL' : { v : '[Ctrl]', p : false, k : 17, s : [], c : [] },
	'ALT' : { v : '[Alt]', p : false, k : 18, s : [], c : [] },
	'COMMAND' : { v : '[CMD]', p : false, k : 224, s : [], c : [] },
	'A' : { v : 'a', p : true, k : 65, s : [], c : [ 65, 97, 229, 197 ] },
	'B' : { v : 'b', p : true, k : 66, s : [], c : [ 66, 98, 8747, 305 ] },
	'C' : { v : 'c', p : true, k : 67, s : [], c : [ 67, 99, 231, 199 ] },
	'D' : { v : 'd', p : true, k : 68, s : [], c : [ 68, 100, 8706, 206 ] },
	'E' : { v : 'e', p : true, k : 69, s : [], c : [ 69, 101, 180 ] },
	'F' : { v : 'f', p : true, k : 70, s : [], c : [ 70, 102, 402, 207 ] },
	'G' : { v : 'g', p : true, k : 71, s : [], c : [ 71, 103, 169, 733 ] },
	'H' : { v : 'h', p : true, k : 72, s : [], c : [ 72, 104, 729, 211 ] },
	'I' : { v : 'i', p : true, k : 73, s : [], c : [ 73, 105, 710 ] },
	'J' : { v : 'j', p : true, k : 74, s : [], c : [ 74, 106, 8710, 212 ] },
	'K' : { v : 'k', p : true, k : 75, s : [], c : [ 75, 107, 730, 63743 ] },
	'L' : { v : 'l', p : true, k : 76, s : [], c : [ 76, 108, 172, 210 ] },
	'M' : { v : 'm', p : true, k : 77, s : [], c : [ 77, 109, 181, 194 ] },
	'N' : { v : 'n', p : true, k : 78, s : [], c : [ 78, 110, 732 ] },
	'O' : { v : 'o', p : true, k : 79, s : [], c : [ 79, 111, 248, 216 ] },
	'P' : { v : 'p', p : true, k : 80, s : [], c : [ 80, 112, 960, 8719 ] },
	'Q' : { v : 'q', p : true, k : 81, s : [], c : [ 81, 113, 339, 338 ] },
	'R' : { v : 'r', p : true, k : 82, s : [], c : [ 82, 114, 174, 8240 ] },
	'S' : { v : 's', p : true, k : 83, s : [], c : [ 83, 115, 223, 205 ] },
	'T' : { v : 't', p : true, k : 84, s : [], c : [ 84, 116, 8224, 711 ] },
	'U' : { v : 'u', p : true, k : 85, s : [], c : [ 85, 117, 168 ] },
	'V' : { v : 'v', p : true, k : 86, s : [], c : [ 86, 118, 8730, 9674 ] },
	'W' : { v : 'w', p : true, k : 87, s : [], c : [ 87, 119, 8721, 8222 ] },
	'X' : { v : 'x', p : true, k : 88, s : [], c : [ 88, 120, 8776, 731 ] },
	'Y' : { v : 'y', p : true, k : 89, s : [], c : [ 89, 121, 165, 193 ] },
	'Z' : { v : 'z', p : true, k : 90, s : [], c : [ 90, 122, 937, 184 ] },
	'EQUAL' : { v : '=', p : true, k : 61, s : [ 221 ], c : [ 61, 8800 ] },
	'SPACE' : { v : '[SpaceBar]', p : false, k : 32, s : [ 192 ], c : [ 32, 160 ] },
	'ONE' : { v : '1', p : true, k : 49, s : [ 81 ], c : [ 49, 33, 161, 8260 ] },
	'TWO' : { v : '2', p : true, k : 50, s : [ 82 ], c : [ 50, 64, 8482, 8364 ] },
	'THREE' : { v : '3', p : true, k : 51, s : [ 83 ], c : [ 51, 35, 164, 8249 ] },
	'FOUR' : { v : '4', p : true, k : 52, s : [ 84 ], c : [ 52, 36, 162, 8250 ] },
	'FIVE' : { v : '5', p : true, k : 53, s : [ 85 ], c : [ 53, 37, 8734, 64257 ] },
	'SIX' : { v : '6', p : true, k : 54, s : [ 86 ], c : [ 54, 94, 167, 64258 ] },
	'SEVEN' : { v : '7', p : true, k : 55, s : [ 87 ], c : [ 55, 38, 182, 8225 ] },
	'EIGHT' : { v : '8', p : true, k : 56, s : [ 88 ], c : [ 56, 42, 8226, 176 ] },
	'NINE' : { v : '9', p : true, k : 57, s : [ 89 ], c : [ 57, 40, 170, 183 ] },
	'ZERO' : { v : '0', p : true, k : 48, s : [ 80 ], c : [ 48, 41, 186, 8218 ] },
	'SEMICOLON' : { v : ';', p : true, k : 59, s : [ 219 ], c : [ 59, 58, 8230, 218 ] },
	'QUOTE_SINGLE' : { v : '\'', p : true, k : 222, s : [ 71 ], c : [ 39, 34, 230, 198 ] },
	'RETURN' : { v : '[Return]', p : false, k : 13, s : [ 77, 67 ], c : [] },
	'COMMA' : { v : ',', p : true, k : 188, s : [ 76 ], c : [ 44, 60, 8804, 175 ] },
	'PERIOD' : { v : '.', p : true, k : 190, s : [ 78 ], c : [ 46, 62, 8805, 728 ] },
	'SLASH_FORWARD' : { v : '/', p : true, k : 191, s : [ 79 ], c : [ 47, 63, 247, 191 ] }
};

/**
 * Initializer
 * @return {Bool}
 */
Apx.KC.init = function() {
 var nav;
 document.onkeypress = Apx.Util.emptyFunction;
 document.onkeydown = Apx.Util.emptyFunction;
 document.onkeyup = Apx.Util.emptyFunction;
 Apx.Util.listen( document, 'keypress', Apx.KC.process );
 Apx.Util.listen( document, 'keydown', Apx.KC.process );
 Apx.Util.listen( document, 'keyup', Apx.KC.process );
 nav = window.navigator.userAgent.toString();
	//browser
	if( window.opera ) {
	 Apx.KC.p.b.opera = true;
	}
	else if( nav.match(/(khtml|safari|webkit)/i) ) {
	 Apx.KC.p.b.webkit = true;
	}
	else if( nav.match(/gecko/i) ) {
	 Apx.KC.p.b.gecko = true;
	}
	else if( nav.match(/msie/i) ) {
	 Apx.KC.p.b.ie = true;
	}
	//os
	if( nav.match(/windows/i) ) {
	 Apx.KC.p.o.win = true;
	}
	else if( nav.match(/macintosh/i) ) {
	 Apx.KC.p.o.osx = true;
	}
 return true;
}

/**
 * Cant catch all the keys everytime, so we need to clear the stack
 * @return {Bool}
 */
Apx.KC.clearStack = function() {
	if( Apx.KC.stackWiper !== null ) {
	 window.clearTimeout( Apx.KC.stackWiper );
	}
 Apx.KC.stackWiper = window.setTimeout(function() {
  Apx.KC.keyStack = {};
 }, 30000);
 return true;
}

/**
 * Main processor for key input
 * @param {Object[event]} _
 */
Apx.KC.process = function(_) {
 var e, action, popper, exists, popper_first, popper_last;
	if(_) {
	 e = _;
	}
	else if(window.event) {
	 e = window.event;
	}
	else {
	 return true;
	}
 Apx.KC.clearStack();
 action = Apx.KC.getAction( e.keyCode, e.charCode );
	if(
		e.type === 'keydown' &&
		!action.printable &&
		action.found &&
		!Apx.KC.searchStack({name:action.name})
	) {
	 Apx.KC.pushStack(action.name, action);
	 Apx.KC.dispatch(action, 'down', e);
	}
	else if(e.type === 'keypress' && action.found) {
		if(!Apx.KC.searchStack({name:action.name})) {
		 Apx.KC.pushStack(action.name, action);
		 Apx.KC.dispatch(action, 'down', e);
		}
		else {
		 Apx.KC.dispatch(action, 'press', e);		 
		}
	}
	else if( e.type === 'keyup' ) {
		if( action.found ) {
		 popper = Apx.KC.searchStack( {keyCode:action.keyCode} );
		}
		else {
		 popper = Apx.KC.searchStack({position:'last'});
		}
	 Apx.KC.dispatch(action, 'up', e);
	 Apx.KC.popStack(popper.name);
	 	//ff-win alt bug
	 	//since we cant register a keyup for alt when it is ustacked below anther character,
	 	//we need to fake register the keyup when the key above it is registered
	 	//this is not a perfect implementation, but it works for the most part
	 	if( Apx.KC.p.o.win && Apx.KC.p.b.gecko ) {
	 	 popper_first = Apx.KC.searchStack({position:'first'});
	 	 popper_last = Apx.KC.searchStack({position:'last'});
	 		if(popper_last && popper_last.name === 'ALT') {
				if(
					(action.name === 'SHIFT' || action.name === 'CONTROL') ||
					(popper_first && popper_first.name === 'ALT')
				){
				 Apx.KC.dispatch(action, 'up', e);
				 Apx.KC.popStack('ALT');
				}
				else {
				 //nothing
				}
			}
	 	}
	}
}

/**
 * Api to register new keyset
 * @param {Array} _keys
 * @param {String} type
 * @param {Function} callback
 * @return {Bool}
 */
Apx.KC.register = function(_keys, type, callback) {
 //Need to clone the keys object, since JavaScript passes objects by reference.
 Apx.KC.listeners[Apx.KC.listeners.length] = {
 	keys : Apx.Util.clone(_keys),
 	type : type,
 	callback : callback
 };
 return true;
}

/**
 * Fires a simulated key event
 * @param {String} action
 * @param {String} type
 * @param {Object[event]} evt
 * @return {Bool}
 */
Apx.KC.dispatch = function(action, type, evt) {
 var i, _i, listener, item, listen_count, stack_count, cb_return, isType, k, _k, t, _t;
	for( i = 0, _i = Apx.KC.listeners.length; i < _i; i++ ) {
	 listener = Apx.KC.listeners[i];
	 item = null;
	 listen_count = 0;
	 stack_count = 0;
	 isType = false;
	 	//determine listener type
	 	if( (typeof listener.type).toLowerCase() !== 'string' ) {
	 		for( t = 0, _t = listener.type.length; t < _t; t++ ) {
	 			if( listener.type[t] === type ) {
	 			 isType = true;
	 			 break;
	 			}
	 		}
	 	}
	 	else if( listener.type === type ) {
	 	 isType = true;
	 	}
	 	if( isType ) {
			for( item in Apx.KC.keyStack ) {
				for( k = 0, _k = listener.keys.length; k < _k; k++ ) {
					if( listener.keys[k] === item ) {
					 listen_count++;
					}
				}
			 stack_count++;
			}
			//callback executer
			if(
				listen_count > 0 &&
				listen_count === stack_count &&
				listen_count === listener.keys.length
			) {
			 cb_return = listener.callback(action, type);
				if( !cb_return ) {
				 Apx.KC.killEvent(evt);
				 return false;
				}
				else {
				 return true;
				}
			}
		}
	}
 return true;
}

/**
 * Kills event
 * @param {Object[event]} evt
 * @return {Bool}
 */
Apx.KC.killEvent = function(evt) {
	if( evt.preventDefault ) {
	 evt.preventDefault();
	}
 return true;
}

/**
 * Pushes new key action onto stack
 * @param {String} name
 * @param {String} val
 * @return {Bool}
 */
Apx.KC.pushStack = function(name, val) {
 Apx.KC.keyStack[name] = val;
 return true;
}

/**
 * Searches stack for a given key action
 * @param {Object} options
 * @paramprop options {Array} names
 * @paramprop options {String} name
 * @paramprop options {Int} keycode
 * @return {Bool}
 */
Apx.KC.searchStack = function(options) {
 var i, _i, prop, item1, item2, s, _s;
 	//search array of names
	if( options.names !== undefined ) {
		for( i = 0, _i = options.names.length; i < _i; i++ ) {
			if( Apx.KC.keyStack[options.names[i]] !== undefined ) {
			 return true;
			}		
		}
	}
	//search single name
	else if(options.name !== undefined) {
		if( Apx.KC.keyStack[options.name] !== undefined ) {
		 return true;
		}
	}
	//search by keycode
	else if( options.keyCode !== undefined ) {
		//search primary keys
		for( item1 in Apx.KC.keyStack ) {
			if( Apx.KC.keyStack[item1].keyCode == options.keyCode ) {
			 return Apx.KC.keyStack[item1];
			}
		}
		//search secondary keys
		for( item2 in Apx.KC.keyStack ) {
			for( s = 0, _s = Apx.KC.keyStack[item2].secKeys.length; s < _s; s++ ) {
				if( Apx.KC.keyStack[item2].secKeys[s] == options.keyCode ) {
				 return Apx.KC.keyStack[item2];
				}
			}
		}
	}
	//search by position
	else if( options.position !== undefined ) {
		if( options.position === 'last' ) {
		 item = false;
		 for( item in Apx.KC.keyStack );
			if(item) {
			 return Apx.KC.keyStack[item];
			}
			else {
			 return false;
			}
		}
		if( options.position === 'first' ) {
		 item = false;
		 for( item in Apx.KC.keyStack ) break;
			if(item) {
			 return Apx.KC.keyStack[item];
			}
			else {
			 return false;
			}
		}
	}
 return false;
}

/**
 * Deletes key action from stack
 * @param {String} name
 * @return {Bool}
 */
Apx.KC.popStack = function(name) {
 delete Apx.KC.keyStack[name];
 return true;
}

/**
 * Builds final action to send through API for a key event
 * @param {Int} keyCode
 * @param {Int} charCode
 * @return {Object}
 * @returnprop {Bool} found
 * @returnprop {Int} keyCode
 * @returnprop {Int} charCode
 * @returnprop {Int} secKeys
 * @returnprop {String} name
 * @returnprop {Bool} printable
 * @returnprop {String} val
 */
Apx.KC.getAction = function(keyCode, charCode) {
 var item, c, _c, s, _s, action, thisChar, out, found, val;
 found = false;
	main : for( action in Apx.KC.map ) {
	 item = Apx.KC.map[action];
		//search char list
		for(  c = 0, _c = item.c.length; c < _c; c++ ) {
		 thisChar = item.c[c];
			if( charCode === thisChar ) {
			 out = {
			 	found : true,
			 	keyCode : item.k,
			 	charCode : thisChar,
			 	secKeys : item.s,
			 	name : action,
			 	printable : item.p,
			 	val : item.v
			 };
			 found = true;
			 break main;
			}
		}
		//search secondary key list
		//a secondary list isonly valid if control characters exist
		for(  s = 0, _s = item.s.length; s < _s; s++ ) {
		 thisSecKey = item.s[s];
		 	//found in char list
			if( keyCode === thisSecKey) {
			 out = {
			 	found : true,
			 	keyCode : item.k,
			 	charCode : thisSecKey,
			 	secKeys : item.s,
			 	name : action,
			 	printable : item.p,
			 	val : item.v
			 };
			 found = true;
			 break main;
			}
		}
		//search primary key
		if( item.k === keyCode ) {
		 out = {
			found : true,
			keyCode : item.k,
			charCode : item.k,
		 	secKeys : item.s,
			name : action,
			printable : item.p,
			val : item.v
		 };
		 found = true;
		 break main;		
		}
	}
	//nothing found
	if( !found ) {
	 val = (keyCode !== 0 ? String.fromCharCode( keyCode ) :
			String.fromCharCode( charCode ) );
	 out = {
		found : false,
		keyCode : keyCode,
		charCode : charCode,
	 	secKeys : [],
		name : 'UNKNOWN',
		printable : val.length ? true : false, 
		val : val
	 };
	}
 return out;
}

Apx.KC.init();
