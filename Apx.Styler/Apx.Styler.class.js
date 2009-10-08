/**
 * Sets up page wide stylesheet rules
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

/**
 * Needed as base for all Styler operations
 * @constructor
 */
Apx.Styler = function(){
 this.ss = Apx.Util.ss();
}

/**
 * Adds a set of rules
 * @param {Object} rules
 * @return {Int}
 * 		Index of last rule
 */
Apx.Styler.prototype.Add = function(rules) {
 var thisRule, st;
	for(thisRule in rules) {
	 Apx.Styler.makeRuleSet( this.ss, thisRule, rules[thisRule] );
	}
	if(this.ss.rules){
	 return (this.ss.rules.length - 1);
	}
	else if(this.ss.cssRules) {
	 return (this.ss.cssRules.length - 1);
 	}
}

/**
 * Clear all styler rules
 */
Apx.Styler.prototype.clearAll = function() {
 var i, _i, rules;
	if(this.ss.rules){
	 rules = this.ss.rules;
	}
	else if(this.ss.cssRules) {
	 rules = this.ss.cssRules;
 	}
	for(i = rules.length - 1; i >= 0; i--) {
	 //console.log(rules[i], i);
	 this.Delete(i);
	}
 return true;
}

/**
 * Deletes a rule
 * @param {Int} index
 * @return {Bool}
 */
Apx.Styler.prototype.Delete = function(index) {
	if(this.ss.removeRule) {
	 this.ss.removeRule(index);
	}
	else if(this.ss.deleteRule) {
		/*
		 * Strange Error
		 * FireFox 2.0.0.11
		 * GreaseMonkey 0.7.20070607.0
		 * "Index or size is negative or greater than the allowed amount"
		 */
		try {
		 this.ss.deleteRule(index);
	 	} catch(e) {}
	}
 return true;
}

/**
 * Adds rules from a raw css block
 * @param {String} str
 * @return {Int}
 */
Apx.Styler.prototype.processRawRules = function(str) {
 var m, i, _i, p1, p2, p3, p4,
 	t, a, key, p, _p, r, n;
 p1 = /[\s\S]+?\{[\s\S]+?\}/ig;
 p2 = /([\s\S]+?)\{([\s\S]+?)\}/i;
 p3 = /\s*;\s*/ig;
 p4 = /\s*:\s*/;
 m = str.match(p1);
 a = {};
	for(i = 0, _i = m.length; i < _i; i++) {
	 t = m[i].match(p2);
	 key = Apx.Util.trim(t[1]);
	 a[key] = {};
	 r = t[2].split( p3 );
		for(p = 0, _p = r.length; p < _p; p++) {
			if(r[p] !== '') {
			 n = r[p].split( p4 );
			 itemKey = Apx.Util.trim(n[0]);
			 a[key][itemKey] = Apx.Util.trim(n[1]);
			}
		}
	}
 return this.Add(a);
}

/**
 * Makes a set of rules
 * @param {StylesheetElement} ss
 * @param {String} sel
 * @param {Object} vals
 * @return {Bool}
 */
Apx.Styler.makeRuleSet = function( ss, sel, vals ) {
 var prop;
	for(prop in vals) {
	 Apx.Styler.makeRule( ss, sel, prop, vals[prop] );
	}
 return true;
}

/**
 * Code to make a rule
 * @param {StylesheetElement} ss
 * @param {String} sel
 * @param {String} prop
 * @param {String} val
 * @return {Bool}
 */
Apx.Styler.makeRule = function(ss, sel, prop, val) {
	if(ss.addRule) {
	 ss.addRule(sel, prop + ":" + val, 0);
	}
	else if(ss.insertRule) {
	 ss.insertRule(sel + " {" + prop + ":" + val + "}", 0);
	}
 return true;
}
