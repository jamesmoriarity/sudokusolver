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
		this.boxes = []
		this.rows = []
		this.columns = []
	}
	findHint = (puzzleString, callback) => {
		this.callback = callback
		this.puzzleValues = puzzleString.split("")
		this.initCells()
		this.initBoxesRowsColumns()
		this.cellsSetOpenNumbers()

		let hiddenSingleHint = this.findHiddenSingleInBoxes()
		if(hiddenSingleHint != null){
			this.callback(hiddenSingleHint)	
		}
		this.callback(null)
		
	}
	initCells = () => {
		let len = this.puzzleValues.length
		for(let i = 0; i < len; i++){
			this.cells.push(new SudokuSolutionCell(i, this.puzzleValues[i]))
		}
	}
	initBoxesRowsColumns = () => {
		for(let i = 0; i < 9; i++){
			this.boxes.push(new SudokuBox(i, this.cells))
			this.rows.push(new SudokuRow(i, this.cells))
			this.columns.push(new SudokuColumn(i, this.cells))
		}
	}
	cellsSetOpenNumbers = () => {
		let len = this.cells.length
		for(let i = 0; i < len; i++){
			let cell = this.cells[i]
			cell.setOpenNumbers()
		}
	}
	findHiddenSingleInBoxes = () => {
		let len = this.boxes.length
		for(let i = 0; i < len; i++){
			let box = this.boxes[i]
			let hiddenSingleHint = this.getHiddenSingle(box.boxCells)
			if(hiddenSingleHint != null){
				return hiddenSingleHint
			}
		}
		return null
	}
	getHiddenSingle = (cells) =>{
		let len = cells.length
		let vals = {"1":[], "2":[], "3":[], "4":[], "5":[],"6":[],"7":[], "8":[],"9":[]}
		
		// make a map of values with an array of cells that have that value as an open value
		for(let bIndex = 0; bIndex < len; bIndex++){
			let cell = cells[bIndex] 
			let openNumbers = [...cell.openNumbers]
			if(openNumbers.length > 0){
				let leng = openNumbers.length
				for(let openNumberIndex = 0; openNumberIndex < leng; openNumberIndex++){
					let key = openNumbers[openNumberIndex]
					vals[key].push(bIndex)
				}
			}
		}
		// loop through each key in vals, check to see if only one cell's index
		// is in the array, length == 1, if so return it as a hidden single
		for (let key in vals) {
		  let cellIndexes = vals[key]
		  if(cellIndexes.length == 1){
		  	let index = cellIndexes[0]
		  	let cell = cells[index]
		  	return new SudokuHint(cell.index, key)
		  }
		}


		return null	
	}
}

class SudokuColumn{
	constructor(index, cells){
		this.index = index
		this.allCells = cells
		this.columnCells = []
		this.setColumnCells()
		this.allCells = null
	}

	setColumnCells = () =>{
		let offset = this.index % 9
		for(let i = 0; i < 9; i++){
			let cell = this.allCells[(i*9) + offset]
			cell.setColumn(this)
			this.columnCells.push(cell)
		}
	}

	getClosedNumbers = () =>{
		let nums = []
		for(let i = 0; i < this.columnCells.length; i++){
			let cell = this.columnCells[i]
			let val = cell.value
			if (val != "0"){
				nums.push(val)
			}
		}
		return nums
	}
}

class SudokuRow{
	constructor(index, cells){
		this.index = index
		this.allCells = cells
		this.rowCells = []
		this.setRowCells()
		this.allCells = null
	}

	setRowCells = () =>{
		let start = this.index * 9
		for(let i = 0; i < 9; i++){
			let cell = this.allCells[start+i]
			cell.setRow(this)
			this.rowCells.push(cell)
		}
	}

	getClosedNumbers = () =>{
		let nums = []
		for(let i = 0; i < this.rowCells.length; i++){
			let cell = this.rowCells[i]
			let val = cell.value
			if (val != "0"){
				nums.push(val)
			}
		}
		return nums
	}
}

class SudokuBox{
	constructor(index, cells){
		this.cellsInABoxRow = 3
		this.index = index
		this.allCells = cells
		this.boxCells = []
		this.setBoxCells()
		this.allCells = null
	}

	setBoxCells = () =>{
		let len = this.allCells.length
		let rowStartIndex = Math.floor(this.index/this.cellsInABoxRow) * this.cellsInABoxRow
		let columnStartIndex = (this.index % this.cellsInABoxRow) * this.cellsInABoxRow;
		for(let i = 0; i < 3; i++){
			for(let j = 0; j < 3; j++){
				let fullIndex = (rowStartIndex * 9)  + (i * 9) + columnStartIndex + j
				let cell = this.allCells[fullIndex]
				cell.setBox(this)
				this.boxCells.push(cell)
			}
		}
	}

	getClosedNumbers = () =>{
		let nums = []
		let len = this.boxCells.length
		for(let i = 0; i < len; i++){
			let cell = this.boxCells[i]
			let val = cell.value
			if (val != "0"){
				nums.push(val)
			}
		}
		return nums
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
		this.allClosedNumbers = []
		this.openNumbers = []
	}

	setRow = (row) => {
		this.row = row
	}

	setColumn = (column) => {
		this.column = column
	}

	setBox = (box) => {
		this.box = box
	}

	loadClosedNumbers = () => {
		if(this.value == "0"){
			let boxNumbers = this.box.getClosedNumbers()
			let rowNumbers = this.row.getClosedNumbers()
			let columnNumbers = this.column.getClosedNumbers()
			this.allClosedNumbers = [ ...new Set( boxNumbers.concat(rowNumbers).concat(columnNumbers) ) ]		}

	}

	setOpenNumbers = () => {
		if(this.value == "0"){
			this.loadClosedNumbers()
			for(let i = 1; i < 10; i++){
				let val = String(i)
				if(!this.allClosedNumbers.includes(val)){
					this.openNumbers.push(val)
				}
			}			
		}

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






