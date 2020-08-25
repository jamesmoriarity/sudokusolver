/// <reference path="../AlphaSudokuService/SudokuService.ts" />
/// <reference path="../AlphaSudokuService/SudokuValidatorResult.ts" />
/// <reference path="../AlphaSudokuService/SudokuServiceResponse.ts" />
/// <reference path="./SudokuServiceBridgeHint.ts" />
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
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
                _this.clientCallback(new SBSResponse(false));
            }
            else {
                var sbsResponse = new SBSResponse(true);
                var ssbHint = SudokuServiceBridgeHint.fromSudokuServiceHint(sudokuServiceResponse.getHint());
                sbsResponse.setHint(ssbHint);
                _this.clientCallback(sbsResponse);
            }
        };
        this.validate = function (puzzleString, callback) {
            _this.clientCallback = callback;
            _this.service.validate(puzzleString, _this.onValidate);
        };
        this.onValidate = function (validationResponse) {
            var v = validationResponse;
            var b = v.isValid;
            var sbs = new SBSResponse(b);
            sbs.setErrors(v.errors);
            sbs.setIsComplete(validationResponse.isComplete);
            _this.clientCallback(sbs);
        };
        this.getNewPuzzle = function (callback) {
            _this.clientCallback = callback;
            _this.service.getNewPuzzle(_this.onNewPuzzle);
        };
        this.onNewPuzzle = function (serviceResponse) {
            _this.clientCallback(_this.getSBSNewPuzzleResponse(serviceResponse));
        };
        this.getSBSNewPuzzleResponse = function (serviceResponse) {
            if (serviceResponse.isValid) {
                var sbsr = new SBSResponse(true);
                sbsr.setPuzzle(serviceResponse.puzzle.puzzle);
                return (sbsr);
            }
            else {
                var sbsr = new SBSResponse(false);
                sbsr.setErrors(serviceResponse.errors);
                return (sbsr);
            }
        };
        this.service = new SudokuService();
        this.clientCallback = null;
    }
    return SudokuBridgeService;
}());
var SBSResponse = /** @class */ (function () {
    function SBSResponse(isValid) {
        var _this = this;
        this.setPuzzle = function (p) {
            _this.puzzle = p;
        };
        this.setErrors = function (e) {
            _this.errors = __spreadArrays(e);
        };
        this.setHint = function (h) {
            _this.hint = h;
        };
        this.setIsComplete = function (b) {
            _this.isComplete = b;
        };
        this.isValid = isValid;
        this.puzzle = null;
        this.errors = [];
        this.hint = null;
        this.isComplete = false;
    }
    return SBSResponse;
}());
