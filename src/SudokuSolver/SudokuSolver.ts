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
        originalPuzzleString:String
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
          let a = this.solverUtilities.buildEmptyPuzzleArray()
    	 		sss.puzzleArray = a
    	 		sss.originalPuzzleString = this.solverUtilities.puzzleArrayToString(a)
    	 		this.state = sss
          // don't use setState at this point, because the state obj doesn't yet exist
          // use setState after setInitialState has fired
    	 	}
    	 	//-- Cell Change
    	 	onCellChange = (event:any, cellIndex:Number) => {
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
    	 	onNewPuzzle = (sbsPuzzle:SBSPuzzle) =>{
    	 		if(sbsPuzzle){this.initNewPuzzle(sbsPuzzle)}
    	 		else{alert("puzzle load failed. puzzle object is null")}
    	 	}
    	 	initNewPuzzle = (sbsPuzzle:SBSPuzzle) => {
    	 		let newState = new SSState()
    	 		newState.originalPuzzleString = sbsPuzzle.puzzleString
    	 		newState.puzzleArray = this.solverUtilities.puzzleStringToArray(sbsPuzzle.puzzleString)
    	 		newState.isValid = true
          this.setState(newState)
    	   }

    	 	//-- reset
    	 	reset = () => {
    	 		this.resetPuzzle()
    	 	}
    	 	resetPuzzle = () => {
          let state:SSState = new SSState()
          state.puzzleArray = this.solverUtilities.puzzleStringToArray(this.state.originalPuzzleString)
          state.isValid = true
          state.isComplete = false
    	 		this.setState(state)
    	 	}

    	 	//-- validation
        validate = () => {
          this.getBridgeService().validate(this.toPuzzleString(), this.onValidate)
        }
    	 	onValidate = (val:SBSValidationResult) => {
    	 		if(val)
            this.setState( { isValid:val.isValid, isComplete:val.isComplete,  validationErrors:[...val.invalidCells]} )
    	 	}

    		//-- hint
    	 	getHint = () => {
    	 		this.getBridgeService().getHint(this.toPuzzleString(), this.onHintReceived)
    	 	}
    	 	onHintReceived = (ssbHint:SudokuServiceBridgeHint) => {
          if(ssbHint){
            this.setState({hint:ssbHint, patternMap:this.solverUtilities.getPatternMap(ssbHint)})
      			this.updateCell(ssbHint.index, ssbHint.value)
      	 		console.log("SudokuServiceBridgeHint: hint " + ssbHint.type)
          }
          else{
            console.log("onHintReceived: The hint object was null.")
          }
    	 	}

    	 	//-- render
    		render = () => {
    			let renderer = new SudokuRenderer()
    	 		return renderer.render(this)
    		}

        //-- general functions
        getBridgeService = () => {
          return new SudokuBridgeService()
        }
        getPuzzleArray = () =>{
          let a:Array<String> = this.state.puzzleArray
          return a
        }
        toPuzzleString = () =>{
          return this.solverUtilities.puzzleArrayToString(this.getPuzzleArray())
        }
      }
