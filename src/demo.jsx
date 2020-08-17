	class CellShell extends React.Component {

		constructor(props){
			super(props)
		}

		render(){ 
			return this.getHTML()
		}

		getHTML = () => {
			return <div class={"cell_shell " + this.getClasses(this.props.index)}>
						<input  
			  				id={"cell_" + this.props.index} 
			  				value={"" + this.props.value} 
			  				onChange={(ev) => this.props.onCellChange(ev, this.props.index)}
			  				type="text" maxlength="1"  />
					</div>
		}

		getClasses = (index) => {
	 		let classes = ""
	 		let colIndex = index % 9
	 		classes += (colIndex == 2 || colIndex == 5) ? " column-right " : ""
	 		let rowIndex = Math.floor(index/9)
	 		classes += (rowIndex == 2 || rowIndex == 5) ? " row-bottom " : ""
	 		classes += (!this.props.isValid) ? " invalidCell " : ""
	 		return classes
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
	 		this.state.puzzleArray = this.buildEmptyPuzzleArray()
	 		this.state.validationErrors = []
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
	 			<CellShell index={index} isValid={this.isListItemValid(index)} value={value} onCellChange={this.onCellChange}/>
			)
	 	} 

	 	isListItemValid = (index) => {
	 		let b = !this.state.validationErrors.includes(index)
	 		return (b)
	 	}

	 	updateStateOnCellChange = () => {
	 		this.setState({puzzleArray: this.state.puzzleArray})
	 	}

	 	onCellChange = (event, i) => {
	 		let val = event.target.value
	 		if(val == "" || (!isNaN(val) && Number(val) > 0)){
	 			this.checkToRemoveValidationError(val, i);
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
	 	removeFromValidationErrors = (value) => {
			let updatedValErrors = this.state.validationErrors.filter(
				function(element){ return element != value }
			)	
	 		this.setState({validationErrors:updatedValErrors})
	 	}


	 	setNewPuzzle = (sbsResponse) => {
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
	 		this.setState({puzzleArray: [...this.originalPuzzleArray]})
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

	 	getHint = () => {
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
