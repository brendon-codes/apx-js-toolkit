/**
 * Generic class to create a table displaying various dates and values
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

Apx.Core.require_style( 'DateBox', 'Apx.DateBox' );
Apx.Core.require_toolkit( 'Slider' );
Apx.Core.require_module( 'Widget' );

/**
 * Apx.DateBox contstructor using Prototype.js initialization
 * 
 * @param {Object} records
 * 		List of records for the table.
 * @param {Object} vals
 * 		Vals dataset to fill table.
 * @param {Object} options
 * @paramprop options {Function} rangeMinFunc(null)
 * @paramprop options {Function} rangeMaxFunc(null)
 * @paramprop options {Int} floatPrecision(false),
 * @paramprop options {Object} months(...)
 * @constructor
 */
Apx.DateBox = function( records, vals, options ) {
 var _this = this;
 options = Apx.Util.args(options,{
 	startOffset : 1,
	floatPrecision : 1 ,
	months : {
		0 : "JAN" , 1 : "FEB" , 2 : "MAR" , 3 : "APR" ,
		4 : "MAY" , 5 : "JUN" , 6 : "JUL" , 7 : "AUG" ,
		8 : "SEP" ,	9 : "OCT" , 10 : "NOV" , 11 : "DEC"
	},
	updater : {
	 	url : '#' ,
		method : "get" ,
		extraArgs : {} ,
		responseProcessor : function(transport, action) {
		 return 0;
		}
	},
	tableArgs : {
		elm : document.body,
		tableClass : 'apx_datebox_table',
		onSlide : false,
		cols : 6
	}
 });
 _this.records = records;
 _this.vals = vals;
 _this.months = options.months;
 _this.rangeMaxItem = null;
 _this.rangeMinItem = null;
 _this.range = _this.getRange(options.tableArgs.cols, options.startOffset);
 _this.updater = options.updater;
 _this.floatPrecision = options.floatPrecision;
 //draw table
 _this.drawTable( options.tableArgs.elm, options.tableArgs );
}

/**
 * Sets up a date range object for the minimum
 * @param {Int} year
 * @param {Int} month
 * @param {Int} offset
 * @return {Object}
 * @returnprop {Int} year
 * @returnprop {Int} month
 */
Apx.DateBox.prototype.rangeMinFunc = function( year, month, offset ) {
	 return {
	 	year : year,
		month : month - offset
	 };
};

/**
 * Sets up a date range object for the maximum
 * @param {Int} year
 * @param {Int} month
 * @param {Int} offset
 * @return {Object}
 * @returnprop {Int} year
 * @returnprop {Int} month
 */
Apx.DateBox.prototype.rangeMaxFunc = function( year, month, offset ) {
 var _this = this;
 var thisDate;
 thisDate = new Date;
 thisDate.setMonth( thisDate.getMonth() - offset );
	 return {
	 	year : thisDate.getFullYear(),
		month : thisDate.getMonth()
	 };
}

/**
 * Draws a data cell
 * @param {HTMLTableRow} tr
 * @param {Object} options
 * @paramprop options {Bool} data(false)
 * @paramprop options {Int} colspan(false)
 * @paramprop options {String} dclass('')
 * @paramprop options {Int} count(1)
 * @return HTMLTableCellElement
 */
Apx.DateBox.prototype.drawDataCell = function(tr, options) {
 var _this = this;
 var c, _c, td;
 options = Apx.Util.args(options,{
 	data : false,
	colspan : false,
	dclass : false,
	count : 1
 });
	for(c = 0, _c = options.count; c < _c; c++) {
	 td = document.createElement( 'td' );
	 	if(options.dclass !== false) {
	 	 Apx.Util.addClass(td, options.dclass);
	  	}
		if(options.data) {
		 Apx.Util.writeText(td, options.data);
		}
		if(options.colspan) {
		 td.colSpan = options.colspan;
		}
	  tr.appendChild( td );
	}
 return td;	
}

/**
 * Builds the slider
 * @return {Object}
 * @returnprop {HTMLDivElement} slider
 * @returnprop {HTMLDivElement} track
 * @returnprop {HTMLDivElement} handle
 * @returnprop {HTMLDivElement} lcorner
 * @returnprop {HTMLDivElement} rcorner
 */
