/// <reference path="./SudokuServiceHint.ts" />
/// <reference path="./SudokuServiceResponse.ts" />
/// <reference path="./SudokuValidatorResult.ts" />
var SudokuService = /** @class */ (function () {
    function SudokuService() {
        var _this = this;
        // ----- hint
        this.getHint = function (puzzleString, callback) {
            _this.callback = callback;
            var shf = new SudokuHintFinder();
            shf.findHint(puzzleString, _this.onHintReceived);
        };
        this.onHintReceived = function (hint) {
            if (hint != null) {
                var ssr = new SudokuServiceResponse(true);
                ssr.setHint(hint);
                _this.callback(ssr);
            }
        };
        // ----- validate
        this.validate = function (puzzleString, callback) {
            _this.callback = callback;
            var validator = new SudokuValidator();
            validator.validate(puzzleString, _this.onValidate);
        };
        this.onValidate = function (result) {
            _this.callback(result);
        };
        this.getFailedValidationServiceResponse = function (errors) {
            var ssr = new SudokuServiceResponse(false);
            ssr.setErrors(errors);
            return ssr;
        };
        // ---- new puzzle
        this.getNewPuzzle = function (callback) {
            fetch("./json/puzzle.json")
                .then(function (res) { return res.json(); })
                .then(function (res) {
                callback(_this.getSuccessfulNewPuzzleServiceResponse(res));
            }, function (error) {
                callback(_this.getFailedNewPuzzleServiceResponse(error));
            });
        };
        this.getSuccessfulNewPuzzleServiceResponse = function (puzzleResult) {
            var ssr = new SudokuServiceResponse(true);
            ssr.setPuzzle(puzzleResult.puzzle);
            return ssr;
        };
        this.getFailedNewPuzzleServiceResponse = function (error) {
            var ssr = new SudokuServiceResponse(false);
            ssr.addError(error);
            return ssr;
        };
        this.puzzleArray = [];
        this.callback = null;
    }
    return SudokuService;
}());
// ------ Sudoku Hint
var SudokuHintFinder = /** @class */ (function () {
    function SudokuHintFinder() {
        var _this = this;
        this.findHint = function (puzzleString, callback) {
            _this.callback = callback;
            _this.puzzleValues = puzzleString.split("");
            _this.initCells();
            _this.initBoxesRowsColumns();
            _this.cellsSetOpenNumbers();
            var algorithmList = [_this.findHiddenSingleInBoxes, _this.findHiddenSingleInRows, _this.findHiddenSingleInColumns, _this.findNakedSingle];
            for (var i = 0; i < algorithmList.length; i++) {
                var hint = algorithmList[i]();
                if (hint != null) {
                    _this.callback(hint);
                    return;
                }
            }
            _this.callback(null);
            return;
        };
        this.initCells = function () {
            var len = _this.puzzleValues.length;
            for (var i = 0; i < len; i++) {
                _this.cells.push(new SudokuSolutionCell(i, _this.puzzleValues[i]));
            }
        };
        this.initBoxesRowsColumns = function () {
            for (var i = 0; i < 9; i++) {
                _this.boxes.push(new SudokuBox(i, _this.cells));
                _this.rows.push(new SudokuRow(i, _this.cells));
                _this.columns.push(new SudokuColumn(i, _this.cells));
            }
        };
        this.cellsSetOpenNumbers = function () {
            var len = _this.cells.length;
            for (var i = 0; i < len; i++) {
                var cell = _this.cells[i];
                cell.setOpenNumbers();
            }
        };
        this.findHiddenSingleInBoxes = function () {
            return _this.findHiddenSingleInGroupings(_this.boxes, "Box");
        };
        this.findHiddenSingleInRows = function () {
            return _this.findHiddenSingleInGroupings(_this.rows, "Row");
        };
        this.findHiddenSingleInColumns = function () {
            return _this.findHiddenSingleInGroupings(_this.columns, "Column");
        };
        this.findNakedSingle = function () {
            var len = _this.cells.length;
            for (var i = 0; i < len; i++) {
                var cell = _this.cells[i];
                if (cell.value == "0" && cell.openNumbers.length == 1) {
                    return (new SudokuServiceHint(cell.index, String(cell.openNumbers[0]), "Naked Single"));
                }
            }
            return null;
        };
        this.findHiddenSingleInGroupings = function (groupings, type) {
            var len = groupings.length;
            for (var i = 0; i < len; i++) {
                var group = groupings[i];
                var hiddenSingleHint = _this.getHiddenSingle(group.cells, type);
                if (hiddenSingleHint != null) {
                    return hiddenSingleHint;
                }
            }
            return null;
        };
        this.getHiddenSingle = function (cells, type) {
            var len = cells.length;
            var vals = { "1": [], "2": [], "3": [], "4": [], "5": [], "6": [], "7": [], "8": [], "9": [] };
            // make a map of values with an array of cells that have that value as an open value
            for (var i = 0; i < len; i++) {
                var cell = cells[i];
                var openNumbers = cell.openNumbers;
                if (openNumbers.length > 0) {
                    var leng = openNumbers.length;
                    for (var j = 0; j < leng; j++) {
                        var key = String(openNumbers[j]);
                        vals[key].push(i);
                    }
                }
            }
            // loop through each key in vals, check to see if only one cell's index
            // is in the array, length == 1, if so return it as a hidden single
            for (var key in vals) {
                var cellIndexes = vals[key];
                if (cellIndexes.length == 1) {
                    var index = cellIndexes[0];
                    var cell = cells[index];
                    return new SudokuServiceHint(cell.index, key, "Hidden Single:" + type);
                }
            }
            return null;
        };
        this.puzzleValues = [];
        this.cells = [];
        this.boxes = [];
        this.rows = [];
        this.columns = [];
    }
    return SudokuHintFinder;
}());
var SudokuColumn = /** @class */ (function () {
    function SudokuColumn(index, cells) {
        var _this = this;
        this.setCells = function () {
            var offset = Number(_this.index) % 9;
            for (var i = 0; i < 9; i++) {
                var cell = _this.allCells[(i * 9) + offset];
                cell.setColumn(_this);
                _this.cells.push(cell);
            }
        };
        this.getClosedNumbers = function () {
            var nums = [];
            for (var i = 0; i < _this.cells.length; i++) {
                var val = _this.cells[i].value;
                if (val != "0") {
                    nums.push(val);
                }
            }
            return nums;
        };
        this.index = index;
        this.allCells = cells;
        this.cells = [];
        this.setCells();
        this.allCells = null;
    }
    return SudokuColumn;
}());
var SudokuRow = /** @class */ (function () {
    function SudokuRow(index, cells) {
        var _this = this;
        this.setCells = function () {
            var start = Number(_this.index) * 9;
            for (var i = 0; i < 9; i++) {
                var cell = _this.allCells[start + i];
                cell.setRow(_this);
                _this.cells.push(cell);
            }
        };
        this.getClosedNumbers = function () {
            var nums = [];
            for (var i = 0; i < _this.cells.length; i++) {
                var val = _this.cells[i].value;
                if (val != "0") {
                    nums.push(val);
                }
            }
            return nums;
        };
        this.index = index;
        this.allCells = cells;
        this.cells = [];
        this.setCells();
    }
    return SudokuRow;
}());
var SudokuBox = /** @class */ (function () {
    function SudokuBox(index, cells) {
        var _this = this;
        this.setCells = function () {
            var indexPerCells = Number(_this.index) / Number(_this.cellsInABoxRow);
            var rowStartIndex = Math.floor(indexPerCells) * Number(_this.cellsInABoxRow);
            var columnStartIndex = (Number(_this.index) % Number(_this.cellsInABoxRow)) * Number(_this.cellsInABoxRow);
            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    var fullIndex = (Number(rowStartIndex) * 9) + (i * 9) + columnStartIndex + j;
                    var cell = _this.allCells[fullIndex];
                    cell.setBox(_this);
                    _this.cells.push(cell);
                }
            }
        };
        this.getClosedNumbers = function () {
            var nums = [];
            var len = _this.cells.length;
            for (var i = 0; i < len; i++) {
                var val = _this.cells[i].value;
                if (val != "0") {
                    nums.push(val);
                }
            }
            return nums;
        };
        this.cellsInABoxRow = 3;
        this.index = index;
        this.allCells = cells;
        this.cells = [];
        this.setCells();
    }
    return SudokuBox;
}());
var SudokuSolutionCell = /** @class */ (function () {
    function SudokuSolutionCell(index, value) {
        var _this = this;
        this.setRow = function (row) {
            _this.row = row;
        };
        this.setColumn = function (column) {
            _this.column = column;
        };
        this.setBox = function (box) {
            _this.box = box;
        };
        this.loadClosedNumbers = function () {
            if (_this.value == "0") {
                var boxNumbers = _this.box.getClosedNumbers();
                var rowNumbers = _this.row.getClosedNumbers();
                var columnNumbers = _this.column.getClosedNumbers();
                _this.allClosedNumbers = new Set(boxNumbers.concat(rowNumbers).concat(columnNumbers));
            }
        };
        this.setOpenNumbers = function () {
            if (_this.value == "0") {
                _this.loadClosedNumbers();
                for (var i = 1; i < 10; i++) {
                    if (!_this.allClosedNumbers.has(String(i))) {
                        _this.openNumbers.push(i);
                    }
                }
            }
        };
        this.index = index;
        this.value = value;
        this.row = null;
        this.box = null;
        this.column = null;
        this.allClosedNumbers = null;
        this.openNumbers = [];
    }
    return SudokuSolutionCell;
}());
// --------------------------------
var SudokuValidator = /** @class */ (function () {
    function SudokuValidator() {
        var _this = this;
        this.validate = function (puzzleString, callback) {
            _this.puzzleString = puzzleString;
            _this.callback = callback;
            _this.puzzleValues = puzzleString.split("");
            _this.getPuzzleSolution();
        };
        this.getPuzzleSolution = function () {
            fetch("./json/puzzle.json")
                .then(function (res) { return res.json(); })
                .then(function (res) {
                _this.onSolutionReceived(res.puzzle.solution);
            }, function (error) {
                console.log('getPuzzleSolution.error' + error);
            });
        };
        this.validateValues = function (solutionString) {
            var errors = [];
            var isComplete = false;
            var isValid = true;
            var solutionValues = solutionString.split("");
            for (var i = 0; i < solutionValues.length; i++) {
                var puzzleVal = _this.puzzleValues[i];
                var solutionVal = solutionValues[i];
                if (puzzleVal != "0" && puzzleVal != solutionVal) {
                    errors.push(i);
                    isValid = false;
                }
            }
            if (isValid) {
                var sv = String(solutionString);
                var ps = String(_this.puzzleString);
                isComplete = (sv == ps);
            }
            _this.onValidate(new SudokuValidatorResult(isValid, isComplete, errors));
        };
        this.onSolutionReceived = function (solutionString) {
            _this.validateValues(solutionString);
        };
        this.onValidate = function (validatorResult) {
            _this.callback(validatorResult);
        };
        this.puzzleValues = [];
        this.callback = null;
    }
    return SudokuValidator;
}());
