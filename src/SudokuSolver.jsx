      class SudokuSolver extends React.Component {

	 	constructor(props){
	 		super(props)
	 		this.solverUtilities = new SudokuSolverUtilities(this)
	 		this.setInitialState()
	 	}

	 	setInitialState = () => { 
	 		this.state = {}
	 		this.tableBuild = {}
	 		this.state.greeting = "Sudoku Puzzle Status: "
	 		this.state.isValid = false
	 		this.state.hint = null
	 		this.state.puzzleArray = this.solverUtilities.buildEmptyPuzzleArray()
	 		this.state.validationErrors = []
	 		this.state.isComplete = false
	 		this.state.originalPuzzleArray = [...this.state.puzzleArray]

	 		this.state.hintMap = [0,1,2,3,9,10]

	 		this.setState(this.state)
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

	 	//-- utility functions

	 	getService = () => {
	 		return new SudokuBridgeService()
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
	 		let a = this.solverUtilities.puzzleStringToArray(s)
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
	 		let puzzleString = this.solverUtilities.toString()
	 		this.getService().validate(puzzleString, this.onValidate)	
	 	}

		//-- hint

	 	getHint = () => {
	 		this.getService().getHint(this.solverUtilities.toString(), this.onHintReceived)
	 	}

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

	 	// render

	 	getHTML = () => {  // this supports renderclient interface: 
	 		let renderer = new SudokuRenderer()
	 		return renderer.render(this)
	 	}

		render() {
			return this.getHTML()
		}
      }

      ReactDOM.render(<SudokuSolver />, document.getElementById('sudoku_solver_shell'))
