/**
 * Adds popup tooltip
 *
 * @package Aphex Toolkit
 * @author  
 * @version	1.0
 * @see http://toolkit.aphexcreations.net
 * @created 2008-01-01
 * @note USAGE:
 *
 * 	Popper:
 *		<a href='foo.html' title='Popup Text' class='popper args:top:right:200'>Link Text</a>
 *
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

Apx.Core.require_style( 'Popper', 'Apx.Popper' );

var POPPER_CONTENT = "<div class='popper_container'>{content}</div>";

Apx.Popper = new Object;

Apx.Popper.content = window.POPPER_CONTENT;

Apx.Popper.offset = {
	top :		{ x: 0 , y: 8 },
	bottom :	{ x:12 , y:12 }
}

Apx.Popper.init_once = false;

Apx.Popper.baseZIndex = 10000;

/**
 * Inititiation
 * @return {Bool}
 */
Apx.Popper.init = function() {
 var list, i, _i;
	if(Apx.Popper.init_once) {
	 return false;
	}
	else {
	 Apx.Popper.init_once = true;
	}
 list = Apx.Util.selector('.popper');
	for( i = 0, _i = list.length; i < _i; i++ ) {
	 Apx.Popper.register_item(list[i]);
	}
 return true;
}

/**
 * Registers an item through the className scan
 * @param {HTMLElement} item
 * @return {Bool}
 */
Apx.Popper.register_item = function(item) {
 var txt, xpos, ypos, width, p;
 txt = item.getAttribute('title');
	if( txt === null || txt === undefined ) {
	 return false;
	}
 txt = Apx.Util.replaceTags(txt);
	if( !(p = Apx.Util.classArgs(item) ) ) {
	 return false;
	}
	if(p[0] === 'top' || p[0] === 'bottom') {
	 ypos = p[0];
	}
	else {
	 return false;
	}
	if(p[1] === 'left' || p[1] === 'right') {
	 xpos = p[1];
	}
	else {
	 return false;
	}
	if(!isNaN(p[2])) {
	 width = p[2];
 	}
 	else {
 	 return false;
 	}
 new Apx.Popper.Item(item, txt, ypos, xpos, width);
 return true;
}

/**
 * API Call to register an element
 * @param {HTMLElement} item
 * @param {String} txt
 * @param {Int} ypos
 * @param {Int} xpos
 * @param {Int} width
 */
Apx.Popper.Item = function(item, txt, ypos, xpos, width) {
 var mover;
	if(ypos !== 'top' && ypos !== 'bottom') {
	 alert("Apx.Popper: Item() ypos is invalid.");
	 return false;
	}
	if(xpos !== 'left' && xpos !== 'right') {
	 alert("Apx.Popper: Item() xpos is invalid.");
	 return false;
	}
 item.removeAttribute('alt');
 item.removeAttribute('title');
 item.popper = new Apx.Popper.Box(txt, ypos, xpos, width);
 mover = function(e){
  item.popper.move( Apx.Util.coords(e) );
 }
 Apx.Util.listen( item, 'mouseover', function(e){
  item.popper.show( Apx.Util.coords(e) );
  Apx.Util.listen( item, 'mousemove', mover );
 });
 Apx.Util.listen( item, 'mouseout', function(e){
  item.popper.hide();
  Apx.Util.stopListen( item, 'mousemove', mover );
 });
 return true;			
}

/**
 * Builds the actual box to be associated with an element
 * @param {String} txt
 * @param {Int} ypos
 * @param {Int} xpos
 * @param {Int} width
 * @return {Bool}
 */
Apx.Popper.Box = function(txt, ypos, xpos, width) {
 var str, popElm, cont;
 popElm = "<span class='popper_content'>" + txt + "</span>";
 str = Apx.Util.data(Apx.Popper.content, {content:popElm});
 cont = document.createElement('div');
 Apx.Util.append(cont, str, 'top');
 cont.style.position = 'absolute';
 cont.style.visibility = 'hidden';
 cont.style.width = width + 'px';
 cont.style.zIndex = Apx.Popper.baseZIndex;
 this.elm = document.body.appendChild(cont);
 this.xpos = xpos;
 this.ypos = ypos;
 this.contentWrapper = null;
 Apx.Popper.baseZIndex++;
 return true;
}

/**
 * Modifies text in an instance of a Box
 * @param {String} txt
 * @return {Bool}
 */
Apx.Popper.Box.prototype.text = function(txt) {
	if(this.contentWrapper === null) {
	 this.contentWrapper = Apx.Util.selector('.popper_content', this.elm)[0];
	}
 Apx.Util.writeText(this.contentWrapper, txt);
 return true;
}

/**
 * Moves the box
 * @param {Object[Apx.Util.coords]} coords
 * @return {Bool}
 */
Apx.Popper.Box.prototype.move = function(coords) {
 var xstr, ystr, xoffset, yoffset;
 xoffset = Apx.Popper.offset[this.ypos].x;
 yoffset = Apx.Popper.offset[this.ypos].y;
	if(this.xpos === 'left') {
	 this.elm.style.left = ((coords.x - this.elm.offsetWidth) - xoffset) + 'px';
	}
	else if(this.xpos === 'right') {
	 this.elm.style.left = (coords.x + xoffset) + 'px';
	}
	if(this.ypos === 'top') {
	 this.elm.style.top = ((coords.y - this.elm.offsetHeight) - yoffset) + 'px';
	}
	else if(this.ypos === 'bottom') {
	 this.elm.style.top = (coords.y + yoffset) + 'px';
	}
 return true;
}

/**
 * Shows a box
 * @param {Object[Apx.util.coords]} coords
 * @return {Bool}
 */
Apx.Popper.Box.prototype.show = function(coords) {
 this.elm.style.visibility = 'visible';
 this.move(coords);
 return true;
}

/**
 * Hides a box
 * @return {Bool}
 */
Apx.Popper.Box.prototype.hide = function() {
 this.elm.style.visibility = 'hidden';
 return true;			
}

/**
 * Executes test functions
 * @param {String} elmID
 * @param {String} prop
 * @param {String} val
 * @return {Bool}
 */
Apx.Popper.ex = function(elmID, prop, val) {
 var elm;
 elm = document.getElementById(elmID);
	switch(prop) {
		case 'text' : elm.popper.text(val); break;
		case 'show' : elm.popper.show(val);	break;
		case 'hide' : elm.popper.hide(val);	break;
		case 'move' : elm.popper.move(val); break;
	}
 return true;
}

Apx.Util.domload(Apx.Popper.init);

