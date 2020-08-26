console.log("SudokuSolverUtilities");
var ClientSolver = /** @class */ (function () {
    function ClientSolver() {
        var _this = this;
        this.setState = function (o) { _this.state = o; };
    }
    return ClientSolver;
}());
var SudokuSolverUtilities = /** @class */ (function () {
    function SudokuSolverUtilities(clientSolver) {
        var _this = this;
        this.isValidEntry = function (s) {
            if (s == "") {
                return true;
            }
            var n = Number(s).valueOf();
            if (!isNaN(n) && n > 0 && n < 10) {
                return true;
            }
            return false;
        };
        this.checkToRemoveRelatedHint = function (cellIndex) {
            if (_this.clientSolver.state.hint != null && cellIndex == _this.clientSolver.state.hint.index) {
                _this.clientSolver.setState({ hint: null, patternMap: null });
            }
        };
        this.checkToRemoveRelatedValidationError = function (cellIndex) {
            if (_this.clientSolver.state.validationErrors.includes(cellIndex)) {
                var updatedValErrors = _this.clientSolver.state.validationErrors.filter(function (element) { return element != cellIndex; });
                _this.clientSolver.setState({ validationErrors: updatedValErrors });
            }
        };
        this.buildEmptyPuzzleArray = function () {
            var a = [];
            for (var i = 0; i < 81; i++) {
                a.push("");
            }
            return a;
        };
        this.puzzleArrayToString = function (arr) {
            var len = arr.length;
            var str = "";
            for (var i = 0; i < len; i++) {
                var val = String(arr[i]);
                if (val == "") {
                    val = "0";
                }
                str += String(val);
            }
            return str;
        };
        this.puzzleStringToArray = function (s) {
            var a = String(s).split("");
            var len = a.length;
            for (var i = 0; i < len; i++) {
                var val = a[i];
                if (val == "0") {
                    a[i] = "";
                }
            }
            return a;
        };
        this.clientSolver = clientSolver;
    }
    SudokuSolverUtilities.prototype.getPatternMap = function () {
        var hintBackgroundCells = [0, 1, 3, 4, 5, 6, 7, 8, 6, 15, 16, 24, 33, 42, 51, 60, 78, 8, 17, 26, 35, 53, 62, 71, 80];
        var hintValueRelatedCells = [2, 69, 44];
        return { "hintBackgroundCells": hintBackgroundCells, "hintValueRelatedCells": hintValueRelatedCells };
    };
    return SudokuSolverUtilities;
}());