Apx.DateBox.prototype.buildSlider = function() {
 var _this = this;
 var slider, sl_lc, sl_rc, sl_ha, sl_tr,
 	handle, track, lcorner, rcorner;
 slider = document.createElement('div');
 slider.id = 'trackbg';
 slider.style.position = "relative";
 sl_lc = document.createElement('div');
 sl_lc.className = 'lcorner';
 sl_lc.id = 'leftHandle';
 sl_lc.appendChild(document.createElement('span'));
 sl_rc = document.createElement('div');
 sl_rc.className = 'rcorner';
 sl_rc.id = 'rightHandle';
 sl_rc.appendChild(document.createElement('span'));
 sl_ha = document.createElement('div');
 sl_ha.id = 'handle1';
 sl_tr = document.createElement('div');
 sl_tr.id = 'track1';
 handle = sl_tr.appendChild(sl_ha);
 lcorner = slider.appendChild(sl_lc);
 track = slider.appendChild(sl_tr);
 rcorner = slider.appendChild(sl_rc);
 return {
 	slider : slider,
 	track : track,
 	handle : handle,
 	lcorner : lcorner,
 	rcorner : rcorner
 };
}

/**
 * Draws the table but does not fill it
 * 
 * @param {Object} options
 * @paramprop options {Int} cols(6)
 * 		Width of the table in columns
 * @paramprop options {String} tableClass('datebox_table')
 * 		CSS Classname for the table
 * @paramprop {Function} onSlide(false)
 * @return {HTMLTableElement}
 * 		An element reference to the drawn table
 */
Apx.DateBox.prototype.drawTable = function( container, options ) {
 var _this = this;
 var t, c, _c, th, shr, thr, tb, r, sl;
 options = Apx.Util.args(options,{
	cols : 6 ,
	tableClass : 'apx_datebox_table' ,
	onSlide : false
 });
 t = document.createElement( 'table' );
 t.className = options.tableClass;
 t.datebox = {
 	cols : options.cols ,
 	header : [] ,
 	map : {}
 }
 sl = _this.buildSlider();
 th = t.appendChild( document.createElement( 'thead' ) );
 shr = th.appendChild(document.createElement('tr'));
 _this.drawDataCell(shr, {dclass:'row_none'});
 _this.drawDataCell(shr, {data:sl.slider, colspan:options.cols});
 //Column:Updated
 //_this.drawDataCell(shr, {dclass:'row_none'});
 thr = document.createElement( 'tr' );
 _this.drawDataCell(thr, {dclass:'row_none'});
	for(c = 0, _c = options.cols; c < _c; c++) {
	 td = document.createElement( 'td' );
	 Apx.Util.addClass(td, 'date_head');
	 t.datebox.header[c] = td;
	 thr.appendChild( td );
	}
 //Column:Updated
 //_this.drawDataCell(thr, {dclass:'row_none'});
 th.appendChild( thr );
 tb = t.appendChild( document.createElement( 'tbody' ) );
 	for(r in _this.records) {
	 tr = document.createElement( 'tr' );
	 //TODO: Put this in abstraction file
	 _this.drawDataCell(tr, {data:_this.records[r].name, dclass:'row_name row_meta'});
	 t.datebox.map[r] = [];
		for(c = 0, _c = options.cols; c < _c; c++) {
		 td = _this.drawDataCell(tr, {dclass:'row_data'});
		 _this.setEditTrigger( td, true );
		 t.datebox.map[r][c] = td;
		 t.datebox.map[r][c].dataID = null;
		}
	 //TODO: Put this in abstraction file
	 //Column:Updated
	 //_this.drawDataCell(tr, {data:_this.records[r].updated, dclass:'row_updated row_meta'});
	 tb.appendChild( tr );
	}
 _this.table = t;
 //Documents elements must be added to document body before
 //slider can be initiated. this is a prototype bug.
 //TODO: find a better workaround for this bug
 container.appendChild(_this.table);
	//Because of some strange JQUery bug, we have give this time to render properly
	//TODO: Find a fix for this
	 //Lastly, we want to draw the slider
	 _this.drawSlider( sl.track, sl.handle, sl.lcorner, sl.rcorner,
		function(thisDate) {
		  Apx.Util.writeText(sl.handle, thisDate.year);
			if(options.onSlide) {
			 options.onSlide(thisDate);
			}
		}
	 );
	 //fill the table
	 _this.fillTable();
 return true;
}

