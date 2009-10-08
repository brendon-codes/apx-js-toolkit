/**
 * Widget abstraction class for Aphex - Bridge between jQuery and Prototype
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

Apx.Widget = new Object;

/** Slider *****************************************************************/
/**
 * Abstracts a jQuery or Prototype slider
 * @constructor
 */
Apx.Widget.Slider = function( handle, track, range, position, onSlideFunc ) {
 var _this = this;
 handle = Apx.Util.i(handle);
 track = Apx.Util.i(track);
 _this.handle = handle;
 _this.track = track;
 _this.range = range;
 _this.slideFunc = onSlideFunc;
	if(Apx.Core.tk.Prototype) {
		if(!handle.id) {
		 handle.id = 'apx_widgetslider_handle' + Apx.Util.ran(1000);
		}
		if(!track.id) {
		 track.id = 'apx_widgetslider_track' + Apx.Util.ran(1000);
		}
		window.setTimeout(function(){
		 _this.slider = new Control.Slider( handle, track, {
		 	range : range ,
		 	values : range ,
		 	sliderValue : (position === 'end' ? range.end : range.start) ,
			onSlide : onSlideFunc
		 });
		},100);
	}
	else if(Apx.Core.tk.JQuery) {
		window.setTimeout(function(){
		 _this.slider = jQuery(track).slider({
		 	handle : handle,
			steps : range.length - 1,
			minValue : range[0],
			maxValue : range[range.length - 1],
			startValue : (position === 'end' ? range[range.length - 1] : range[0]),
			slide : function(a1, a2) {
			 onSlideFunc(a2.value);
			}
		 }).sliderInstance();
		},100);
	}
}

/**
 * Wrapper to set value
 * @param {Int} amt
 */
Apx.Widget.Slider.prototype.setValueBy = function(amt){
 var val;
 var _this = this;
	if(Apx.Core.tk.Prototype){
	 _this.slider.setValueBy(amt);
 	}
	else if(Apx.Core.tk.JQuery) {
	 val = _this.slider.interaction.curValue + amt;
	 _this.slider.moveTo(val);
	 _this.slideFunc(val);
	}
}