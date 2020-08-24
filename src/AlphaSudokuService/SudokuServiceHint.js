var SudokuServiceHint = /** @class */ (function () {
    function SudokuServiceHint(index, value, type) {
        var _this = this;
        this.setValue = function (val) {
            _this.value = val;
        };
        this.getValue = function () {
            return (_this.value);
        };
        this.index = index;
        this.value = value;
        this.type = type;
    }
    return SudokuServiceHint;
}());