/**
 * Returns a date item from the range list.
 * 
 * @param {Int} index
 * 		Array index of the item
 * @return {Object[Date]} 
 * 		Date object corresponding with a location on a
 * 		control slider
 */	
Apx.DateBox.prototype.getDateByRangeItem = function(index) {
 var _this = this;
 return _this.range[index];
}

/**
 * Returns the highest possible range amount. This is needed for calculating
 * slider ratios.
 * 
 * @return {Int}
 * 		Length of range
 */	
Apx.DateBox.prototype.getRangeMax = function() {
 var _this = this;
 return _this.range.length - 1;
}

/**
 * Calculates all the slider ratios for mapping slider coordinates to table values
 * @param {Int} cols
 * @param {Int} startOffset
 * @return {Array}
 * 		Range list
 */	
 Apx.DateBox.prototype.getRange = function( cols, startOffset ) {
  var _this = this;
  var maxItem, minItem, ou, v, _v,
  	j, n, minItem_temp, maxItem_temp,
	thisDate, thisLen;
  maxItem = null;
  minItem = null;
  ou = [];
	//data is available
		if(Apx.Util.size(_this.vals)) {
		for(v in _this.vals) {
		 _v = _this.vals[v];
 		 //must offset the month by negative one. we are assuming array indexed dates,
		 //whereas the server is sending literal month indexes
	 	 thisDate = _this.grabDate({year:_v.year, month:_v.month, humanInput:true});
			if( maxItem == null || maxItem.seconds < thisDate.seconds ) {
			 maxItem = thisDate;
			}
			if( minItem == null || minItem.seconds > thisDate.seconds ) {
			 minItem = thisDate;
			}
	 	}
	}
	//no data available - go with current date
	//This is causing the slider handle problem
	else {
	 maxItem = _this.grabDate();
	 minItem = _this.grabDate({thisMonthOffset:-9});	 
	}
 minItem_temp = _this.rangeMinFunc( minItem.year, minItem.month, cols );
 minItem = _this.grabDate( {year:minItem_temp.year, month:minItem_temp.month} );
 maxItem_temp = _this.rangeMaxFunc( maxItem.year, maxItem.month, startOffset );
 maxItem = _this.grabDate( {year:maxItem_temp.year, month:maxItem_temp.month} );
	for( j = 0, n = minItem.seconds; n < maxItem.seconds; j++ ) {
	 thisDate = _this.grabDate( {year:minItem.year, month:minItem.month + j} );
	 thisLen = ou.length;
	 ou[j] = {
	 	year : thisDate.year,
	 	month : thisDate.month
	 };
	 n = thisDate.seconds;
	}
 _this.rangeMaxItem = maxItem;
 _this.rangeMinItem = minItem;
 return ou;
}

/**
 * Wrapper for editTrigger
 * 
 * @param {HTMLElement} thisElm
 * 		Element to be set as the input trigger
 * @return {Bool}
 */		
Apx.DateBox.prototype.setEditTrigger = function( thisElm) {
 var _this = this;
 thisElm.onclick = function() {_this.editTrigger(thisElm, true);}
 return true;
}

/**
 * Sets an element as an iput trigger
 * 
 * @param {HTMLElement} elm
 * 		Element to be set as the input trigger
 * @param {Bool} setFocus
 * @return {Bool}
 */
Apx.DateBox.prototype.editTrigger = function(elm, setFocus) {
 var _this = this;
 var thisInput, docFunc;
 elm.originalAction = elm.onclick;
 thisInput = document.createElement( 'input' );
 thisInput.type = 'text';
 	if( elm.updater.action == "edit" ) {
 	 thisInput.originalValue = thisInput.value = Apx.Util.getText(elm);
	}
	else {
	 thisInput.originalValue = thisInput.value;
	}
 Apx.Util.writeText(elm, thisInput);
	//be sure to only set the focus when
	//the table will only have one input element
	//if you have multiple inputs, and you try to focus each one
	//this will cause the updater to fire.
	if(setFocus) {
	 thisInput.focus();
	}
 //the closure doesnt keep track of current thisInput when
 //using the api call, so we need to map it here for later use.
 elm.tempInput = thisInput;
 //need this for weird FF and IE7 quirks
 elm.onclick = Apx.Util.emptyFunction;
 	docFunc = function(e) {
		//if bad data, go back to default value
		if(
			!isNaN(elm.tempInput.value) &&
			elm.tempInput.originalValue != elm.tempInput.value
		) {
	 	 //dataID is set in fillTable()
	 	 _this.updateData( elm.tempInput.value, elm );
	 	 Apx.Util.writeText( elm, elm.tempInput.value );
		}
		else {
		 Apx.Util.writeText( elm, elm.tempInput.originalValue );
		}
 	 elm.onclick = elm.originalAction;
 	 elm.originalAction = undefined;
 	};
 Apx.Util.listen(thisInput, 'blur', docFunc );
 return true;
}

