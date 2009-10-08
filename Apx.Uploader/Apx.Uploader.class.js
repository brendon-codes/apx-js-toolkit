/**
 * Dynamic Ajax Uploader Wrapper
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

Apx.Core.require_script( 'Uploader', 'lib/swfupload' );

Apx.Uploader = new Object;

Apx.Uploader.map = [];

Apx.Uploader.list = null;

Apx.Uploader.loaded = false;

Apx.Uploader.status = null;

Apx.Uploader.swfu = null;

Apx.Uploader.current = null;

/**
 * Flash callback
 */
Apx.Uploader.uploadQueueComplete = function(){
 Apx.Util.writeText(Apx.Uploader.status, 'Upload Complete.');
 Apx.Uploader.map = [];
}

/**
 * Flash callback
 * @param {Int} code
 * @param {Object} status
 * @param {Int} httpStatus
 */
Apx.Uploader.uploadError = function(code, status, httpStatus){
	if( code === -10 ) {
	 Apx.Uploader.uploadFileComplete(status);
	}
}

/**
 * Flash callback
 * @param {Object} status
 */
Apx.Uploader.uploadFileComplete = function(status) {
 var index;
	if( (index = Apx.Uploader.map_search({file:status.name})) !== false ) {
	 Apx.Uploader.map_remove( index );
	}
}

/**
 * Flash callback
 * @param {Object} status
 */
Apx.Uploader.fileQueued = function(status) {
 var nl;
 nl = document.createElement('li');
 Apx.Util.writeText( nl, status.name );
 nlstat = document.createElement('span');
 Apx.Util.addClass(nlstat, 'aph_uploader_uploadStat');
 nl.appendChild(nlstat);
 Apx.Uploader.list.appendChild( nl );
 Apx.Uploader.map_add( nl, status.name, nlstat );
}

/**
 * Flash callback
 * @param {Object} status
 */
Apx.Uploader.fileStart = function(status) {
	if( Apx.Uploader.current === null ) {
	 Apx.Util.writeText(Apx.Uploader.status, 'Uploading...');
	}
 Apx.Uploader.current = Apx.Uploader.map_search({file:status.name});
}

/**
 * Flash callback
 * @param {String} file
 * @param {Int} bytesloaded
 * @param {Int} bytestotal
 */
Apx.Uploader.uploadProgress = function(file, bytesloaded, bytestotal) {
 var percent;
 percent = Math.ceil((bytesloaded / bytestotal) * 100);
 Apx.Util.writeText(Apx.Uploader.map[Apx.Uploader.current].stat, " : " + percent + "%");
}

/**
 * Removes item from internal map
 * @param {Int} index
 * @return {Bool}
 */
Apx.Uploader.map_remove = function(index) {
 var elm;
 elm = Apx.Uploader.map[index].node;
	Apx.Util.hide(elm, function() {
	 elm.parentNode.removeChild(elm);
	});
 return true;
}

/**
 * Adds item to internal map
 * @param {HTMLElement} elm
 * @param {String} name
 * @param {HTMLElement} statElm
 * @return {Bool}
 */
Apx.Uploader.map_add = function(elm, name, statElm) {
 Apx.Uploader.map[Apx.Uploader.map.length] = {
	active : true,
	file : name,
	node : elm,
	stat : statElm
 };
 return true;
}

/**
 * Searches internal map
 * @param {Object} crit
 * @return {Bool}
 */
Apx.Uploader.map_search = function(crit) {
 var i, _i, prop;
	for( i = 0, _i = Apx.Uploader.map.length; i < _i; i++ ) {
		if(Apx.Uploader.map[i].active) {
			for(prop in crit) {
				if(Apx.Uploader.map[i][prop] === crit[prop]) {
				 return i;
				}
			}
		}
	}
 return false;
}

/**
 * Sets up a new uploader item
 * @param {Object} options
 * @paramprop options {HTMLElement} status
 * @paramprop options {HTMLElement} uploader
 * @paramprop options {HTMLElement} files
 * @paramprop options {String} action
 * @paramprop options {String} browse_html
 * @paramprop options {String} upload_html
 * @constructor
 */
Apx.Uploader.Item = function(options){
 options = Apx.Util.args(options,{
 	status : false,
	uploader : false,
	files : false,
	action : '#',
	browse_html : "<input type='button' value='Browse...' />",
	upload_html : "<input type='button' value='Uploader' />"
 });
	if(options.status === false || options.files === false || options.uploader === false) {
	 return false;
	}
	if(Apx.Uploader.loaded) {
	 alert("Apx.Uploader: Can only run one instance of the uploader.");
	 return false;
	}
	else {
	 Apx.Uploader.loaded = true;
	}
	Apx.Util.domload(function(){
	 Apx.Uploader.list = Apx.Util.i(options.files); 
	 Apx.Uploader.status = Apx.Util.i(options.status); 
	 Apx.Uploader.swfu = new SWFUpload({
		upload_script : options.action,
		target : options.uploader,
		browse_link_innerhtml : options.browse_html,
		upload_link_innerhtml : options.upload_html,
		flash_path : Apx.Core.getPath("Uploader", "lib/swfupload.swf"),
		allowed_filesize : 65536,
		allowed_filetypes : "*.*;",
		allowed_filetypes_description : "All Files...",
		browse_link_class : "aph_uploader_buttonbrowse",
		upload_link_class : "aph_uploader_buttonup",
		auto_upload : false,
		flash_loaded_callback : 'Apx.Uploader.swfu.flashLoaded',
		upload_file_start_callback : 'Apx.Uploader.fileStart',
		upload_progress_callback : 'Apx.Uploader.uploadProgress',
		upload_file_queued_callback : 'Apx.Uploader.fileQueued',
		upload_file_complete_callback : 'Apx.Uploader.uploadFileComplete',
		upload_queue_complete_callback : 'Apx.Uploader.uploadQueueComplete',
		upload_file_error_callback : 'Apx.Uploader.uploadError'
	 });
	});
}
