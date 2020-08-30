/// <reference path="../AlphaSudokuService/SudokuService.ts" />
/// <reference path="../AlphaSudokuService/SudokuValidatorResult.ts" />
/// <reference path="../AlphaSudokuService/SudokuServiceResponse.ts" />
/// <reference path="./SudokuServiceBridgeHint.ts" />
console.log("SudokuBridgeService");
var SudokuBridgeService = /** @class */ (function () {
    function SudokuBridgeService() {
        var _this = this;
        this.getHint = function (puzzleString, callback) {
            _this.clientCallback = callback;
            _this.service.getHint(puzzleString, _this.onHintReceived);
        };
        this.onHintReceived = function (sudokuServiceResponse) {
            if (!sudokuServiceResponse.isValid) {
                _this.clientCallback(null);
            }
            else {
                var ssbHint = SudokuServiceBridgeHint.fromSudokuServiceHint(sudokuServiceResponse.getHint());
                _this.clientCallback(ssbHint);
            }
        };
        this.validate = function (puzzleString, callback) {
            _this.clientCallback = callback;
            _this.service.validate(puzzleString, _this.onValidate);
        };
        this.onValidate = function (validationResponse) {
            var isValid = validationResponse.isValid;
            var invalidCells = validationResponse.errors;
            var isComplete = validationResponse.isComplete;
            var validationResult = new SBSValidationResult(isValid, invalidCells, isComplete);
            _this.clientCallback(validationResult);
        };
        this.getNewPuzzle = function (callback) {
            _this.clientCallback = callback;
            _this.service.getNewPuzzle(_this.onNewPuzzle);
        };
        this.onNewPuzzle = function (serviceResponse) {
            var puzzle = new SBSPuzzle("id", serviceResponse.puzzle.start);
            _this.clientCallback(puzzle);
        };
        this.service = new SudokuService();
        this.clientCallback = null;
    }
    return SudokuBridgeService;
}());
var SBSPuzzle = /** @class */ (function () {
    function SBSPuzzle(id, puzzleString) {
        this.id = id;
        this.puzzleString = puzzleString;
    }
    return SBSPuzzle;
}());
var SBSValidationResult = /** @class */ (function () {
    function SBSValidationResult(isValid, invalidCells, isComplete) {
        this.isValid = isValid;
        this.invalidCells = invalidCells;
        this.isComplete = isComplete;
    }
    return SBSValidationResult;
}());
