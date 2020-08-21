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
		sbs.setIsComplete(validationResponse.isComplete)
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
		this.isComplete = false
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
	setIsComplete = (b) => {
		this.isComplete = b
	}
}