/**
 * Updates the server with new data after a user has made modifications
 * 
 * @param {String} val
 * 		User value
 * @param {HTMLElement} elm
 * 		elm should have a property called "updater".
 * 		elm.updater contains arious user hooks/options for processing updated data.
 * @codebegin
 *			updater = {
 *			 	url : "/foo.jsp" , //the url to where the updating occurs
 *				method : "get" , //http method
 *				//these are the mappings of certain data pieces to http arg names
 *				//these can be any arbitrary arguments.
 *				//each value can be a strin, number, or function call
 *				extraArgs : {
 *					someVal1 : 1,
 *					someVal2 : "foo" ,
 *					someVal3 : function( args, val ) {
 *						return val;
 *					}
 *				} ,
 *				//this is assigned to an anonymous function
 *				//whose first argument is an HTTPXMLResponse
 *				responseProcessor : function(transport) {
 *				 return transport.responseText;
 *				}
 *			 };
 * @codeend
 * @return {Bool}
 *
 */	
Apx.DateBox.prototype.updateData = function( val, elm ) {
 var _this = this;
 var netArgs, a, _a, temp_key, temp_val;
	if( elm.updater.action == "edit" ) {
	 _this.editDate( elm.updater.dateid, val );
	}
	if( _this.updater != null ) {
	 netArgs = {};
		if( elm.updater.action == "add" ) {
		 netArgs.typeid = elm.updater.typeid;
		 netArgs.year = elm.updater.year;
		 netArgs.month = elm.updater.humanMonth;
		 netArgs.val = val;
		}
		else if( elm.updater.action == "edit" ) {
		 netArgs.dateid = elm.updater.dateid;
		 netArgs.val = val;			 
		}
		if( _this.updater.extraArgs ) {
			for(a in _this.updater.extraArgs) {
			 _a = _this.updater.extraArgs[a];
				if( (typeof _a).toString().toLowerCase() == 'function' ) {
				 temp_key = a;
				 temp_val = _a( elm.updater, val );
				}
				else {
				 temp_key = a;
				 temp_val = _a;
				}
				if( netArgs[temp_key] == undefined && temp_val != null ) {
				 netArgs[temp_key] = temp_val;
				}
			} 
		}
	 Apx.Util.ajax( _this.updater.url,
	 	{
			method : _this.updater.method,
			parameters : netArgs,
			onSuccess :
				function( transport ) {
				 var res_dateid;
					//if a processing function is supplied, use it
					if( _this.updater.responseProcessor ) {
						 res_dateid = _this.updater.responseProcessor( transport, elm.updater.action );
						}
					else {
					 res_dateid = parseInt( transport.responseText );
					}
					if( elm.updater.action == "add" ) {
					 	 _this.addDate(
						res_dateid,
						elm.updater.typeid,
						elm.updater.year,
						elm.updater.humanMonth,
						val
					 );
					 //now that this has all been processed, lets rebuild the updater
					 //this is an important step
					 elm.updater = _this.buildUpdater({
					 	keyID : res_dateid,
					 	foreignID : elm.updater.typeid
					 });
					 //console.dir(elm.updater);
					}
				}
		}
	 );
	}
 return true;
}

/**
 * Adds a new user entry to the data table
 * 
 * @param {Int} dateid
 * @param {Int} typeid
 * @param {Int} year
 * @param {Int} month
 * @param {String,Number} val
 * @return {Bool}
 * 		Success
 */	
