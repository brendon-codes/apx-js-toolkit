/**
 * Adds a tooltip menu below an item
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

Apx.Core.require_style( 'Dropper', 'Apx.Dropper' );

Apx.Dropper = new Object;

Apx.Dropper.init_once = false;

Apx.Dropper.baseZIndex = 10000;

/**
 * Initializer
 */
Apx.Dropper.init = function() {
 var list, i, _i;
	if(Apx.Dropper.init_once) {
	 return false;
	}
	else {
	 Apx.Dropper.init_once = true;
	}
 list = Apx.Util.selector('.dropper');
	for( i = 0, _i = list.length; i < _i; i++ ) {
	 Apx.Dropper.register_item(list[i]);
	}
 return true;
}

/**
 * Init registration of an element
 * @param {HTMLElement} item
 * @return {Bool}
 */
Apx.Dropper.register_item = function(item) {
 var txt, xpos, ypos, width, p, a, ae, i, _i, v, data;
 txt = item.getAttribute('title');
	if( txt === null || txt === undefined ) {
	 return false;
	}
 data = Apx.Util.getJSON(txt);
 ae = {};
	for(i in data) {
	 ae[i] = Apx.Util.replaceTags(data[i]);
	}
	if( !(p = Apx.Util.classArgs(item) ) ) {
	 return false;
	}
	if(p[0] === 'mouse') {
	 action = p[0];
	}
	else {
	 return false;
	}
	if(!isNaN(p[1])) {
	 width = p[1];
 	}
 	else {
 	 return false;
 	}
 new Apx.Dropper.Item(item, ae, action, width);
 return true;
}

/**
 * API interface to register an item
 * @param {HTMLElement} item
 * @param {Object} childs
 * @param {String} action
 * @param {Int} width
 * @constructor
 */
Apx.Dropper.Item = function(item, childs, action, width) {
 var mover;
	if(action !== 'mouse') {
	 alert("Apx.Dropper: Item() action is not valid.");
	 return false;
	}
 item.removeAttribute('alt');
 item.removeAttribute('title');
 item.dropper = new Apx.Dropper.Box(childs, width);
 item.dropper.move( Apx.Util.elementCoords(item) );
	Apx.Util.listen( item, 'mouseover', function(e){
 	 Apx.Util.killEvent(e);
	 item.dropper.show();
	});
	Apx.Util.listen(item, 'mouseout', function(e){
	 var t;
	 Apx.Util.killEvent(e);
	 	if(
			!Apx.Util.mouseInElementView(e, item.dropper.elm) &&
			!Apx.Util.mouseInElementView(e, item)			
		) {
		 item.dropper.hide();
		}
	});
	Apx.Util.listen( item.dropper.elm, 'mouseout', function(e){
	 var t;
	 Apx.Util.killEvent(e);
	 	if(
			!Apx.Util.mouseInElementView(e, item.dropper.elm)
		) {
		 item.dropper.hide();
		}
	});
	Apx.Util.listen( item.dropper.elm, 'click', function(e){
	 Apx.Util.killEvent(e);
	 item.dropper.hide();
	});
}

/**
 * Sets up a new row object
 * @param {String} txt
 * @param {String} act
 * 		The action of the row when selected
 * @constructor
 */
Apx.Dropper.Row = function(txt, act) {
 _this = this;
 _this.elm = document.createElement('li');
 _this.elm.className = 'dropper_row';
 _this.elm.dropper = new Object;
 _this.elm.dropper.clicker = act;
 Apx.Util.listen(_this.elm, 'mouseover', Apx.Dropper.rowOn );
 Apx.Util.listen(_this.elm, 'mouseout', Apx.Dropper.rowOff );
 Apx.Util.listen(_this.elm, 'click', Apx.Dropper.rowClick );
 Apx.Util.writeText(_this.elm, txt);
}

/**
 * Action handler for row on
 * @param {Object[Event]} e
 * @return {Bool}
 */
Apx.Dropper.rowOn = function(e) {
 var elm;
 elm = Apx.Util.eventElement(e);
 Apx.Util.addClass(elm, 'dropper_rowon');
 return true;
}

/**
 * Action handler for row off
 * @param {Object[Event]} e
 * @return {Bool}
 */
Apx.Dropper.rowOff = function(e) {
 var elm;
 elm = Apx.Util.eventElement(e);
 Apx.Util.removeClass(elm, 'dropper_rowon');
 return false;
}

/**
 * Action handler for row click
 * @param {Object[Event]} e
 * @return {Bool}
 */
Apx.Dropper.rowClick = function(e) {
 var elm;
 elm = Apx.Util.eventElement(e);
	if(elm.dropper.clicker) {
	 window.location.href = elm.dropper.clicker;
	}
 return true;
}

/**
 * Sets up a new Box object
 * @param {Object} childs
 * @param {Int} width
 * @constructor
 */
Apx.Dropper.Box = function(childs, width) {
 var cont, u, c, i;
 u = document.createElement('ul');
 u.className = "dropper_list";
	for(c in childs) {
	 i = new Apx.Dropper.Row(c, childs[c]);
	 u.appendChild(i.elm);
	}
 cont = document.createElement('div');
 cont.style.position = 'absolute';
 cont.style.visibility = 'hidden';
 cont.style.width = width + 'px';
 cont.className = "dropper_container";
 cont.style.zIndex = Apx.Dropper.baseZIndex;
 cont.appendChild(u);
 this.elm = document.body.appendChild(cont);
 Apx.Dropper.baseZIndex++;
}

/**
 * Box method to move
 * @param {Object[Apx.Util.coords]} coords
 * @return {Bool}
 */
Apx.Dropper.Box.prototype.move = function(coords) {
 this.elm.style.left = coords.x + 'px';
 this.elm.style.top = (coords.y + coords.h) + 'px';
 return true;
}

/**
 * Box method to show
 * @return {Bool}
 */
Apx.Dropper.Box.prototype.show = function() {
 this.elm.style.visibility = 'visible';
 return true;
}

/**
 * Box method to hide
 * @return {Bool}
 */
Apx.Dropper.Box.prototype.hide = function() {
 this.elm.style.visibility = 'hidden';
 return true;			
}
 
Apx.Util.domload(Apx.Dropper.init);

