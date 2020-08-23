"use strict";
exports.__esModule = true;
var SudokuServiceBridgeHint = /** @class */ (function () {
    function SudokuServiceBridgeHint() {
    }
    SudokuServiceBridgeHint.fromSudokuServiceHint = function (ssh) {
        var ssb = new SudokuServiceBridgeHint();
        ssb.value = ssh.value;
        ssb.index = ssh.index;
        return ssb;
    };
    return SudokuServiceBridgeHint;
}());
exports["default"] = SudokuServiceBridgeHint;