Apx.DateBox.prototype.addDate = function( dateid, typeid, year, month, val ) {
 var _this = this;
 _this.vals[dateid] = {
 	year : year,
 	month : month,
	data : val,
	foreignid : typeid
 };
 return true;
}

/**
 * Edit an existing data entry
 * 
 * @param {Int} dateid
 * @param {String,Number} val
 * @return {Bool}
 * 		Success
 */	
Apx.DateBox.prototype.editDate = function( dateid, val ) {
 var _this = this;
 _this.vals[dateid].data = val;
 return true;
}

/**
 * Draws the table but does not fill it
 * 
 * @param {Object} options
 * @paramprop options {Int} endYear(...)
 * @paramprop options {Int} endMonth(...)
 * @paramprop options {String,Number} defaultVa('--')
 * 		Value to use if no value exists
 * @return {Bool}
 */	
Apx.DateBox.prototype.fillTable = function( options ) {
 var _this = this;
 var c, _c, r, dataFound, thisTable, startMonth,
 	startDate, searchMonth, thisDate, thisData,
	valText;
 options = Apx.Util.args(options,{
	endYear : _this.rangeMaxItem.year ,
	endMonth : _this.rangeMaxItem.month ,
	defaultVal : "--" ,
	firstLoad : false
 });
 dataFound = false;
 thisTable = _this.table.datebox;
 startMonth = options.endMonth - thisTable.cols + 1;
 startDate = _this.grabDate( {year:options.endYear , month:startMonth} );
	for(c = 0, _c = thisTable.cols; c < _c; c++) {
		 theDate = _this.grabDate( {year:startDate.year, month:startDate.month + c} );
		 thisHead = _this.months[theDate.month];
 	 Apx.Util.writeText( thisTable.header[c], thisHead );
 	}
 	for(r in thisTable.map) {
		for(c = 0, _c = thisTable.cols; c < _c; c++) {
		 searchMonth = startDate.month + c;
 		 thisDate = _this.grabDate( {year:startDate.year, month:searchMonth} );
 		 thisData = _this.getData( thisDate.year, thisDate.humanMonth, r, options.defaultVal );
		 thisTable.map[r][c].updater = _this.buildUpdater({
		 	keyID : thisData.keyID,
			foreignID : r,
			thisDate : thisDate
		 });
		 valText = Apx.Util.formatNumber(thisData.keyVal, _this.floatPrecision);
 		 Apx.Util.writeText( thisTable.map[r][c], valText );
 		}
 	}
 	//if no data was found, assign first time inputs to all elms
	//TODO: this should eventually be moved into drawTable, possibly
	if(!Apx.Util.size(_this.vals)) {
	 _this.triggerAll(thisTable.map, thisTable.cols);
	}
 return true;
}

/**
 * Builds the updater
 * 
 * @param {Object} options
 * @paramprop options {Int} keyID(false)
 * @paramprop options {Int} foreignID(false)
 * @paramprop options {Object} thisDate(false)
 * @return {Object}
 * @returnprop {String} action
 * @returnprop {Int} typeid
 * @returnprop {Int} year
 * @returnprop {Int} month
 * @returnprop {Int} humanMonth
 * @returnprop {Int} foreignId
 */
Apx.DateBox.prototype.buildUpdater = function(options) {
 var _this = this;
 var updater;
 options = Apx.Util.args(options,{
	keyID : false,
	foreignID : false,
	thisDate : false
 });
	//if an entry exists
	if( options.keyID ) {
	 updater = {
	 	action : 'edit',
		dateid : options.keyID,
		foreignid : options.foreignID
	 };
	}
	//new entry
	else {
	 updater = {
	 	action : 'add',
		typeid : options.foreignID,
		year : options.thisDate.year,
		month : options.thisDate.month,
		humanMonth : options.thisDate.humanMonth,
		foreignid : options.foreignID
	 }
	}
 return updater;
}

/**
 * Searches data tables and returns value
 * 
 * @param {Object} _map
 * 		This is a datebox elm map reference
 * @param {Int} _cols
 * @return {Bool}
 */
Apx.DateBox.prototype.triggerAll = function(_map, _cols) {
 var _this = this;
 var r, c, _c;
	for(r in _map) {
		for(c = 0, _c = _cols; c < _c; c++) {
		 //2nd arg needs to be false, since we have multiple
		 //inputs, we cant focus them
		 _this.editTrigger(_map[r][c], false);
	 	}
	}
 return true;
}

