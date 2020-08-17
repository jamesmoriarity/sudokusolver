class SudokuBridgeService {
	constructor(){
		this.service = new SudokuService()
		this.callback = null
	}
	validate = (puzzleString, callback) => {
		this.callback = callback
		this.service.validate(puzzleString, this.onValidate)
	}

	onValidate = (validationResponse) =>{
		let isval = validationResponse.isValid
		let sbs = new SBSResponse(isval)
		this.callback(sbs)
	}

	getNewPuzzle = (callback) => {
		this.callback = callback
		this.service.getNewPuzzle(this.onNewPuzzle)
	}

	onNewPuzzle = (serviceResponse) => {
		let sbsr = null
		if (serviceResponse.isValid){
			sbsr = new SBSResponse(true)
			sbsr.setPuzzle(serviceResponse.puzzle.puzzle)
		}
		else{
			sbsr = new SBSResponse(false)
			sbsr.error = serviceResponse.error
		}
		this.callback(sbsr)
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
}

class SudokuService{
	constructor(){
		this.puzzleArray = []
	}

	validate(puzzleString, callback){
		this.puzzleArray = puzzleString.split("")
		callback(new SudokuServiceResponse(true))
	}

	getNewPuzzle(callback){
		let puzzleResult = null

		fetch("./json/puzzle.json")
	     	.then(res => res.json())
	     	.then(
	     		(res) => {
	     		let x = 0
	          	puzzleResult = res
	          	console.log("result: " + res)
	          	let ssr = new SudokuServiceResponse(true)
				ssr.setPuzzle(puzzleResult)
				callback(ssr)
	        	},
	        	(error) => {
				let ssr = new SudokuServiceResponse(false)
				ssr.error = error
				callback(ssr)
	       	}
	     )

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
}


class SBSCell {
	constructor(index, value){
		this.index = index
		this.value = value
	}
}

