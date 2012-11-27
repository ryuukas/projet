define(function(require, exports, module) {
	/************** modes ***********************/
	var modes = [];
	function getModeFromPath(path) {
	    var mode = modesByName.text;
	    var fileName = path.split(/[\/\\]/).pop();
	    for (var i = 0; i < modes.length; i++) {
	        if (modes[i].supportsFile(fileName)) {
	            mode = modes[i];
	            break;
	        }
	    }
	    return mode;
	}
	
	var Mode = function(name, desc, extensions) {
	    this.name = name;
	    this.desc = desc;
	    this.mode = "ace/mode/" + name;
	    if (/\^/.test(extensions)) {
	        var re = extensions.replace(/\|(\^)?/g, function(a, b){
	            return "$|" + (b ? "^" : "^.*\\.");
	        }) + "$";
	    } else {
	        var re = "^.*\\.(" + extensions + ")$";
	    }   
	
	    this.extRe = new RegExp(re, "g");
	};
	
	Mode.prototype.supportsFile = function(filename) {
	    return filename.match(this.extRe);
	};
	
	var modesByName = {
	    css:        ["CSS"          , "css"],
	    html:       ["HTML"         , "htm|html|xhtml"],
	    javascript: ["JavaScript"   , "js"],
	    php:        ["PHP"          , "php|phtml"],
	};
	
	for (var name in modesByName) {
	    var mode = modesByName[name];
	    mode = new Mode(name, mode[0], mode[1]);
	    modesByName[name] = mode;
	    modes.push(mode);
	}
	
	module.exports = {
	    getModeFromPath: getModeFromPath,
	    modes: modes,
	    modesByName: modesByName
	};

});

