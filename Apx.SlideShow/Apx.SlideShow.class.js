/**
 * Sets up a scrollling image slideshow
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

Apx.Core.require_style( 'SlideShow', 'Apx.SlideShow' );
Apx.Core.require_toolkit( 'Slider' );
Apx.Core.require_module( 'Widget' );

Apx.SlideShow = new Object;

/**
 * API setup
 * @param {HTMLElement} elm
 * @param {HTMLElement} sliderElm
 * @param {Array} imageList
 * @constructor
 */
Apx.SlideShow.Item = function( elm, sliderElm, imageList ) {
 var _this = this;
 var i, _i, im, hasRun;
 hasRun = false;
 _this.queue = [];
	for( i = 0, _i = imageList.length; i < _i; i++ ) {
	 im = new Image;
	 im.src = imageList[i];
	 im.style['float'] = "left";
	 im.slideshow = {
	 	id : i
	 };
	 _this.queue[i] = {
     	'image' : im,
     	'loaded' : false
	 };
		im.onload = function() {
		 var allLoaded, j, _j;
		 _this.queue[this.slideshow.id].loaded = true;
		 allLoaded = true;
			 for( j = 0, _j < _this.queue.length; j < _j; j++ ) {
			 	if( !_this.queue[j].loaded ) {
			 	 allLoaded = false;
			 	 break;
			 	}
			}
			if( allLoaded && !hasRun) {
			 hasRun = true;
			 _this.process(elm, sliderElm);
			 return;
			}
		}
    }
}

/**
 * Sets up image operations
 * @param {HTMLElement} elm
 * @param {HTMLElement} slideElm
 * @return {Bool}
 */
Apx.SlideShow.Item.prototype.process = function(elm, slideElm) {
 var _this = this;
 var k, _k, slideSize;
 _this.elm = Apx.Util.i(elm).appendChild(document.createElement('div'));
 _this.elm.style['width'] = "100%";
 _this.elm.style['position'] = "relative";
 _this.elm.style['overflow'] = "hidden";
 _this.mainWidth = _this.elm.offsetWidth;
 _this.subElm = document.createElement( 'div' );
 _this.subElm.style['position'] = "absolute";
 _this.subElm.style['top'] = "0px";
 _this.subElm.style['whiteSpace'] = "nowrap";
 _this.subElm.style['left'] = "0px";
	for( k = 0,  _k = _this.queue.length; k < _k; k++ ) {
	 _this.subElm.appendChild( _this.queue[k].image );
	}
 _this.elm.appendChild( _this.subElm );
 _this.elm.style['height'] = _this.subElm.offsetHeight + "px";
    if( _this.subElm.offsetWidth > _this.mainWidth ) {
     slideSize = _this.subElm.offsetWidth - _this.mainWidth;
    }
    else {
     slideSize = _this.subElm.offsetWidth;
    }
 _this.drawSlider(slideElm, slideSize);
 return true;
}

/**
 * Sets up slider operations
 * @param {HTMLElement} slideElm
 * @param {Int} slideSize
 * @return {Bool}
 */
Apx.SlideShow.Item.prototype.drawSlider = function(slideElm, slideSize) {
 var _this = this;
 var handleElm, thisRange, trackElm, thisSlider;
 slideElm = Apx.Util.i(slideElm);
 thisRange = Apx.Util.makeRange( 0, slideSize );
 trackElm = slideElm.appendChild(document.createElement('div'));
 trackElm.className = 'apx_slideshow_track';
 trackElm.id = 'apx_slideshow_track';
 handleElm = trackElm.appendChild(document.createElement('div'));
 handleElm.className = 'apx_slideshow_handle';
 handleElm.id = 'apx_slideshow_handle';
 thisSlider = new Apx.Widget.Slider(handleElm, trackElm, thisRange, 'start', function(v){
  _this.updateRegion(v);
 });	
}

/**
 * Updates the image pane from a slide
 * @param {Int} val
 * @return {Bool}
 */
Apx.SlideShow.Item.prototype.updateRegion = function(val) {
 var _this = this;
 var newVal;
 newVal = val * -1;
 _this.subElm.style['left'] = newVal + "px";
 return true;
}

