/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference path="./SudokuSolverUtilities.ts" />
/// <reference path="./Renderer/SudokuRenderer.jsx" />
var __extends = this && this.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (b.hasOwnProperty(p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __spreadArrays = this && this.__spreadArrays || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
        s += arguments[i].length;
    }for (var r = Array(s), k = 0, i = 0; i < il; i++) {
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
            r[k] = a[j];
        }
    }return r;
};
var SSState = /** @class */function () {
    function SSState() {}
    return SSState;
}();
var SudokuSolver = /** @class */function (_super) {
    __extends(SudokuSolver, _super);
    function SudokuSolver(props) {
        var _this = _super.call(this, props) || this;
        _this.setInitialState = function () {
            _this.state = new SSState();
            _this.state.greeting = "Sudoku Puzzle : Status : ";
            _this.state.isValid = false;
            _this.state.hint = null;
            _this.state.puzzleArray = _this.solverUtilities.buildEmptyPuzzleArray();
            _this.state.validationErrors = [];
            _this.state.isComplete = false;
            _this.state.originalPuzzleArray = __spreadArrays(_this.getPuzzleArray());
            _this.state.patternMap = {};
            _this.setState(_this.state);
        };
        //-- utility functions
        _this.getService = function () {
            return new SudokuBridgeService();
        };
        //-- Cell Change
        _this.onCellChange = function (event, cellIndex) {
            var value = event.target.value;
            /* if mode == pencil
                this.cells[cellIndex].setPencil(value)*/
            /* if mode == possibleValues
                this.cells[cellIndex].setPossibleValue(value)*/
            // if mode == value
            var isValidEntry = value == "" || !isNaN(value) && Number(value) > 0;
            if (isValidEntry) {
                _this.solverUtilities.checkToRemoveValidationError(cellIndex);
                _this.solverUtilities.checkToRemoveHint(cellIndex);
                _this.updateCell(cellIndex, value);
            }
        };
        _this.updateCell = function (cellIndex, value) {
            var newArray = _this.getPuzzleArray();
            newArray[cellIndex] = value;
            _this.setState({ puzzleArray: newArray, isValid: false, isComplete: false });
        };
        //-- new puzzle
        _this.newPuzzle = function () {
            _this.getService().getNewPuzzle(_this.onNewPuzzle);
        };
        _this.onNewPuzzle = function (sbsResponse) {
            if (sbsResponse.isValid) {
                _this.setNewPuzzle(sbsResponse);
            } else {
                alert("puzzle load failed: " + sbsResponse.errors.join(":"));
            }
        };
        _this.setNewPuzzle = function (sbsResponse) {
            var s = String(sbsResponse.puzzle.start);
            var a = _this.solverUtilities.puzzleStringToArray(s);
            _this.setState({
                puzzleArray: a,
                originalPuzzleArray: __spreadArrays(a),
                isValid: true,
                isComplete: false,
                validationErrors: [],
                hint: null,
                patternMap: null
            });
        };
        //-- reset
        _this.reset = function () {
            _this.resetPuzzle();
        };
        _this.resetPuzzle = function () {
            _this.setState({
                puzzleArray: __spreadArrays(_this.state.originalPuzzleArray),
                isValid: true,
                isComplete: false,
                validationErrors: [],
                hint: null,
                patternMap: null
            });
        };
        _this.getPuzzleArray = function () {
            var a = _this.state.puzzleArray;
            return a;
        };
        //-- validation
        _this.onValidate = function (sbsResponse) {
            _this.setState({ puzzlieArray: __spreadArrays(_this.getPuzzleArray()), isValid: sbsResponse.isValid, isComplete: sbsResponse.isComplete, validationErrors: __spreadArrays(sbsResponse.errors) });
            // this.setState(sbsResponse)
        };
        _this.validate = function () {
            var puzzleString = _this.solverUtilities.toString(_this.getPuzzleArray());
            _this.getService().validate(puzzleString, _this.onValidate);
        };
        //-- hint
        _this.getHint = function () {
            _this.getService().getHint(_this.solverUtilities.toString(_this.getPuzzleArray()), _this.onHintReceived);
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
}(React.Component);
ReactDOM.render(React.createElement(SudokuSolver, null), document.getElementById('sudoku_solver_shell'));