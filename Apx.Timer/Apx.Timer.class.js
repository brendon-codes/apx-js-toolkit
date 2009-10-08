/**
 * Advanced timer functionalities
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

Apx.Timer = new Object;

//Must be divisible by 1000
Apx.Timer.MILI_FRACTI = 250;

Apx.Timer.values = {
	FRACTI_SEC : Math.floor(1000 / Apx.Timer.MILI_FRACTI),
	SEC_MIN : 60,
	MIN_HOUR : 60
};

/**
 * Sets up a new timer item
 * @param {Object} options
 * @paramprop options {Object} start
 * @paramprop options.start {Int} fracti
 * @paramprop options.start {Int} sec
 * @paramprop options.start {Int} min
 * @paramprop options.start {Int} hour
 * @paramprop options {Object} callback
 * @paramprop options.callback {Int} fracti
 * @paramprop options.callback {Int} sec
 * @paramprop options.callback {Int} min
 * @paramprop options.callback {Int} hour
 * @paramprop options {String} direction
 * @paramprop options {String} format
 * @constructor
 */
Apx.Timer.Item = function(options) {
 var _this = this;
 options = Apx.Util.args(options, {
	start : {
		fracti : 0,
		sec : 0,
		min : 0,
		hour : 0	
	},
	callback : {
		fracti : false,
		sec : false,
		min : false,
		hour : false
	},
	direction : 'up',
	format : "<N><HH>:<MM>:<SS>"
 });
 _this.startTime = options.start;
 _this.callback = options.callback;
 _this.direction = options.direction;
 _this.format = options.format;
 _this.fractis = Apx.Timer.toFractis( options.start );
 _this.interval = null;
}

/**
 * Starts timer
 * @return {Bool}
 */
Apx.Timer.Item.prototype.start = function(){
 var _this = this;
 _this.interval = window.setInterval(function(){
  _this.go();
 },Apx.Timer.MILI_FRACTI);
 return true;
}

/**
 * Initiates timer
 * @return {Bool}
 */
Apx.Timer.Item.prototype.go = function() {
 var _this = this;
 var theTime, theTotal, i;
 _this.fractis++;
 theTime = Apx.Timer.timeFromFractis(_this.fractis);
 theTotal = Apx.Timer.totalFromFractis(_this.fractis);
 formatTime = Apx.Timer.formatTime( theTime, theTotal, _this.format, _this.direction);
	if(
		_this.callback.fracti
	) {
	 _this.callback.fracti( theTime, theTotal, formatTime );
 	}
	if(
		_this.callback.sec &&
		!(theTotal.fracti % Apx.Timer.values.FRACTI_SEC)
	) {
	 _this.callback.sec( theTime, theTotal, formatTime );	 
	}
	if(
		_this.callback.min &&
		!(theTotal.fracti % (Apx.Timer.values.FRACTI_SEC * Apx.Timer.values.SEC_MIN))
	) {
	 _this.callback.min( theTime, theTotal, formatTime );	 
	}
	if(
		_this.callback.hour &&
		!(theTotal.fracti % (Apx.Timer.values.FRACTI_SEC * Apx.Timer.values.SEC_MIN * Apx.Timer.values.MIN_HOUR))
	) {
	 _this.callback.hour( theTime, theTotal, formatTime );	 
	}
 return true;
}

/**
 * Stops a timer
 * @return {Bool}
 */
Apx.Timer.Item.prototype.stop = function() {
 var _this = this;
	if(_this.interval !== null) {
	 window.clearInterval(_this.interval);
	}
 return true;
}

/**
 * Converts time to fractis
 * @param {Int} fractis
 * @return {Object}
 * @returnprop {Int} hour
 * @returnprop {Int} min
 * @returnprop {Int} sec
 */
Apx.Timer.timeFromFractis = function(fractis) {
 return {
 	hour : Math.floor(((fractis / Apx.Timer.values.FRACTI_SEC) / Apx.Timer.values.SEC_MIN) / Apx.Timer.values.MIN_HOUR),
	min : Math.floor(((fractis / Apx.Timer.values.FRACTI_SEC) / Apx.Timer.values.SEC_MIN) % Apx.Timer.values.MIN_HOUR),
	sec : Math.floor((fractis / Apx.Timer.values.FRACTI_SEC) % Apx.Timer.values.SEC_MIN)
 };
}

/**
 * Converts time from fractis
 * @param {Int} fractis
 * @return {Object}
 * @returnprop {Int} hour
 * @returnprop {Int} min
 * @returnprop {Int} sec
 * @returnprop {Int} fractis
 */
Apx.Timer.totalFromFractis = function(fractis) {
 return {
 	hour : Math.floor(((fractis / Apx.Timer.values.FRACTI_SEC) / Apx.Timer.values.SEC_MIN) / Apx.Timer.values.MIN_HOUR),
	min : Math.floor(((fractis / Apx.Timer.values.FRACTI_SEC) / Apx.Timer.values.SEC_MIN)),
	sec : Math.floor(fractis / Apx.Timer.values.FRACTI_SEC),
	fracti : fractis
 };
}

/**
 * Converts time to fractis as int
 * @param {Object} time
 * @return {Int}
 */
Apx.Timer.toFractis = function( time ) {
 return (
 	(time.fracti) +
	(time.sec * Apx.Timer.values.FRACTI_SEC) +
	(time.min * Apx.Timer.values.FRACTI_SEC * Apx.Timer.values.SEC_MIN) +
	(time.hour * Apx.Timer.values.FRACTI_SEC * Apx.Timer.values.SEC_MIN * Apx.Timer.values.MIN_HOUR)
 );
}

/**
 * Formats time
 * @param {Object[Apx.Timer.timeFromFractis]} time
 * @param {Object[Apx.Timer.totalFromFractis]} total
 * @param {String} format
 * @param {String} direction
 * @return {String}
 */
Apx.Timer.formatTime = function( time, total, format, direction ) {
 var out, finalTime;
 out = {
 	h : time.hour,
	hh : ((time.hour.toString().length === 1) ? '0' + time.hour : time.hour),
	m : time.min,
	mm : ((time.min.toString().length === 1) ? '0' + time.min : time.min),
	s : time.sec,
	ss : ((time.sec.toString().length === 1) ? '0' + time.sec : time.sec),
	th : total.hour,
	tm : total.min,
	ts : total.sec,
	tf : total.fracti,
	n : ((direction === 'down') ? '-' : '')
 };
 finalTime = format;
 finalTime = finalTime.replace( /<N>/g , out.n );
 finalTime = finalTime.replace( /<HH>/g , out.hh );
 finalTime = finalTime.replace( /<H>/g , out.h );
 finalTime = finalTime.replace( /<MM>/g , out.mm );
 finalTime = finalTime.replace( /<M>/g , out.m );
 finalTime = finalTime.replace( /<SS>/g , out.ss );
 finalTime = finalTime.replace( /<S>/g , out.s );
 finalTime = finalTime.replace( /<TH>/g , out.th );
 finalTime = finalTime.replace( /<TM>/g , out.tm );
 finalTime = finalTime.replace( /<TS>/g , out.ts );
 finalTime = finalTime.replace( /<TF>/g , out.tf );
 return finalTime;
}
