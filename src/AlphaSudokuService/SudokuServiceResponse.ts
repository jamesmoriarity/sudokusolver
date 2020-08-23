class SudokuServiceResponse{

  isValid: Boolean = false
  isComplete: Boolean = false
  puzzle: SudokuPuzzle = null
  errors: Array<Number>
  hint: SudokuHint
  className: String

	constructor(isValid){
		this.isValid = isValid
		this.errors = []
    this.className = "c"
	}
	setIsComplete = (isComplete) => {
		this.isComplete = isComplete
	}
	setPuzzle = (puzzle) =>{
		let puzzleClone = Object.assign({}, puzzle);
		this.puzzle = puzzleClone
	}
	addError = (error) => {
		this.errors.push(error)
	}
	setErrors = (errors) =>{
		this.errors = errors
	}
	setHint = (hint) => {
		this.hint = hint
	}
}

class SudokuHint{

}

class SudokuPuzzle{

}
