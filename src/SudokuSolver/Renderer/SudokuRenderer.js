var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var SudokuRenderer = /** @class */ (function () {
    function SudokuRenderer() {
        var _this = this;
        this.render = function (renderClient) {
            _this.renderClient = renderClient;
            _this.state = renderClient.state;
            return <div id="_sudoku">
						<div>{_this.state.greeting} Valid: {(_this.state.isValid) ? "true" : "false"} Complete: {(_this.state.isComplete) ? "true" : "false"}</div>
						<div id="grid">
							{_this.getTableGrid()}
						</div>
						<div id="new_game_shell">
							<button id="new_game_btn" onClick={_this.renderClient.newPuzzle}>New Puzzle</button>
						</div>
						<div id="reset"><button id="reset_btn" onClick={_this.renderClient.reset}>Reset</button></div>
						<div id="validate"><button id="validate_btn" onClick={_this.renderClient.validate}>Validate</button></div>
						<div id="get_hint"><button id="get_hint_btn" onClick={_this.renderClient.getHint}>Get Hint</button></div>
					</div>;
        };
        this.getTableGrid = function () {
            var puzzleGrid = _this.buildPuzzleGridFromArray(__spreadArrays(_this.state.puzzleArray));
            var rows = puzzleGrid.map(_this.renderTableRow);
            return <table cellpadding="0" cellspacing="0" border="0">{rows}</table>;
        };
        this.renderTableRow = function (row, rowIndex) {
            _this.renderRowIndex = rowIndex;
            var cells = row.map(_this.renderTableCell);
            return <tr>{cells}</tr>;
        };
        this.renderTableCell = function (value, cellIndex) {
            var fullIndex = (_this.renderRowIndex * 9) + cellIndex;
            var cell = <td><CellShell renderClient={_this.renderClient} index={fullIndex} isHintRelated={_this.isListItemHintRelated(fullIndex, value)} isHinted={_this.isListItemHinted(fullIndex, value)} value={value} onCellChange={_this.renderClient.onCellChange}/></td>;
            return cell;
        };
        this.isListItemHintRelated = function (index, value) {
            /*
                get the rows and columns in the same box as the hinted cell
                if they contain the hinted value, highlight the row/column from
                the cell with the hinted value through the box

                get box from cellindex
                    let row = Math.floor(index/9)
                    let column = index % 9
                    let boxIndex = (row * 3) + column

                get rowIndexes from boxIndex
                    let startRow = (Math.floor(boxIndex/3) * 3)
                    return [startRow, startRow + 1, startRow + 2]

                get columnIndexes from boxIndex
                    let startColumn = (boxIndex % 3) * 3
                    return [startColumn, startColumn + 1, startColumn + 2]

                getCellIndexesFromRowByRowIndex
                    let start = rowIndex * 9
                    let end = start + 9
                    let a = []
                    for(let i = start; i < end; i++){
                        a.push(String(i))
                    }
                    return a

                getCellIndexesFromColumnByColumnIndex
                    let a = []
                    for(let i = 0; i < 9; i++){
                        a.push( (9 * i) + columnIndex )
                    }
                    return a
                */
            var b = (_this.state.hint == null) ? false : (_this.state.hint.index != index && _this.state.hint.value == value && String(_this.state.hint.type).includes("Hidden Single"));
            return b;
        };
        this.isListItemHinted = function (index, value) {
            var b = (_this.state.hint == null) ? false : (_this.state.hint.index == index);
            return b;
        };
        this.buildPuzzleGridFromArray = function (arr) {
            var grid = [];
            for (var i = 0; i < 9; i++) {
                var row = [];
                for (var j = 0; j < 9; j++) {
                    var arrIndex = (i * 9) + j;
                    row.push(arr[arrIndex]);
                }
                grid.push(row);
            }
            return grid;
        };
        this.renderClient = null;
        this.state = null;
        this.renderRowIndex = 0;
    }
    return SudokuRenderer;
}());
