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
		let sbsr = null
		if (serviceResponse.isValid){
			sbsr = new SBSResponse(true)
			sbsr.setPuzzle(serviceResponse.puzzle.puzzle)
		}
		else{
			sbsr = new SBSResponse(false)
			sbsr.setError(serviceResponse.error)
		}
		return(sbsr)
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
	}

	validate(puzzleString, callback){
		this.puzzleArray = puzzleString.split("")
		callback(new SudokuServiceResponse(true))
	}

	getNewPuzzle(callback){
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


class SBSCell {
	constructor(index, value){
		this.index = index
		this.value = value
	}
}

