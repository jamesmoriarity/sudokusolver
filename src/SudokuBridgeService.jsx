class SudokuBridgeService {
	constructor(){
		this.puzzleArray = []
		this.cells = []
	}
	validate = (puzzleString) => {
		this.puzzleArray = puzzleString.split("")
		this.buildCells()
		let sbs = new SBSResponse(true)
		return sbs;
	}

	buildCells = () => {
		let a = this.puzzleArray
		let len = a.length
		for( let i = 0; i < len; i++){
			this.cells.push(new SBSCell(i, a[i]))
		}
	}
}

class SBSResponse{
	constructor(isValid){
		this.isValid = isValid
	}
}

class SBSCell {
	constructor(index, value){
		this.index = index
		this.value = value
	}
}

class SudokuServiceResponse{
	constructor(){}
}
