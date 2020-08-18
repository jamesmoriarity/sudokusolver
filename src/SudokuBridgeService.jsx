// -- service bridge ------------//  connects to sudoku services

class SudokuBridgeService {
	constructor(){
		this.service = new SudokuService()
		this.clientCallback = null
	}

	getHint = (puzzleString, callback) => {
		this.clientCallback = callback
		this.service.getHint(puzzleString, this.onHintReceived)
	}

	onHintReceived = (sudokuServiceResponse) => {
		if(!sudokuServiceResponse.isValid){this.clientCallback(new SBSResponse(false))}
		else{
			let sbs = new SBSResponse(true)
			sbs.setHint(sudokuServiceResponse.hint)
			this.clientCallback(sbs)
		}
	}

	validate = (puzzleString, callback) => {
		this.clientCallback = callback
		this.service.validate(puzzleString, this.onValidate)
	}

	onValidate = (validationResponse) =>{
		let sbs = new SBSResponse(validationResponse.isValid)
		sbs.setErrors(validationResponse.errors)
		this.clientCallback(sbs)
	}

	getNewPuzzle = (callback) => {
		this.clientCallback = callback
		this.service.getNewPuzzle(this.onNewPuzzle)
	}

	onNewPuzzle = (serviceResponse) => {
		this.clientCallback(this.getSBSNewPuzzleResponse(serviceResponse))
	}

	getSBSNewPuzzleResponse = (serviceResponse) =>{
		if (serviceResponse.isValid){
			let sbsr = new SBSResponse(true)
			sbsr.setPuzzle(serviceResponse.puzzle.puzzle)
			return(sbsr)
		}
		else{
			let sbsr = new SBSResponse(false)
			sbsr.setErrors(serviceResponse.errors)
			return(sbsr)
		}
	}
}

class SBSResponse{
	constructor(isValid){
		this.isValid = isValid
		this.puzzle = null
		this.errors = []
		this.hint = null
	}
	setPuzzle = (p) => {
		this.puzzle = p
	}
	setErrors = (e) => {
		this.errors = [...e]
	}
	setHint = (h) => {
		this.hint = h
	}
}

// ---------- Sudoku Service ------ used instead of web service --//

class SudokuService{
	constructor(){
		this.puzzleArray = []
		this.callback = null
	}
	// ----- hint
	getHint = (puzzleString, callback) => {
		this.callback = callback
		let shf = new SudokuHintFinder()
		shf.findHint(puzzleString, this.onHintReceived)
	}
	onHintReceived = (hint) => {
		if(hint != null){
			let ssr = new SudokuServiceResponse(true)
			ssr.setHint(hint)
			this.callback(ssr)
		}
	}
	// ----- validate
	validate = (puzzleString, callback) => {
		this.callback = callback
		let validator = new SudokuValidator()
		validator.validate(puzzleString, this.onValidate)
	}
	onValidate = (result) => {
		if(result.isValid){
			this.callback(new SudokuServiceResponse(true))
		}else{
			this.callback(this.getFailedValidationServiceResponse(result.errors))
		}
	}
	getFailedValidationServiceResponse = (errors) => {
		let ssr = new SudokuServiceResponse(false)
		ssr.setErrors(errors)
		return ssr	
	}
	// ---- new puzzle
	getNewPuzzle = (callback) => {
		fetch("./json/puzzle.json")
     	.then(res => res.json())
     	.then(
     		(res) => {
				callback(this.getSuccessfulNewPuzzleServiceResponse(res))
        		},
	        	(error) => {
				callback(this.getFailedNewPuzzleServiceResponse(error))
	       	}
     	)
	}
	getSuccessfulNewPuzzleServiceResponse = (puzzleResult) => {
		let ssr = new SudokuServiceResponse(true)
		ssr.setPuzzle(puzzleResult)
		return ssr
	}
	getFailedNewPuzzleServiceResponse = (error) => {
		let ssr = new SudokuServiceResponse(false)
		ssr.addError(error)
		return ssr
	}
}

class SudokuServiceResponse{
	constructor(isValid){
		this.isValid = isValid
		this.puzzle = null
		this.errors = []
		this.hint = null

	}
	setPuzzle(puzzle){
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

// ------ Sudoku Hint

class SudokuHintFinder{
	constructor(){
		this.puzzleValues = []
		this.cells = []
	}
	findHint = (puzzleString, callback) => {
		this.callback = callback
		this.puzzleValues = puzzleString.split("")
		this.initCells()
		this.callback(new SudokuHint(0,"9"))
	}
	initCells = () => {
		let len = this.puzzleValues.length
		for(let i = 0; i < len; i++){
			this.cells.push(new SudokuSolutionCell(i, this.puzzleValues[i]))
		}
	}
}

class SudokuHint{
	constructor(index, value){
		this.index = index
		this.value = value
	}
}

class SudokuSolutionCell {
	constructor(index, value){
		this.index = index
		this.value = value
		this.row = null
		this.cell = null
		this.box = null
	}
}


// --------------------------------


class SudokuValidator{
	constructor(){
		this.puzzleValues = []
		this.callback = null
	}
	validate = (puzzleString, callback) =>{
		this.callback = callback
		this.puzzleValues = puzzleString.split("")
		this.getPuzzleSolution()
	}

	getPuzzleSolution = () => {
		fetch("./json/puzzle.json")
     	.then(res => res.json())
     	.then(
     		(res) => {
				this.onSolutionReceived(res.puzzle.solution)
        		},
	        	(error) => {
				console.log('getPuzzleSolution.error')
	       	}
     	)		
	}

	validateValues = (solutionString) => {
		let errors = []
		let solutionValues = solutionString.split("")
		for(let i = 0; i < solutionValues.length; i++){
			let puzzleVal = this.puzzleValues[i]
			let solutionVal = solutionValues[i]
			if(puzzleVal != "0" && puzzleVal != solutionVal){
				errors.push(i)
			}
		}
		this.onValidate (new SudokuValidatorResult(errors))
	}


	onSolutionReceived = (solutionString) => {
		let validatorResult = this.validateValues(solutionString)
	}

	onValidate = (validatorResult) => {
		this.callback(validatorResult)
	}
}

class SudokuValidatorResult {
	constructor(errors){
		if(errors.length > 0){
			this.isValid = false
			this.errors = errors
		}
		else{
			this.isValid = true
			this.errors = []
		}
	}
}






