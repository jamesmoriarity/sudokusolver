/// <reference path="./SudokuServiceHint.ts" />
var SudokuServiceResponse = /** @class */function () {
    function SudokuServiceResponse(isValid) {
        var _this = this;
        this.isValid = false;
        this.isComplete = false;
        this.puzzle = null;
        this.setIsComplete = function (isComplete) {
            _this.isComplete = isComplete;
        };
        this.setPuzzle = function (puzzle) {
            var puzzleClone = Object.assign({}, puzzle);
            _this.puzzle = puzzleClone;
        };
        this.addError = function (error) {
            _this.errors.push(error);
        };
        this.setErrors = function (errors) {
            _this.errors = errors;
        };
        this.setHint = function (hint) {
            _this.hint = hint;
        };
        this.getHint = function () {
            return _this.hint;
        };
        this.isValid = isValid;
        this.errors = [];
        this.className = "c";
    }
    return SudokuServiceResponse;
}();
var SudokuPuzzle = /** @class */function () {
    function SudokuPuzzle() {}
    return SudokuPuzzle;
}();