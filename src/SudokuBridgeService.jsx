// -- service bridge ------------//

class SudokuBridgeService {
	constructor(){
		this.service = new SudokuService()
		this.clientCallback = null
	}
	validate = (puzzleString, callback) => {
		this.clientCallback = callback
		this.service.validate(puzzleString, this.onValidate)
	}

	onValidate = (validationResponse) =>{
		let isval = validationResponse.isValid
		let sbs = new SBSResponse(isval)
		sbs.error = validationResponse.error
		this.clientCallback(sbs)
	}

	getNewPuzzle = (callback) => {
		this.clientCallback = callback
		this.service.getNewPuzzle(this.onNewPuzzle)
	}

	onNewPuzzle = (serviceResponse) => {
		this.clientCallback(this.getSBSResponse(serviceResponse))
	}

	getSBSResponse = (serviceResponse) =>{
		if (serviceResponse.isValid){
			let sbsr = new SBSResponse(true)
			sbsr.setPuzzle(serviceResponse.puzzle.puzzle)
			return(sbsr)
		}
		else{
			let sbsr = new SBSResponse(false)
			sbsr.setError(serviceResponse.error)
			return(sbsr)
		}
		
	}
}

class SBSResponse{
	constructor(isValid){
		this.isValid = isValid
		this.puzzle = null
		this.error = null
	}
	setPuzzle = (p) => {
		this.puzzle = p
	}
	setError = (e) => {
		this.error = e
	}
}

// ---------- Sudoku Service ------------- //

class SudokuService{
	constructor(){
		this.puzzleArray = []
		this.callback = null
	}

	validate = (puzzleString, callback) => {
		this.callback = callback
		let validator = new SudokuValidator()
		validator.validate(puzzleString, this.onValidate)
	}

	onValidate = (result) => {
		if(result.isValid){
			this.callback(new SudokuServiceResponse(true))
		}else{
			this.callback(this.getFailedServiceResponse(result.errors))
		}
	}

	getNewPuzzle = (callback) => {
		fetch("./json/puzzle.json")
     	.then(res => res.json())
     	.then(
     		(res) => {
				callback(this.getSuccessfulServiceResponse(res))
        		},
	        	(error) => {
				callback(this.getFailedServiceResponse(error))
	       	}
     	)
	}

	getSuccessfulServiceResponse = (puzzleResult) => {
		let ssr = new SudokuServiceResponse(true)
		ssr.setPuzzle(puzzleResult)
		return ssr
	}

	getFailedServiceResponse = (error) => {
		let ssr = new SudokuServiceResponse(false)
		ssr.setError(error)
		return ssr
	}
}

class SudokuServiceResponse{
	constructor(isValid){
		this.isValid = isValid
		this.puzzle = null
		this.error = null

	}
	setPuzzle(puzzle){
		let puzzleClone = Object.assign({}, puzzle);
		this.puzzle = puzzleClone
	}
	setError = (error) =>{
		this.error = error
	}
}


// --------------------------------


class SudokuValidator{
	constructor(){
		this.puzzleArray = []
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




class SBSCell {
	constructor(index, value){
		this.index = index
		this.value = value
	}
}

