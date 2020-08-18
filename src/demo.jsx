	class CellShell extends React.Component {

		constructor(props){
			super(props)
		}

		render(){ 
			return this.getHTML()
		}

		getHTML = () => {
			return 	<div class={"cell_shell " + this.getClasses(this.props.index)}>
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
	 		return classes.join(" ")
		}
	}

      class SudokuSolver extends React.Component {

	 	constructor(props){
	 		super(props)
	 		this.setInitialState()
	 		this.originalPuzzleArray = this.state.puzzleArray.slice()
	 	}

	 	setInitialState = () => { 
	 		this.state = {}
	 		this.state.greeting = "Aloha"
	 		this.state.isValid = false
	 		this.state.hint = null
	 		this.state.puzzleArray = this.buildEmptyPuzzleArray()
	 		this.state.validationErrors = []
	 		this.setState(this.state)
	 	}

	 	resetState = () => {
	 		this.setState({	
	 				puzzleArray: [...this.originalPuzzleArray], 
	 				isValid: true,
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

	 	getListItems = () => {
	 		return this.state.puzzleArray.map((value, index) =>
	 			<CellShell index={index} isValid={this.isListItemValid(index)} isHinted={this.isListItemHinted(index, value)} value={value} onCellChange={this.onCellChange}/>
			)
	 	} 

	 	isListItemHinted = (index, value) => {
	 		let b = (this.state.hint == null) ? false : (this.state.hint.index == index || this.state.hint.value == value)
	 		return b
	 	}

	 	isListItemValid = (index) => {
	 		let b = !this.state.validationErrors.includes(index)
	 		return b
	 	}

	 	updateStateOnCellChange = () => {
	 		this.setState({puzzleArray: this.state.puzzleArray})
	 	}

	 	onCellChange = (event, i) => {
	 		let val = event.target.value
	 		if(val == "" || (!isNaN(val) && Number(val) > 0)){
	 			this.checkToRemoveValidationError(val, i);
	 			this.checkToRemoveHint(val, i)
	 			let newArray = [...this.state.puzzleArray]
	 			newArray[i] = val
		 		this.setState({puzzleArray:newArray, isValid:false})
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

	 	setNewPuzzle = (sbsResponse) => {
	 		this.resetState()
	 		let s = String(sbsResponse.puzzle.start)
	 		let a = this.puzzleStringToArray(s)
	 		this.originalPuzzleArray = [...a]
	 		this.setState({puzzleArray:a})
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

	 	reset = () => {
	 		this.resetState()
	 	}

	 	setValidationErrors = (errors) => {
	 		this.setState({validationErrors:errors})
	 	}

	 	handleValidationErrors = (errors) => {
	 		this.setValidationErrors([...errors])
	 	}

	 	onValidate = (sbsResponse) => {
	 		this.setState({isValid:sbsResponse.isValid})
	 		if(!sbsResponse.isValid){
	 			this.handleValidationErrors(sbsResponse.errors)
	 		}
	 	}

	 	validate = () => {
	 		let puzzleString = this.toString()
	 		this.getService().validate(puzzleString, this.onValidate)	
	 	}

	 	onHintReceived = (sbsResponse) => {
	 		this.setState({hint:sbsResponse.hint})
	 		console.log("sbsResponse: hint " + sbsResponse.hint)
	 	}

	 	getHint = () => {
	 		this.getService().getHint(this.toString(), this.onHintReceived)
	 		console.log("getHint hit!!!!")
	 	}

	 	getHTML = () => {
	 		return 	<div id="sudoku">
						<div>{this.state.greeting} Valid: {(this.state.isValid) ? "true" : "false"}</div>
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
