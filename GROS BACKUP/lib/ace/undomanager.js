define(function(require, exports, module) {
"use strict";

var UndoManager = function() {
    this.reset();
};

(function() {

    /**
    * UndoManager.execute(options) -> Void
    * - options (Object): Contains additional properties
    *
    * Provides a means for implementing your own undo manager. `options` has one property, `args`, an [[Array `Array`]], with two elements:
    *
    * * `args[0]` is an array of deltas
    * * `args[1]` is the document to associate with
    *
    **/
    this.execute = function(options) {
        var deltas = options.args[0];
        this.$doc  = options.args[1];
        this.$undoStack.push(deltas);
        this.$redoStack = [];
    };

    /**
    * UndoManager.undo(dontSelect) -> Range
    * - dontSelect (Boolean): {:dontSelect}
    *
    * [Perform an undo operation on the document, reverting the last change. Returns the range of the undo.]{: #UndoManager.undo}
    **/
    this.undo = function(dontSelect) {
        var deltas = this.$undoStack.pop();
        var undoSelectionRange = null;
        if (deltas) {
            undoSelectionRange =
                this.$doc.undoChanges(deltas, dontSelect);
            this.$redoStack.push(deltas);
        }
        return undoSelectionRange;
    };

    /**
    * UndoManager.redo(dontSelect) -> Void
    * - dontSelect (Boolean): {:dontSelect}
    *
    * [Perform a redo operation on the document, reimplementing the last change.]{: #UndoManager.redo}
    **/
    this.redo = function(dontSelect) {
        var deltas = this.$redoStack.pop();
        var redoSelectionRange = null;
        if (deltas) {
            redoSelectionRange =
                this.$doc.redoChanges(deltas, dontSelect);
            this.$undoStack.push(deltas);
        }
        return redoSelectionRange;
    };

    /**
    * UndoManager.reset() -> Void
    *
    * Destroys the stack of undo and redo redo operations.
    **/
    this.reset = function() {
        this.$undoStack = [];
        this.$redoStack = [];
    };

    /**
    * UndoManager.hasUndo() -> Boolean
    *
    * Returns `true` if there are undo operations left to perform.
    **/
    this.hasUndo = function() {
        return this.$undoStack.length > 0;
    };

    /**
    * UndoManager.hasRedo() -> Boolean
    *
    * Returns `true` if there are redo operations left to perform.
    **/
    this.hasRedo = function() {
        return this.$redoStack.length > 0;
    };

}).call(UndoManager.prototype);

exports.UndoManager = UndoManager;
});
