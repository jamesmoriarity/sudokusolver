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
	 		if(colIndex == 2 || colIndex == 5){	classes.push("column-right") }
	 		if(rowIndex == 2 || rowIndex == 5){ 	classes.push("row-bottom") }
	 		if(!this.props.isValid){ 			classes.push("invalidCell") }
	 		if(this.props.isHinted){ 			classes.push("hintedCell") }
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
	 		this.state.greeting = "Sudoku Puzzle Status: "
	 		this.state.isValid = false
	 		this.state.hint = null
	 		this.state.puzzleArray = this.buildEmptyPuzzleArray()
	 		this.state.validationErrors = []
	 		this.state.isComplete = false
	 		this.state.originalPuzzleArray = [...this.state.puzzleArray]
	 		this.setState(this.state)
	 	}

	 //-- utility functions
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

	 // -- build cells and css helper functions
	 	getListItems = () => {
	 		let cellShells = this.state.puzzleArray.map((value, index) =>
	 			<CellShell 
	 				index={index} 
	 				isValid={this.isListItemValid(index)} 
	 				isHintRelated={this.isListItemHintRelated(index, value)} 
	 				isHinted={this.isListItemHinted(index, value)} 
	 				value={value} 
	 				onCellChange={this.onCellChange}/>
			)
			return cellShells
			
			/*
			for(let i = 0; i < this.state.puzzleArray.length; i++){

			}
			let h = <table id="What">{this.getRow(0, cellShells)}</table>
			return h
			*/
	 	} 

	 	getRowCells = (rowIndex) => {
			let rowStart = rowIndex * 9
			let cells = []
			for(let i = 0; i < 9; i++){
				//cells.push(this.)
			}
			return cells

	 	}

	 	getRow = (rowIndex, cellShells) => {
	 		return <tr>{this.getRowCells(rowIndex, cellShells)}</tr>
	 	}

	 	isListItemHintRelated = (index, value) => {
	 		let b = (this.state.hint == null) ? false : (this.state.hint.index != index && this.state.hint.value == value && String(this.state.hint.type).includes("Hidden Single") )
	 		return b	
	 	}

	 	isListItemHinted = (index, value) => {
	 		let b = (this.state.hint == null) ? false : (this.state.hint.index == index && this.state.hint.value == value)
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
	 		this.setState({puzzleArray:a, originalPuzzleArray: [...a]})
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

	 	setValidationErrors = (errors) => {
	 		this.setState({validationErrors:errors})
	 	}

	 	handleValidationErrors = (errors) => {
	 		this.setValidationErrors([...errors])
	 	}

	 	onValidate = (sbsResponse) => {
	 		let e = []
	 		if(!sbsResponse.isValid){
	 			e = [...sbsResponse.errors]
	 		}
	 		this.setState({isValid:sbsResponse.isValid, isComplete:sbsResponse.isComplete, errors:e})
	 	}

	 	validate = () => {
	 		let puzzleString = this.toString()
	 		this.getService().validate(puzzleString, this.onValidate)	
	 	}

	//-- hint

	 	onHintReceived = (sbsResponse) => {
	 		let a = [...this.state.puzzleArray]
	 		a[sbsResponse.hint.index] = sbsResponse.hint.value
	 		this.setState({puzzleArray: a, hint:sbsResponse.hint})
	 		console.log("sbsResponse: hint " + sbsResponse.hint.type)
	 	}

	 	getHint = () => {
	 		this.getService().getHint(this.toString(), this.onHintReceived)
	 	}

	// -- html

	 	getHTML = () => {
	 		return 	<div id="sudoku">
						<div>{this.state.greeting} Valid: {(this.state.isValid) ? "true" : "false"} Complete: {(this.state.isComplete)?"true":"false"}</div>
						<div id="grid">
							{this.getListItems()}
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
