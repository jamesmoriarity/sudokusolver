/// <reference path="./SudokuServiceHint.ts" />

class SudokuServiceResponse {
  isValid: Boolean = false
  isComplete: Boolean = false
  puzzle: SudokuPuzzle = null
  errors: Array<Number>
  hint: SudokuServiceHint

	constructor(isValid:Boolean){
		this.isValid = isValid
		this.errors = []
	}
	setIsComplete = (isComplete:Boolean) => {
		this.isComplete = isComplete
	}
	setPuzzle = (puzzle:SudokuPuzzle) =>{
		let puzzleClone = Object.assign({}, puzzle);
		this.puzzle = puzzleClone
	}
	addError = (error:Number) => {
		this.errors.push(error)
	}
	setErrors = (errors:Array<Number>) =>{
		this.errors = errors
	}
	setHint = (hint:SudokuServiceHint) => {
		this.hint = hint
	}
  getHint = () => {
    return this.hint
  }
}


interface SudokuPuzzle{
  start:String
  solution:String
}
