class SudokuValidatorResult {
	isValid:Boolean
	isComplete:Boolean
	errors:Number[]
	constructor(isValid:Boolean, isComplete:Boolean, errors:Number[]){
		this.isValid = isValid
		this.isComplete = isComplete
		this.errors = errors
	}
}
