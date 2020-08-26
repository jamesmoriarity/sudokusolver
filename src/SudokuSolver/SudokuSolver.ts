      /// <reference types="react" />
      /// <reference types="react-dom" />
      /// <reference path="./SudokuSolverUtilities.ts" />
      /// <reference path="./Renderer/SudokuRenderer.js" />

      class SSState {
        greeting:String
        isValid:Boolean
        hint:SudokuServiceBridgeHint
        puzzleArray:Array<String>
        validationErrors:Array<Number>
        isComplete:Boolean
        originalPuzzleArray:Array<String>
        patternMap:Object
        constructor(){
    	 		this.greeting = "Sudoku Puzzle : Status : "
          this.patternMap = {}
    	 		this.validationErrors = []
    	 		this.isComplete = false
    	 		this.isValid = false
    	 		this.hint = null
        }
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
    	 		let sss = new SSState()
    	 		sss.puzzleArray = this.solverUtilities.buildEmptyPuzzleArray()
    	 		sss.originalPuzzleArray = this.solverUtilities.buildEmptyPuzzleArray()
    	 		this.state = sss
          // don't use setState at this point, because no state obj exists yet
          // use setState after setInitialState has fired
    	 	}

    	 	//-- utility functions

    	 	getBridgeService = () => {
    	 		return new SudokuBridgeService()
    	 	}

        getPuzzleArray = () =>{
          let a:Array<String> = this.state.puzzleArray
          return a
        }
        toString = () =>{
          return this.solverUtilities.puzzleArrayToString(this.getPuzzleArray())
        }


    	 	//-- Cell Change

    	 	onCellChange = (event:any, cellIndex:Number) => {
    	 		/* if mode == pencil this.cells[cellIndex].setPencil(value)*/
    	 		/* if mode == possibleValues this.cells[cellIndex].setPossibleValue(value)*/
          // if mode == value
          let valString = String(event.target.value)
    	 		if(this.solverUtilities.isValidEntry(valString)){
    		 		this.solverUtilities.checkToRemoveRelatedValidationError(cellIndex);
    		 		this.solverUtilities.checkToRemoveRelatedHint(cellIndex)
    	 			this.updateCell(cellIndex, valString)
    	 		}
    	 	}

    	 	updateCell = (cellIndex:any, value:String) => {
     			let newArray:Array<String> = this.getPuzzleArray()
     			newArray[cellIndex] = value
    	 		this.setState({puzzleArray:newArray, isValid:false, isComplete:false})
    	 	}

    	 	//-- new puzzle
    	 	newPuzzle = () => {
    	 		this.getBridgeService().getNewPuzzle(this.onNewPuzzle)
    	 	}

    	 	onNewPuzzle = (sbsResponse:SBSResponse) =>{
    	 		if(sbsResponse.isValid){
    	 			this.setNewPuzzle(sbsResponse)
    	 		}
    	 		else{
    	 			this.handlePuzzleLoadFailure(sbsResponse)
    	 		}
    	 	}

        handlePuzzleLoadFailure = (sbsResponse:SBSResponse) =>{
          alert("puzzle load failed: " + sbsResponse.errors.join(":"))
        }

    	 	setNewPuzzle = (sbsResponse:SBSResponse) => {
    	 		let startNumbers = String(sbsResponse.puzzle.start)
    	 		let a = this.solverUtilities.puzzleStringToArray(startNumbers)
    	 		let newState = new SSState()
    	 		newState.puzzleArray = a
    	 		newState.originalPuzzleArray = [...a]
    	 		newState.isValid = true
          this.setState(newState)
    	}

    	 	//-- reset

    	 	reset = () => {
    	 		this.resetPuzzle()
    	 	}

    	 	resetPuzzle = () => {
          let state:SSState = new SSState()
          state.puzzleArray = [...this.state.originalPuzzleArray]
          state.isValid = true
    	 		this.setState(state)
    	 	}

    	 	//-- validation
        validate = () => {
          this.getBridgeService().validate(this.toString(), this.onValidate)
        }
    	 	onValidate = (sbsResponse:SBSResponse) => {
    	 		this.setState({isValid:sbsResponse.isValid, isComplete:sbsResponse.isComplete, validationErrors:[...sbsResponse.errors]})
    	 	}
    		//-- hint
    	 	getHint = () => {
    	 		this.getBridgeService().getHint(this.toString(), this.onHintReceived)
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
