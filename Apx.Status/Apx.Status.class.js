/**
 * Sets up an status element
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

Apx.Core.require_style('Status', 'Apx.Status');

Apx.Status = new Object;

Apx.Status.queue = [];

/**
 * API constructor
 * @param {Object} options
 * @paramprop options {String} statusClass
 * @paramprop options {String} text
 * @paramprop options {Int} x
 * @paramprop options {Int} y
 * @constructor
 */
Apx.Status.Item = function(options) {
 var elm;
 options = Apx.Util.args(options,{
 	statusClass : 'aph_status',
	text : 'Loading...',
	x : 'left'
 });
	if(options.x !== 'left' && options.x !== 'right') {
	 return;
	}
 elm = document.createElement('div');
 Apx.Util.writeText(elm, options.text);
 Apx.Util.addClass(elm , options.statusClass);
 elm.style[options.x] = "0px";
 elm.style['top'] = "0px";
	if(document.all) {
	 elm.style.position = "absolute";
		Apx.Util.listen( window, 'scroll', function(){
		 var s;
		 s = Apx.Util.scrollOffset();
		 elm.style[options.x] = s.x + 'px';
		 elm.style.top = s.y + 'px';	 
		});
	}
	else {
	 elm.style.position = "fixed";
	}
	if(!document.body) {
	 Apx.Status.queue[Apx.Status.queue.length] = elm;
	}
	else {
	 Apx.Status.add(elm);
	}
 this.elm = elm;
}

/**
 * Updates text of a status item
 * @param {String} text
 * @return {Bool}
 */
Apx.Status.Item.prototype.update = function(text) {
 Apx.Util.writeText(this.elm, text);
 return true;
}

/**
 * Hides a status element
 * @param {String} text
 * @return {Bool}
 */
Apx.Status.Item.prototype.hide = function() {
 this.elm.style.visibility = "hidden";
 return true;
}

/**
 * Shows a status element
 * @return {Bool}
 */
Apx.Status.Item.prototype.show = function() {
 this.elm.style.visibility = "visible";
 return true;
}

/**
 * Adds element to the page
 * @param {HTMLElement} elm
 * @return {Bool}
 */
Apx.Status.add = function(elm) {
 document.body.appendChild(elm);
 return true;
}

/**
 * Initiates queed items
 */
Apx.Status.init = function() {
 var i, _i;
	for(i = 0, _i = Apx.Status.queue.length; i < _i; i++) {
	 Apx.Status.add(Apx.Status.queue[i]);
	}
}

Apx.Util.domload(Apx.Status.init);