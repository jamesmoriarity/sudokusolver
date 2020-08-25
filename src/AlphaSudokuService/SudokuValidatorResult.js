var SudokuValidatorResult = /** @class */ (function () {
    function SudokuValidatorResult(isValid, isComplete, errors) {
        this.isValid = isValid;
        this.isComplete = isComplete;
        this.errors = errors;
    }
    return SudokuValidatorResult;
}());
