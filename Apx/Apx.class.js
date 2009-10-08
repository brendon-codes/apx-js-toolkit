/**
 * Parent Apx super class
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

var Apx = new Object;

Apx.Core = new Object;

Apx.Core.base = null;

Apx.Core.tk = new Object;

Apx.Core.tktype = null;

Apx.Core.toolkits = {
	'Prototype' : {
		'Prototype' : { file:'prototype.js' , indicator:window.Prototype , needs:[] , load:true , implicit:false },
		'Scriptaculous' : {	file:'scriptaculous.js' , indicator:window.Scriptaculous , needs:[] , load:true , implicit:false },
		'Slider' : { file:null , indicator:false , needs:[] , load:false , implicit:true }
	},
	'JQuery' : {
		'JQuery' : { file:'jquery.js' , indicator:window.jQuery , needs:[] , load:true , implicit:false	},
		'UIDimensions' : { file:'jquery.dimensions.js' , indicator:false , needs:[] , load:true , implicit:false },		
		'UIMouse' : { file:'ui.mouse.js' , indicator:false , needs:['UIDimensions'] , load:false , implicit:false },
		'Slider' : { file:'ui.slider.js' , indicator:false , needs:['UIMouse','UIDimensions'] ,	load:false , implicit:false	}
	}
};

/**
 * Automatically determines path and query args.
 * returns false on fail
 * @param {String} filename
 * @return {Object}
 */
Apx.Core.path = function(filename) {
 var p, vals, out, html, thisMatch,
 	escFilename, matcher, pat, p1, p2, p3;
 p1 = /\./ig;
 p2 = /&amp;|&|;/ig;
 p3 = /=/;
 escFilename = filename.replace(p1, "\\.");
 out = {
 	path : null,
 	vars : {}
 };
 html = document.getElementsByTagName('head')[0].innerHTML;
 pat = '<script[\t\n\f ]+.*?src=(["\'])(.*?)' + escFilename + '([\?](.+?))?(\\1).*?>';
 matcher = new RegExp( pat, "i" );
 thisMatch = html.match( matcher );
 	if(!thisMatch) {
 	 return false;
 	}
	if(thisMatch[2]) {
	 out.path = thisMatch[2];
	}
	if(thisMatch[4]) {
	 p = thisMatch[4].split(p2);
		for(var i = 0; i < p.length; i++) {
		 vals = p[i].split(p3);
		 out.vars[vals[0]] = vals[1];
		}
	}
 return out;
}

/**
 * Outputs a script
 * @param {String} path
 * @return {Bool}
 */
Apx.Core.scr = function(path){
 var s;
 s = "<" + "script type='text/javascript' src='" + path + "'>" + "<" + "/script" + ">";
 document.write(s);
 return true;
}

/**
 * Gets a path relative to an Aphex module
 * @param {String} module
 * @param {String} file
 * @return {String}
 */
Apx.Core.getPath = function(module, file) {
 return (Apx.Core.base + 'Apx.' + module + '/' + file);
}

/**
 * Grabs an internal script
 * @param {String} module
 * @param {String} file
 * @return {Bool}
 */
Apx.Core.require_script = function( module, file ) {
 var ss, p;
	if(Apx.Core.base === null) {
	 alert('Apx.Core: Apx.Core.base is not set.');
	 return false;
	}
 p = Apx.Core.getPath(module, file) + '.js';
 Apx.Core.scr(p);
 return true;
}

/**
 * Grabs a dependent stylesheet
 * @param {String} module
 * @param {String} file
 * @return {Bool}
 */
Apx.Core.require_style = function( module, file ) {
 var ss, p;
	if(Apx.Core.base === null) {
	 alert('Apx.Core: Apx.Core.base is not set.');
	 return false;
	}
 p = Apx.Core.getPath(module, file) + '.css';
 Apx.Util.ss(p);
 return true;
}

/**
 * Adds a toolkit
 * @param {String} w
 * @return {Bool}
 * 
 */
Apx.Core.require_toolkit = function(w){
	if(Apx.Core.base === null) {
	 alert('Apx.Core: Apx.Core.base is not set.');
	 return false;
	}
	else {
		if( !Apx.Core.toolkits[Apx.Core.tktype][w] ) {
		 alert('Apx.Core: Toolkit does not provide that component.');
		}
		else if(!Apx.Core.toolkits[Apx.Core.tktype][w].implicit) {
			if(Apx.Core.toolkits[Apx.Core.tktype][w].needs.length) {
				for(n = 0, _n = Apx.Core.toolkits[Apx.Core.tktype][w].needs.length; n < _n; n++) {
				 arguments.callee(Apx.Core.toolkits[Apx.Core.tktype][w].needs[n], true);
			 	}
			}
		 Apx.Core.scr( Apx.Core.base + 'Toolkits/' + Apx.Core.tktype + '/' + Apx.Core.toolkits[Apx.Core.tktype][w].file );
	 	}
	 return true;
 	}
}

/**
 * Adds a module
 * @param {String} w
 * @return {Bool}
 * 
 */
Apx.Core.require_module = function(w){
	if(Apx.Core.base === null) {
	 alert('Apx.Core: Apx.Core.base is not set.');
	 return false;
	}
	else {
	 Apx.Core.scr( Apx.Core.getPath(w, 'Apx.' + w) + '.class.js' );
	 return true;
 	}
}

/**
 * Gets the parent directory
 * @param {String} path
 * @return {String}
 */
Apx.Core.dirup = function(path){
 var c;
	if(path.length > 1) {
	 c = path.substring(0, path.lastIndexOf('/') );
	 c = c.substring(0, c.lastIndexOf('/') + 1 );
 	}
	else {
	 c = path;
	}
 return c;
}

/**
 * Startup Aphex functions
 * @return {Bool}
 */
Apx.Core.init = function(){
 var p, a, i, _i, t, _t;
 p = Apx.Core.path('Apx.class.js');
 Apx.Core.base = Apx.Core.dirup( p.path );
	if(!p.vars.toolkit){
	 alert('Apx.Core: Must specify a toolkit.');
	 return false;
	}
	if( !Apx.Core.toolkits[p.vars.toolkit] ) {
	 alert('Apx.Core: No valid toolkit specified');
	 return false;
	}
	else {
	 Apx.Core.depends(p.vars.toolkit);
	}
 Apx.Core.require_module('Util');
	if(p.vars.load) {
	 a = p.vars.load.split(',');
		for(i = 0, _i = a.length; i < _i; i++) {
		 Apx.Core.require_module(a[i]);
		}
	}
 return true;
}

/**
 * Handles dependencies
 * @param {String} tk
 * @return {Bool}
 */
Apx.Core.depends = function(tk) {
 Apx.Core.tktype = tk;
 Apx.Core.tk[tk] = true;
	for(t in Apx.Core.toolkits[tk] ) {
		if(
			Apx.Core.toolkits[tk][t].load &&
			!Apx.Core.toolkits[tk][t].indicator
		) {
		 Apx.Core.require_toolkit(t);
		}
	}
 return true;
}

Apx.Core.init();