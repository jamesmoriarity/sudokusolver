      /// <reference types="react" />
      /// <reference path="./SudokuSolverUtilities.ts" />
      /// <reference path="./Renderer/SudokuRenderer.jsx" />
      class SSState {
        greeting:String
        isValid:Boolean
        hint:SudokuServiceBridgeHint
        puzzleArray:Array<Number>
        validationErrors:Array<Number>
        isComplete:Boolean
        originalPuzzleArray:Array<String>
        patternMap:Object
        constructor(){}

      }

      class SudokuSolver extends React.Component {

        solverUtilities:SudokuSolverUtilities
        state:SSState

    	 	constructor(props:any){
    	 		super(props)
    	 		this.solverUtilities = new SudokuSolverUtilities(this)
    	 		this.setInitialState()
    	 	}

    	 	setInitialState = () => {
    	 		this.state = new SSState()
    	 		this.state.greeting = "Sudoku Puzzle : Status : "
    	 		this.state.isValid = false
    	 		this.state.hint = null
    	 		this.state.puzzleArray = this.solverUtilities.buildEmptyPuzzleArray()
    	 		this.state.validationErrors = []
    	 		this.state.isComplete = false
    	 		this.state.originalPuzzleArray = [...this.getPuzzleArray()]
    	 		this.state.patternMap = {}
    	 		this.setState(this.state)
    	 	}

    	 	//-- utility functions

    	 	getService = () => {
    	 		return new SudokuBridgeService()
    	 	}

    	 	//-- Cell Change

    	 	onCellChange = (event:any, cellIndex:Number) => {
    			let value = event.target.value
    	 		/* if mode == pencil
    				this.cells[cellIndex].setPencil(value)*/
    	 		/* if mode == possibleValues
    				this.cells[cellIndex].setPossibleValue(value)*/
          // if mode == value
          let isValidEntry:Boolean = (value == "" || (!isNaN(value) && Number(value) > 0))
    	 		if(isValidEntry){
    		 		this.solverUtilities.checkToRemoveValidationError(cellIndex);
    		 		this.solverUtilities.checkToRemoveHint(cellIndex)
    	 			this.updateCell(cellIndex, value)
    	 		}
    	 	}
    	 	updateCell = (cellIndex:any, value:String) => {
     			let newArray:Array<String> = this.getPuzzleArray()
     			newArray[cellIndex] = value
    	 		this.setState({puzzleArray:newArray, isValid:false, isComplete:false})
    	 	}

    	 	//-- new puzzle
    	 	newPuzzle = () => {
    	 		this.getService().getNewPuzzle(this.onNewPuzzle)
    	 	}

    	 	onNewPuzzle = (sbsResponse:SBSResponse) =>{
    	 		if(sbsResponse.isValid){
    	 			this.setNewPuzzle(sbsResponse)
    	 		}
    	 		else{
    	 			alert("puzzle load failed: " + sbsResponse.errors.join(":"))
    	 		}

    	 	}

    	 	setNewPuzzle = (sbsResponse:SBSResponse) => {
    	 		let s = String(sbsResponse.puzzle.start)
    	 		let a = this.solverUtilities.puzzleStringToArray(s)
    	 		this.setState({
    	 						puzzleArray:a,
    	 						originalPuzzleArray: [...a],
    	 						isValid:true,
    	 						isComplete:false,
    	 						validationErrors:[],
    	 						hint:null,
    	 						patternMap:null	})
    	 	}

    	 	//-- reset

    	 	reset = () => {
    	 		this.resetPuzzle()
    	 	}

    	 	resetPuzzle = () => {
    	 		this.setState({
    	 						puzzleArray: [...this.state.originalPuzzleArray],
    	 						isValid: true,
    	 						isComplete: false,
    	 						validationErrors: [],
    	 						hint: null,
    	 						patternMap: null	})
    	 	}

        getPuzzleArray = () =>{
          let a:Array<String> = this.getPuzzleArray()
          return a
        }

    	 	//-- validation

    	 	onValidate = (sbsResponse:SBSResponse) => {
    	 		this.setState({puzzlieArray:[...this.getPuzzleArray()], isValid:sbsResponse.isValid, isComplete:sbsResponse.isComplete, validationErrors:[...sbsResponse.errors]})
    	 		// this.setState(sbsResponse)
    	 	}

    	 	validate = () => {
    	 		let puzzleString = this.solverUtilities.toString(this.getPuzzleArray())
    	 		this.getService().validate(puzzleString, this.onValidate)
    	 	}

    		//-- hint

    	 	getHint = () => {
    	 		this.getService().getHint(this.solverUtilities.toString(this.getPuzzleArray()), this.onHintReceived)
    	 	}

    	 	onHintReceived = (sbsResponse:SBSResponse) => {
    			this.setState({hint:sbsResponse.hint, patternMap:this.solverUtilities.getPatternMap()})
    			this.updateCell(sbsResponse.hint.index, sbsResponse.hint.value)
    	 		console.log("sbsResponse: hint " + sbsResponse.hint.type)
    	 	}

    	 	//-- render

    		render() {
    			let renderer = new SudokuRenderer()
    	 		return renderer.render(this)
    		}

      }

    //  ReactDOM.render(<SudokuSolver />, document.getElementById('sudoku_solver_shell'))
