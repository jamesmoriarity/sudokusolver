/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference path="./SudokuSolverUtilities.ts" />
/// <reference path="./Renderer/SudokuRenderer.js" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var SSState = /** @class */ (function () {
    function SSState() {
        this.greeting = "Sudoku Puzzle : Status : ";
        this.patternMap = {};
        this.validationErrors = [];
        this.isComplete = false;
        this.isValid = false;
        this.hint = null;
    }
    return SSState;
}());
var SudokuSolver = /** @class */ (function (_super) {
    __extends(SudokuSolver, _super);
    function SudokuSolver(props) {
        var _this = _super.call(this, props) || this;
        _this.setInitialState = function () {
            var sss = new SSState();
            var a = _this.solverUtilities.buildEmptyPuzzleArray();
            sss.puzzleArray = a;
            sss.originalPuzzleString = _this.solverUtilities.puzzleArrayToString(a);
            _this.state = sss;
            // don't use setState at this point, because the state obj doesn't yet exist
            // use setState after setInitialState has fired
        };
        //-- Cell Change
        _this.onCellChange = function (event, cellIndex) {
            var valString = String(event.target.value);
            if (_this.solverUtilities.isValidEntry(valString)) {
                _this.solverUtilities.checkToRemoveRelatedValidationError(cellIndex);
                _this.solverUtilities.checkToRemoveRelatedHint(cellIndex);
                _this.updateCell(cellIndex, valString);
            }
        };
        _this.updateCell = function (cellIndex, value) {
            var newArray = _this.getPuzzleArray();
            newArray[cellIndex] = value;
            _this.setState({ puzzleArray: newArray, isValid: false, isComplete: false });
        };
        //-- new puzzle
        _this.newPuzzle = function () {
            _this.getBridgeService().getNewPuzzle(_this.onNewPuzzle);
        };
        _this.onNewPuzzle = function (sbsPuzzle) {
            if (sbsPuzzle) {
                _this.initNewPuzzle(sbsPuzzle);
            }
            else {
                alert("puzzle load failed. puzzle object is null");
            }
        };
        _this.initNewPuzzle = function (sbsPuzzle) {
            var newState = new SSState();
            newState.originalPuzzleString = sbsPuzzle.puzzleString;
            newState.puzzleArray = _this.solverUtilities.puzzleStringToArray(sbsPuzzle.puzzleString);
            newState.isValid = true;
            _this.setState(newState);
        };
        //-- reset
        _this.reset = function () {
            _this.resetPuzzle();
        };
        _this.resetPuzzle = function () {
            var state = new SSState();
            state.puzzleArray = _this.solverUtilities.puzzleStringToArray(_this.state.originalPuzzleString);
            state.isValid = true;
            state.isComplete = false;
            _this.setState(state);
        };
        //-- validation
        _this.validate = function () {
            _this.getBridgeService().validate(_this.toPuzzleString(), _this.onValidate);
        };
        _this.onValidate = function (val) {
            if (val)
                _this.setState({ isValid: val.isValid, isComplete: val.isComplete, validationErrors: __spreadArrays(val.invalidCells) });
        };
        //-- hint
        _this.getHint = function () {
            _this.getBridgeService().getHint(_this.toPuzzleString(), _this.onHintReceived);
        };
        _this.onHintReceived = function (ssbHint) {
            if (ssbHint) {
                _this.setState({ hint: ssbHint, patternMap: _this.solverUtilities.getPatternMap(ssbHint) });
                _this.updateCell(ssbHint.index, ssbHint.value);
                console.log("SudokuServiceBridgeHint: hint " + ssbHint.type);
            }
            else {
                console.log("onHintReceived: The hint object was null.");
            }
        };
        //-- render
        _this.render = function () {
            var renderer = new SudokuRenderer();
            return renderer.render(_this);
        };
        //-- general functions
        _this.getBridgeService = function () {
            return new SudokuBridgeService();
        };
        _this.getPuzzleArray = function () {
            var a = _this.state.puzzleArray;
            return a;
        };
        _this.toPuzzleString = function () {
            return _this.solverUtilities.puzzleArrayToString(_this.getPuzzleArray());
        };
        _this.solverUtilities = new SudokuSolverUtilities(_this);
        _this.setInitialState();
        return _this;
    }
    return SudokuSolver;
}(React.Component));
