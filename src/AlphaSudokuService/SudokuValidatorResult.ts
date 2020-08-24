class SudokuValidatorResult {
	isValid:Boolean
	isComplete:Boolean
	errors:Array<Number>
	constructor(isValid:Boolean, isComplete:Boolean, errors:Array<Number>){
		this.isValid = isValid
		this.isComplete = isComplete
		this.errors = errors
	}
}
