import SudokuServiceHint from "./SudokuServiceHint"

class SudokuServiceResponse {

  isValid: Boolean = false
  isComplete: Boolean = false
  puzzle: SudokuPuzzle = null
  errors: Array<Number>
  hint: SudokuServiceHint
  className: String

	constructor(isValid:Boolean){
		this.isValid = isValid
		this.errors = []
    this.className = "c"
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


class SudokuPuzzle{

}

export default SudokuServiceResponse
