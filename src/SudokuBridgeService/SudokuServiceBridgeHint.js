/// <reference path="../AlphaSudokuService/SudokuServiceHint.ts" />
var SudokuServiceBridgeHint = /** @class */function () {
    function SudokuServiceBridgeHint() {}
    SudokuServiceBridgeHint.fromSudokuServiceHint = function (h) {
        var ssbHint = new SudokuServiceBridgeHint();
        ssbHint.value = h.value;
        ssbHint.index = h.index;
        ssbHint.type = h.type;
        return ssbHint;
    };
    return SudokuServiceBridgeHint;
}();