/**
 * Searches data tables and returns value
 * 
 * @param {Int} year
 * @param {Int} month
 * @param {Int} foreignid
 * @param {String,Number} defaultVal
 * @return {String,Number}
 * 
 */		
Apx.DateBox.prototype.getData = function( year, month, foreignid, defaultVal) {
 var _this = this;
 var v, thisVal, val;
 thisVal = {
 	keyID : null,
 	keyVal : defaultVal,
	found : false
 };
	for(v in _this.vals) {
 	 val = _this.vals[v];
 		if(
 			parseInt(val.year) == parseInt(year) &&
 			parseInt(val.month) == parseInt(month) &&
 			parseInt(val.foreignid) == parseInt(foreignid)
 		) {
 		 thisVal = {
		 	keyID : v ,
			keyVal : val.data,
			found : true
		 };
 		 break;
 		}
	}
 return thisVal;
}

/**
 * Creates object containing date info
 * 
 * @param {Int} year 
 * @param {Int} month
 * @param {Object} options
 * @paramprop options {Bool} debug(false)
 * @paramprop options {Bool} humanInput(false);
 *		Determines whether or not the month is on a 1 - 12 scale
 * @paramprop options {Int} thisMonthOffset(false)
 * @paramprop options {Int} year(false)
 * @paramprop options {Int} month(false)
 * @return {Object}
 * @returnprop {Int} year
 *		Fully 4 digit year
 * @returnprop {Int} month
 *		Array indexed month (0 - 11)
 * @returnprop {Int} humanMonth
 *		Human readable month (1 - 12)
 * 
 */	
Apx.DateBox.prototype.grabDate = function( options ) {
 var _this = this;
 var thisDate, out;
 options = Apx.Util.args(options,{
	debug : false,
	humanInput : false,
	thisMonthOffset : false,
	year : false,
	month : false
 });
 	//sometimes we will deal with human month inputs (1 - 12)
	//instead of array indices (0 - 11)
	if(options.humanInput) {
	 --options.month;
	}
	if(options.year !== false && options.month !== false) {
	 thisDate = new Date;
	 thisDate.setFullYear(options.year);
	 thisDate.setMonth(options.month);
	 thisDate.setDate(1);
	}
	else {
	 thisDate = new Date();
		if(options.thisMonthOffset !== false) {
		 thisDate.setMonth(thisDate.getMonth() + options.thisMonthOffset);
		}
	}
 out = {
 	year : thisDate.getFullYear() ,
 	month : thisDate.getMonth(),
 	seconds : thisDate.getTime(),
	humanMonth : thisDate.getMonth() + 1
 };
	if(options.debug) {
	 //nothing
	}
 return out;
}

/**
 * Creates slider which is used to control data
 * 
 * @param {HTMLElement} trackElm
 * @param {HTMLElement} handleElm
 * @param {HTMLElement} lcornerElm
 * @param {HTMLElement} rcornerElm
 * @param {Function} userFunc
 * 		Slider updating hook
 * @callbackparam userFunc {HTMLElement} 0
 *		Slider handle
 * @callbackparam userFunc {Object} 1
 *		Contains date information
 * @return {Bool}
 */
Apx.DateBox.prototype.drawSlider = function( trackElm, handleElm, lcornerElm, rcornerElm, userFunc ) {
 var _this = this;
 var thisSlider, rangeMax, thisRange, startFillDate;
 rangeMax = _this.getRangeMax();
 thisRange = Apx.Util.makeRange( 0, rangeMax );
 startFillDate = _this.getDateByRangeItem(rangeMax);
 userFunc(startFillDate);
	thisSlider = new Apx.Widget.Slider(handleElm, trackElm, thisRange, 'end', function( v ) {
	  fillDate = _this.getDateByRangeItem(v);
	   userFunc(fillDate);
	  _this.fillTable( { endMonth:fillDate.month, endYear:fillDate.year } );
	});
	Apx.Util.listen(lcornerElm, 'click', function(){
	 thisSlider.setValueBy(-1);
	});
	Apx.Util.listen(rcornerElm, 'click', function(){
	 thisSlider.setValueBy(1);
	});
 return true;
}

