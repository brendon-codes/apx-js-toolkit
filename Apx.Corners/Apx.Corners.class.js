/**
 * Apx.Corners Class 
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

Apx.Corners = new Object;

Apx.Core.require_style( 'Corners', 'lib/NiftyCorners' );
Apx.Core.require_script( 'Corners', 'lib/NiftyCubeAPX' );

/**
 * Initialization
 */
Apx.Corners.init = function(){
 var list, i, _i;
 list = Apx.Util.selector('.corner');
	for( i = 0, _i = list.length; i < _i; i++ ) {
	 Apx.Corners.register_item(list[i]);
	}
}

/**
 * Registers an item through html attributes
 * @param {HTMLElment} item
 * @return {Bool}
 */
Apx.Corners.register_item = function(item){
 var txt, xpos, ypos, width, p, a, ae, i, _i, v, data;
	if( !(p = Apx.Util.classArgs(item) ) ) {
	 return false;
	}
 new Apx.Corners.Item(item, p);
 return true;
}

/**
 * Interface to oregister an item
 * @param {HTMLElement} item
 * @param {Object} props
 * @constructor
 */
Apx.Corners.Item = function(item, props){
 var pStr, r, _r;
 pStr = "";
	for(r = 0, _r = props.length; r < _r; r++) {
		if(r) {
		 pStr += " ";
		}
	 pStr += props[r];
	}
 NiftyCube(item, pStr);
}

Apx.Util.domload(Apx.Corners.init);