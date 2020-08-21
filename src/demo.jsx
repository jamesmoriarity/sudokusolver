	class CellShell extends React.Component {

		constructor(props){
			super(props)
		}

		render(){ 
			return this.getHTML()
		}

		getHTML = () => {
		return	<div class={"cell_shell " + this.getClasses(this.props.index)}>
					<input  
		  				id={"cell_" + this.props.index} 
		  				value={"" + this.props.value} 
		  				onChange={(ev) => this.props.onCellChange(ev, this.props.index)}
		  				type="text" maxlength="1"  />
				</div>
		}

		getClasses = (index) => {
	 		let classes = []
	 		let colIndex = index % 9
	 		let rowIndex = Math.floor(index/9)
	 		let isInHintDisplay = this.props.hintMap.includes(Number(index))
	 		if(colIndex == 2 || colIndex == 5){	classes.push("column-right") }
	 		if(rowIndex == 2 || rowIndex == 5){ 	classes.push("row-bottom") }
	 		if(!this.props.isValid){ 			classes.push("invalidCell") }
	 		if(this.props.isHinted){ 			classes.push("hintedCell") }
	 		if(isInHintDisplay && !this.props.isHintRelated){
	 										classes.push("boxHiddenSinglePattern")
	 		}
	
	 		if(this.props.isHintRelated){ 		classes.push("hintRelatedCell") }
	 		return classes.join(" ")
		}
	}

      class SudokuSolver extends React.Component {

	 	constructor(props){
	 		super(props)
	 		this.setInitialState()
	 	}

	 	setInitialState = () => { 
	 		this.state = {}
	 		this.tableBuild = {}
	 		this.state.greeting = "Sudoku Puzzle Status: "
	 		this.state.isValid = false
	 		this.state.hint = null
	 		this.state.puzzleArray = this.buildEmptyPuzzleArray()
	 		this.state.validationErrors = []
	 		this.state.isComplete = false
	 		this.state.originalPuzzleArray = [...this.state.puzzleArray]

	 		this.state.hintMap = [0,1,2,3,9,10]

	 		this.setState(this.state)
	 	}

	 //-- utility functions

		buildPuzzleGridFromArray = (arr) => {
			let grid = []
			for(let i = 0; i < 9; i++){
				let row = []
				for(let j = 0; j < 9; j++){
					let arrIndex = (i * 9) + j
					row.push(arr[arrIndex])
				}
				grid.push(row)
			}
			return grid
		}


	 	resetState = () => {
	 		this.setState({	
	 				puzzleArray: [...this.state.originalPuzzleArray], 
	 				isValid: true,
	 				isComplete: false,
	 				hint: null,
	 				validationErrors: []
	 		})
	 	}

	 	getService = () => {
	 		return new SudokuBridgeService()
	 	}

	 	buildEmptyPuzzleArray = () => {
	 		let a = []
	 		for(let i = 0; i < 81; i++){
	 			a.push("")
	 		}
	 		return a
	 	}

	 	toString = () => {
	 		let arr = this.state.puzzleArray 
	 		let len = arr.length 
	 		let str = ""
	 		for(let i = 0; i < len; i++){
	 			let val = String(arr[i])
	 			if(val == ""){
	 				val = "0"
	 			}
	 			str += String(val)
	 		}
	 		return str;
	 	}

	 	puzzleStringToArray = (s) => {
	 		let a = String(s).split("")
	 		let len = a.length
	 		for(let i = 0; i < len; i++){
	 			let val = a[i]
	 			if(val == "0"){
	 				a[i] = ""
	 			}
	 		}
	 		return [...a]
	 	}

	 // -- build grid with cells and css helper functions 

	 	getTableGrid = () => {
	 		let puzzleGrid = this.buildPuzzleGridFromArray([...this.state.puzzleArray])
	 		this.state.tableBuild = {}
	 		let rows = puzzleGrid.map(this.renderTableRow)
	 		return <table cellpadding="0" cellspacing="0" border="0">{rows}</table>
	 	}

	 	renderTableRow = (row, rowIndex) => {
	 		this.state.tableBuild.rowIndex = rowIndex
	 		let cells = row.map(this.renderTableCell)
	 		return <tr>{cells}</tr>
	 	}

	 	renderTableCell = (value, cellIndex) =>{
	 		let fullIndex = (this.state.tableBuild.rowIndex * 9) + cellIndex
	 		let cell = <td><CellShell 
		 				index={fullIndex} 
		 				isValid={this.isListItemValid(fullIndex)} 
		 				isHintRelated={this.isListItemHintRelated(fullIndex, value)} 
		 				isHinted={this.isListItemHinted(fullIndex, value)} 
		 				value={value} 
		 				onCellChange={this.onCellChange}
						hintMap={this.state.hintMap}/></td>
	 		return cell
	 	}

	 	isListItemHintRelated = (index, value) => {

	 		/*
	 			get the rows and columns in the same box as the hinted cell
				if they contain the hinted value, highlight the row/column from
				the cell with the hinted value through the box

				get box from cellindex
					let row = Math.floor(index/9)
					let column = index % 9
					let boxIndex = (row * 3) + column

				get rowIndexes from boxIndex
					let startRow = (Math.floor(boxIndex/3) * 3)
					return [startRow, startRow + 1, startRow + 2]

				get columnIndexes from boxIndex
					let startColumn = (boxIndex % 3) * 3
					return [startColumn, startColumn + 1, startColumn + 2]

				getCellIndexesFromRowByRowIndex
					let start = rowIndex * 9
					let end = start + 9
					let a = []
					for(let i = start; i < end; i++){
						a.push(String(i))
					}
					return a

				getCellIndexesFromColumnByColumnIndex
					let a = []
					for(let i = 0; i < 9; i++){
						a.push( (9 * i) + columnIndex )
					}
					return a
	 		*/




	 		let b = (this.state.hint == null) ? false : (this.state.hint.index != index && this.state.hint.value == value && String(this.state.hint.type).includes("Hidden Single") )
	 		return b	
	 	}

	 	isListItemHinted = (index, value) => {
	 		let b = (this.state.hint == null) ? false : (this.state.hint.index == index)
	 		return b
	 	}

	 	isListItemValid = (index) => {
	 		let b = !this.state.validationErrors.includes(index)
	 		return b
	 	}

	 //-- Cell Change

	 	onCellChange = (event, i) => {
	 		let val = event.target.value
	 		if(val == "" || (!isNaN(val) && Number(val) > 0)){
	 			this.checkToRemoveValidationError(val, i);
	 			this.checkToRemoveHint(val, i)
	 			let newArray = [...this.state.puzzleArray]
	 			newArray[i] = val
		 		this.setState({puzzleArray:newArray, isValid:false, isComplete:false})
	 		}
	 	}

	 	checkToRemoveValidationError = (val, i) => {
 			if(this.state.validationErrors.includes(i)){
 				this.removeFromValidationErrors(i)
 			}	
	 	}

	 	checkToRemoveHint = (val, i) => {
	 		if(this.state.hint != null && i == this.state.hint.index){
	 			this.setState({hint:null})
	 		}
	 	}

	 	removeFromValidationErrors = (value) => {
			let updatedValErrors = this.state.validationErrors.filter(
				function(element){ return element != value }
			)	
	 		this.setState({validationErrors:updatedValErrors})
	 	}


	 //-- new puzzle	 	

	 	setNewPuzzle = (sbsResponse) => {
	 		this.resetState()
	 		let s = String(sbsResponse.puzzle.start)
	 		let a = this.puzzleStringToArray(s)
	 		this.setState({puzzleArray:a, originalPuzzleArray: [...a], isValid:true, isComplete:false})
	 	}

	 	onNewPuzzle = (sbsResponse) =>{
	 		if(sbsResponse.isValid){
	 			this.setNewPuzzle(sbsResponse)
	 		}
	 		else{
	 			alert("puzzle load failed: " + sbsResponse.errors.join(":"))
	 		}
	 		
	 	}

	 	newPuzzle = () => {
	 		this.getService().getNewPuzzle(this.onNewPuzzle)
	 	}

	 //-- reset

	 	reset = () => {
	 		this.resetState()
	 	}

	 //-- validation 

	 	onValidate = (sbsResponse) => {
	 		this.setState({isValid:sbsResponse.isValid, isComplete:sbsResponse.isComplete, validationErrors:sbsResponse.errors})
	 		// this.setState(sbsResponse)
	 	}

	 	validate = () => {
	 		let puzzleString = this.toString()
	 		this.getService().validate(puzzleString, this.onValidate)	
	 	}

	//-- hint

	 	onHintReceived = (sbsResponse) => {
	 		let a = [...this.state.puzzleArray]
	 		a[sbsResponse.hint.index] = sbsResponse.hint.value
	 		this.makeHighlightMap(sbsResponse.hint)
	 		this.setState({hint:sbsResponse.hint, puzzleArray:a})
	 		console.log("sbsResponse: hint " + sbsResponse.hint.type)
	 	}

	 	makeHighlightMap = (hint) => {
	 		let highlightMap = []
	 		if(hint.type == "Box Hidden Single"){
/*		
	 			get all row indexes and column indexes intersecting box

	 			for each row/column
	 				if there's a cell with hint.value in that row/column
	 					superhighlight that cell
	 					- highlightMap.push({index:matchIndex, state:"hintNumber"})
	 					highlight

*/
	 		}
	 	}

	 	getHint = () => {
	 		this.getService().getHint(this.toString(), this.onHintReceived)
	 	}

	// -- html

	 	getHTML = () => {
	 		return 	<div id="sudoku">
						<div>{this.state.greeting} Valid: {(this.state.isValid) ? "true" : "false"} Complete: {(this.state.isComplete)?"true":"false"}</div>
						<div id="grid">
							{this.getTableGrid()}
						</div>
						<div id="new_game_shell">
							<button id="new_game_btn" onClick={this.newPuzzle}>New Puzzle</button>
						</div>
						<div id="reset"><button id="reset_btn" onClick={this.reset}>Reset</button></div>
						<div id="validate"><button id="validate_btn" onClick={this.validate}>Validate</button></div>
						<div id="get_hint"><button id="get_hint_btn" onClick={this.getHint}>Get Hint</button></div>
					</div>
	 	}

		render() {
			return this.getHTML()
		}
      }

      ReactDOM.render(<SudokuSolver />, document.getElementById('sudoku_solver_shell'))
