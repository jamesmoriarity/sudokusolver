/// <reference path="./SudokuServiceHint.ts" />
/// <reference path="./SudokuServiceResponse.ts" />
/// <reference path="./SudokuValidatorResult.ts" />

class SudokuService{
	puzzleArray:Array<Number>
	callback:Function
  isValid: any
	constructor(){
		this.puzzleArray = []
		this.callback = null
	}

	// ----- hint
	getHint = (puzzleString:String, callback:Function) => {
		this.callback = callback
		let shf:SudokuHintFinder = new SudokuHintFinder()
		shf.findHint(puzzleString, this.onHintReceived)
	}
	onHintReceived = (hint:SudokuServiceHint) => {
		if(hint != null){
			let ssr = new SudokuServiceResponse(true)
			ssr.setHint(hint)
			this.callback(ssr)
		}
	}
	// ----- validate
	validate = (puzzleString:String, callback:Function) => {
		this.callback = callback
		let validator = new SudokuValidator()
		validator.validate(puzzleString, this.onValidate)
	}
	onValidate = (result:SudokuValidatorResult) => {
		if(result.isValid){
			let ssr = new SudokuServiceResponse(result.isValid)
			ssr.setIsComplete(result.isComplete)
			ssr.setErrors(result.errors)
			this.callback(ssr)
		}else{
			this.callback(this.getFailedValidationServiceResponse(result.errors))
		}
	}
	getFailedValidationServiceResponse = (errors:Array<Number>) => {
		let ssr = new SudokuServiceResponse(false)
		ssr.setErrors(errors)
		return ssr
	}

	// ---- new puzzle
	getNewPuzzle = (callback:Function) => {
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
	getSuccessfulNewPuzzleServiceResponse = (puzzleResult:any) => {
		let ssr = new SudokuServiceResponse(true)
		ssr.setPuzzle(puzzleResult)
		return ssr
	}
	getFailedNewPuzzleServiceResponse = (error:any) => {
		let ssr = new SudokuServiceResponse(false)
		ssr.addError(error)
		return ssr
	}
}
// ------ Sudoku Hint

class SudokuHintFinder{
	puzzleValues:Array<String>
	cells:Array<SudokuSolutionCell>
	boxes:Array<SudokuBox>
	rows:Array<SudokuRow>
	columns:Array<SudokuColumn>
	callback:Function
	constructor(){
		this.puzzleValues = []
		this.cells = []
		this.boxes = []
		this.rows = []
		this.columns = []
	}
	findHint = (puzzleString:String, callback:Function) => {
		this.callback = callback
		this.puzzleValues = puzzleString.split("")
		this.initCells()
		this.initBoxesRowsColumns()
		this.cellsSetOpenNumbers()
		let algorithmList = [this.findHiddenSingleInBoxes,this.findHiddenSingleInRows, this.findHiddenSingleInColumns, this.findNakedSingle]
		for(let i = 0; i < algorithmList.length; i++){
			let hint:SudokuServiceHint = algorithmList[i]()
			if(hint != null){this.callback(hint); return}
		}
		this.callback(null)
		return

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
		return this.findHiddenSingleInGroupings(this.boxes, "Box")
	}
	findHiddenSingleInRows = () => {
		return this.findHiddenSingleInGroupings(this.rows, "Row")
	}
	findHiddenSingleInColumns = () => {
		return this.findHiddenSingleInGroupings(this.columns, "Column")
	}
	findNakedSingle = () => {
		let len = this.cells.length
		for(let i = 0; i < len; i++){
			let cell:SudokuSolutionCell = this.cells[i]
			if(cell.value == "0" && cell.openNumbers.length == 1){
		    		return (new SudokuServiceHint(cell.index, String(cell.openNumbers[0]), "Naked Single"))
		    	}
		}
		return null
	}
	findHiddenSingleInGroupings = (groupings:Array<any>, type:String) => {
		let len = groupings.length
		for(let i = 0; i < len; i++){
			let group = groupings[i]
			let hiddenSingleHint = this.getHiddenSingle(group.cells, type)
			if(hiddenSingleHint != null){
				return hiddenSingleHint
			}
		}
		return null
	}
	getHiddenSingle = (cells:Array<SudokuSolutionCell>, type:String) =>{
		let len = cells.length
		let vals = {"1":[], "2":[], "3":[], "4":[], "5":[],"6":[],"7":[], "8":[],"9":[]}
		// make a map of values with an array of cells that have that value as an open value
		for(let i = 0; i < len; i++){
			let cell = cells[i]
			let openNumbers = cell.openNumbers
			if(openNumbers.length > 0){
				let leng = openNumbers.length
				for(let j = 0; j < leng; j++){
					let key = String(openNumbers[j])
					vals[key].push(i)
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
		  	return new SudokuServiceHint(cell.index, key, "Hidden Single:" + type)
		  }
		}


		return null
	}
}

class SudokuColumn{
	index:Number
	allCells:Array<SudokuSolutionCell>
	cells:Array<SudokuSolutionCell>
	constructor(index:Number, cells:Array<SudokuSolutionCell>){
		this.index = index
		this.allCells = cells
		this.cells = []
		this.setCells()
		this.allCells = null
	}

