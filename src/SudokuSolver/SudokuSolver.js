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
            sss.puzzleArray = _this.solverUtilities.buildEmptyPuzzleArray();
            sss.originalPuzzleArray = _this.solverUtilities.buildEmptyPuzzleArray();
            _this.state = sss;
            // don't use setState at this point, because no state obj exists yet
            // use setState after setInitialState has fired
        };
        //-- utility functions
        _this.getBridgeService = function () {
            return new SudokuBridgeService();
        };
        _this.getPuzzleArray = function () {
            var a = _this.state.puzzleArray;
            return a;
        };
        _this.toString = function () {
            return _this.solverUtilities.puzzleArrayToString(_this.getPuzzleArray());
        };
        //-- Cell Change
        _this.onCellChange = function (event, cellIndex) {
            /* if mode == pencil this.cells[cellIndex].setPencil(value)*/
            /* if mode == possibleValues this.cells[cellIndex].setPossibleValue(value)*/
            // if mode == value
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
        _this.onNewPuzzle = function (sbsResponse) {
            if (sbsResponse.isValid) {
                _this.setNewPuzzle(sbsResponse);
            }
            else {
                _this.handlePuzzleLoadFailure(sbsResponse);
            }
        };
        _this.handlePuzzleLoadFailure = function (sbsResponse) {
            alert("puzzle load failed: " + sbsResponse.errors.join(":"));
        };
        _this.setNewPuzzle = function (sbsResponse) {
            var startNumbers = String(sbsResponse.puzzle.start);
            var a = _this.solverUtilities.puzzleStringToArray(startNumbers);
            var newState = new SSState();
            newState.puzzleArray = a;
            newState.originalPuzzleArray = __spreadArrays(a);
            newState.isValid = true;
            _this.setState(newState);
        };
        //-- reset
        _this.reset = function () {
            _this.resetPuzzle();
        };
        _this.resetPuzzle = function () {
            var state = new SSState();
            state.puzzleArray = __spreadArrays(_this.state.originalPuzzleArray);
            state.isValid = true;
            _this.setState(state);
        };
        //-- validation
        _this.validate = function () {
            _this.getBridgeService().validate(_this.toString(), _this.onValidate);
        };
        _this.onValidate = function (sbsResponse) {
            _this.setState({ isValid: sbsResponse.isValid, isComplete: sbsResponse.isComplete, validationErrors: __spreadArrays(sbsResponse.errors) });
        };
        //-- hint
        _this.getHint = function () {
            _this.getBridgeService().getHint(_this.toString(), _this.onHintReceived);
        };
        _this.onHintReceived = function (sbsResponse) {
            _this.setState({ hint: sbsResponse.hint, patternMap: _this.solverUtilities.getPatternMap() });
            _this.updateCell(sbsResponse.hint.index, sbsResponse.hint.value);
            console.log("sbsResponse: hint " + sbsResponse.hint.type);
        };
        _this.solverUtilities = new SudokuSolverUtilities(_this);
        _this.setInitialState();
        return _this;
    }
    //-- render
    SudokuSolver.prototype.render = function () {
        var renderer = new SudokuRenderer();
        return renderer.render(this);
    };
    return SudokuSolver;
}(React.Component));
