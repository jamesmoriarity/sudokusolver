class SudokuBridgeService {
	constructor(){
		this.service = new SudokuService()
		this.callback = null
	}
	validate = (puzzleString) => {
		let serviceResponse = this.service.validate(puzzleString)
		let isval = serviceResponse.isValid
		let sbs = new SBSResponse(isval)
		return sbs;
	}
	getNewPuzzle = (callback) => {
		this.callback = callback
		let p = this.service.getNewPuzzle(this.onNewPuzzle)
	}

	onNewPuzzle = (response) => {
		let sbsr = new SBSResponse(true)
		sbsr.setPuzzle(response.puzzle.puzzle)
		console.log("SudokuBridgeService.onNewPuzzle " + sbsr)
		this.callback(sbsr)
	}
}

class SBSResponse{
	constructor(isValid){
		this.isValid = isValid
		this.puzzle = null
	}
	setPuzzle = (p) => {
		this.puzzle = p
	}
}

class SudokuService{
	constructor(){
		this.puzzleArray = []
	}
	validate(puzzleString){
		this.puzzleArray = puzzleString.split("")
		return new SudokuServiceResponse(true)
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
	        // Note: it's important to handle errors here
	        // instead of a catch() block so that we don't swallow
	        // exceptions from actual bugs in components.
	        (error) => {
	          let x = 0
	          puzzleResult = error
	          console.log("error: " + error)
	        }
	     )
	}
}

class SudokuServiceResponse{
	constructor(isValid){
		this.isValid = isValid
		this.puzzle = "hello"

	}
	setPuzzle(puzzle){
		let p = Object.assign({}, puzzle);
		this.puzzle = p
	}
}


class SBSCell {
	constructor(index, value){
		this.index = index
		this.value = value
	}
}