	setCells = () =>{
		let offset = Number(this.index) % 9
		for(let i = 0; i < 9; i++){
			let cell = this.allCells[(i*9) + offset]
			cell.setColumn(this)
			this.cells.push(cell)
		}
	}

	getClosedNumbers = () =>{
		let nums = []
		for(let i = 0; i < this.cells.length; i++){
			let val = this.cells[i].value
			if (val != "0"){nums.push(val)}
		}
		return nums
	}
}

class SudokuRow{
	index:Number
	allCells:Array<SudokuSolutionCell>
	cells:Array<SudokuSolutionCell>
	constructor(index:Number, cells:Array<SudokuSolutionCell>){
		this.index = index
		this.allCells = cells
		this.cells = []
		this.setCells()
	}

	setCells = () =>{
		let start = Number(this.index) * 9
		for(let i = 0; i < 9; i++){
			let cell = this.allCells[start+i]
			cell.setRow(this)
			this.cells.push(cell)
		}
	}

	getClosedNumbers = () =>{
		let nums = []
		for(let i = 0; i < this.cells.length; i++){
			let val = this.cells[i].value
			if (val != "0"){nums.push(val)}
		}
		return nums
	}
}

class SudokuBox{
	cellsInABoxRow:Number
	index:Number
	allCells:Array<SudokuSolutionCell>
	cells:Array<SudokuSolutionCell>
	constructor(index:Number, cells:Array<SudokuSolutionCell>){
		this.cellsInABoxRow = 3
		this.index = index
		this.allCells = cells
		this.cells = []
		this.setCells()
	}

	setCells = () =>{
		let indexPerCells:number = Number(this.index)/Number(this.cellsInABoxRow)
		let rowStartIndex:Number = Math.floor(indexPerCells) * Number(this.cellsInABoxRow)
		let columnStartIndex = (Number(this.index) % Number(this.cellsInABoxRow)) * Number(this.cellsInABoxRow);
		for(let i = 0; i < 3; i++){
			for(let j = 0; j < 3; j++){
				let fullIndex = (Number(rowStartIndex) * 9)  + (i * 9) + columnStartIndex + j
				let cell = this.allCells[fullIndex]
				cell.setBox(this)
				this.cells.push(cell)
			}
		}
	}

	getClosedNumbers = () =>{
		let nums = []
		let len = this.cells.length
		for(let i = 0; i < len; i++){
			let val = this.cells[i].value
			if (val != "0"){
				nums.push(val)
			}
		}
		return nums
	}
}

class SudokuSolutionCell {
	index:Number
	value:String
	row:SudokuRow
	column:SudokuColumn
	box:SudokuBox
	allClosedNumbers:Set<String>
	openNumbers:Array<Number>
	constructor(index:Number, value:String){
		this.index = index
		this.value = value
		this.row = null
		this.box = null
		this.column = null
		this.allClosedNumbers = null
		this.openNumbers = []
	}

	setRow = (row:SudokuRow) => {
		this.row = row
	}

	setColumn = (column:SudokuColumn) => {
		this.column = column
	}

	setBox = (box:SudokuBox) => {
		this.box = box
	}

	loadClosedNumbers = () => {
		if(this.value == "0"){
			let boxNumbers = this.box.getClosedNumbers()
			let rowNumbers = this.row.getClosedNumbers()
			let columnNumbers = this.column.getClosedNumbers()
			this.allClosedNumbers = new Set( boxNumbers.concat(rowNumbers).concat(columnNumbers) )
		}
	}

	setOpenNumbers = () => {
		if(this.value == "0"){
			this.loadClosedNumbers()
			for(let i = 1; i < 10; i++){
				if(!this.allClosedNumbers.has(String(i))){
					this.openNumbers.push(i)
				}
			}
		}

	}
}


// --------------------------------


class SudokuValidator{
	puzzleString:String
	puzzleValues:Array<String>
	callback:Function
	constructor(){
		this.puzzleValues = []
		this.callback = null
	}
	validate = (puzzleString:String, callback:Function) =>{
		this.puzzleString = puzzleString
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
							console.log('getPuzzleSolution.error' + error)
	       	}
     	)
	}
	validateValues = (solutionString:String) => {
		let errors = []
		let isComplete = false
		let isValid = true
		let solutionValues = solutionString.split("")
		for(let i = 0; i < solutionValues.length; i++){
			let puzzleVal = this.puzzleValues[i]
			let solutionVal = solutionValues[i]
			if(puzzleVal != "0" && puzzleVal != solutionVal){
				errors.push(i)
				isValid = false
			}
		}
		if(isValid){
			let sv = String(solutionString)
			let ps = String(this.puzzleString)
			isComplete = (sv == ps)
		}
		this.onValidate (new SudokuValidatorResult(isValid, isComplete, errors))
	}
	onSolutionReceived = (solutionString:String) => {
		this.validateValues(solutionString)
	}
	onValidate = (validatorResult:SudokuValidatorResult) => {
		this.callback(validatorResult)
	}
}
