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

	var EditSession = require("ace/edit_session").EditSession;
	var UndoManager = require("ace/undomanager").UndoManager;
	var net = require("ace/lib/net");
	
	var modelist = require("./modelist");
	/*********** demo documents ***************************/
	var fileCache = {};
	
	function initDoc(file, path, doc) {
	    if (doc.prepare)
	        file = doc.prepare(file);
	
	    var session = new EditSession(file);
	    session.setUndoManager(new UndoManager());
	    doc.session = session;
	    doc.path = path;
	    if (doc.wrapped) {
	        session.setUseWrapMode(true);
	        session.setWrapLimitRange(80, 80);
	    }
	    var mode = modelist.getModeFromPath(path);
	    session.modeName = mode.name;
	    session.setMode(mode.mode);
	}
	
	
	function makeHuge(txt) {
	    for (var i = 0; i < 5; i++)
	        txt += txt;
	    return txt;
	}
	
	var docs = {
	    "docs/javascript.js": "JavaScript",
	    "docs/css.css": "CSS",
	    "docs/html.html": "HTML",
	    "docs/php.php": "PHP",
	//    "docs/toto.html": "toto.html",
	  //  "docs/toto.js": "toto.js",
	};
	
	var ownSource = {
	    /* filled from require*/
	};
	
	var hugeDocs = {
	   // "build/src/ace.js": "",
	   // "build/src-min/ace.js": ""
	};
	
	if (window.require && window.require.s) try {
	    for (var path in window.require.s.contexts._.defined) {
	        if (path.indexOf("!") != -1)
	            path = path.split("!").pop();
	        else
	            path = path + ".js";
	        ownSource[path] = "";
	    }
	} catch(e) {}
	
	function prepareDocList(docs) {
	    var list = [];
	    for (var path in docs) {
	        var doc = docs[path];
	        if (typeof doc != "object")
	            doc = {name: doc || path};
	
	        doc.path = path;
	        doc.desc = doc.name.replace(/^(ace|docs|demo|build)\//, "");
	        if (doc.desc.length > 18)
	            doc.desc = doc.desc.slice(0, 7) + ".." + doc.desc.slice(-9);
	
	        fileCache[doc.name] = doc;
	        list.push(doc);
	    }
	
	    return list;
	}
	
	function loadDoc(name, callback) {
	
	    var doc = fileCache[name];
	    if (!doc)
	        return callback(null);
	
	    if (doc.session)
	        return callback(doc.session);
	
	    // TODO: show load screen while waiting
	    var path = doc.path;
	    var parts = path.split("/");
	    if (parts[0] == "docs")
	        path = "demo/kitchen-sink/" + path;
	    else if (parts[0] == "ace")
	        path = "lib/" + path;
	
	    net.get(path, function(x) {
	        initDoc(x, path, doc);
	        callback(doc.session);
	    });
	}
	
	module.exports = {
	    fileCache: fileCache,
	    docs: prepareDocList(docs),
	    initDoc: initDoc,
	    loadDoc: loadDoc
	};
	module.exports.all = {
	    "Mode Examples": module.exports.docs,
	};

});

