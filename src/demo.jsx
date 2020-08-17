	class CellShell extends React.Component {

		constructor(props){
			super(props)
		}

		render(){ 
			return this.getHTML()
		}

		getHTML = () => {
			return <div class={"cell_shell " + this.getColumnRowClass(this.props.index)}>
						<input  
			  				id={"cell_" + this.props.index} 
			  				value={"" + this.props.value} 
			  				onChange={(ev) => this.props.onCellChange(ev, this.props.index)}
			  				type="text" maxlength="1"  />
					</div>
		}

		getColumnRowClass = (index) => {
	 		let classes = ""
	 		let colIndex = index % 9
	 		classes += (colIndex == 2 || colIndex == 5) ? "column-right " : ""
	 		let rowIndex = Math.floor(index/9)
	 		classes += (rowIndex == 2 || rowIndex == 5) ? "row-bottom" : ""
	 		return classes
		}
	}

      class SudokuSolver extends React.Component {

	 	constructor(props){
	 		super(props)
	 		this.greeting = "Aloha"
	 		this.setInitialState()
	 		this.originalPuzzleArray = this.state.puzzleArray.slice()
	 	}

	 	setInitialState = () => { 
	 		this.state = {}
	 		this.state.puzzleArray = this.buildEmptyPuzzleArray()
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

	 	getColumnClass = (index) => {
	 		let classes = ""
	 		let colIndex = index % 9
	 		classes += (colIndex == 2 || colIndex == 5) ? "column-right " : ""
	 		let rowIndex = Math.floor(index/9)
	 		classes += (rowIndex == 2 || rowIndex == 5) ? "row-bottom" : ""
	 		return classes
	 	}

	 	getListItems = () => {
	 		return this.state.puzzleArray.map((value, index) =>
	 			<CellShell index={index} value={value} onCellChange={this.onCellChange}/>
			)
	 	} 

	 	updateStateOnCellChange = () => {
	 		this.setState({puzzleArray: this.state.puzzleArray})
	 	}

	 	setNewPuzzle = (result) => {
	 		let s = String(result.puzzle.start)
	 		let a = this.puzzleStringToArray(s)
	 		this.originalPuzzleArray = [...a]
	 		this.setState({puzzleArray:a})
	 	}

	 	onNewPuzzle = (result) =>{
	 		if(result.isValid){
	 			this.setNewPuzzle(result)
	 		}
	 		else{
	 			alert("puzzle load failed: " + result.error)
	 		}
	 		
	 	}

	 	newPuzzle = () => {
	 		this.getService().getNewPuzzle(this.onNewPuzzle)
	 	}

	 	reset = () => {
	 		this.setState({puzzleArray: [...this.originalPuzzleArray]})
	 	}

	 	onValidate = (sbsResponse) => {
	 		console.log("validate hit!!!! valid:" + sbsResponse.isValid )
	 	}

	 	validate = () => {
	 		let puzzleString = this.toString()
	 		this.getService().validate(puzzleString, this.onValidate)	
	 	}

	 	getHint = () => {
	 		console.log("getHint hit!!!!")
	 	}

	 	onCellChange = (event, i) => {
	 		let val = event.target.value
	 		if(val == "" || (!isNaN(val) && Number(val) > 0)){
		 		this.state.puzzleArray[i] = val
		 		this.updateStateOnCellChange()
	 		}
	 	}


	 	getHTML = () => {
	 		return 	<div id="sudoku">
						<div>{this.greeting}</div>
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
