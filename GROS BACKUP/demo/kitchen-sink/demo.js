/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */


define(function(require, exports, module) {
"use strict";

	//require("ace/lib/fixoldbrowsers");
	//require("ace/config").init();
	var env = {};
	
	//var dom = require("ace/lib/dom");
	//var net = require("ace/lib/net");
	//var lang = require("ace/lib/lang");
	//var useragent = require("ace/lib/useragent");
	
	//var event = require("ace/lib/event");
	var theme = require("ace/theme/chrome"); // Theme choisi
	var Editor = require("ace/editor").Editor;
	
	var doclist = require("./doclist");
	var modelist = require("./modelist");
	//var layout = require("./layout");
	//var TokenTooltip = require("./token_tooltip").TokenTooltip;
	var util = require("./util");
	var saveOption = util.saveOption;
	var fillDropdown = util.fillDropdown;
	var bindCheckbox = util.bindCheckbox;
	var bindDropdown = util.bindDropdown;
	var container = document.getElementById("editor");
	
	// Splitting.
	var Split = require("ace/split").Split;
	var split = new Split(container, theme, 1);
	env.editor = split.getEditor(0);
	split.on("focus", function(editor) {
	    env.editor = editor;
	//    updateUIEditorOptions();
	});
	env.split = split;
	
	var docEl = document.getElementById("doc");
	var modeEl = document.getElementById("mode");
	
	fillDropdown(docEl, doclist.all);
	
	//fillDropdown(modeEl, modelist.modes);
	var modesByName = modelist.modesByName;
	bindDropdown("mode", function(value) {
	    env.editor.session.setMode(modesByName[value].mode || modesByName.text.mode);
	    env.editor.session.modeName = value;
	});
	
	bindDropdown("doc", function(name) {
		// name = nom du fichier | session = la page
	    doclist.loadDoc(name, function(session) {
	        if (!session)
	            return;
	        session = env.split.setSession(session);
	        env.editor.focus();
	    });
	});
	
	function updateUIEditorOptions() {
	 
	}


});

