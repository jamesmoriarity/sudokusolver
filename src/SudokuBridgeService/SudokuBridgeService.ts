/// <reference path="../AlphaSudokuService/SudokuService.ts" />
/// <reference path="../AlphaSudokuService/SudokuValidatorResult.ts" />
/// <reference path="../AlphaSudokuService/SudokuServiceResponse.ts" />
/// <reference path="./SudokuServiceBridgeHint.ts" />

console.log("SudokuBridgeService")
class SudokuBridgeService {
	service:SudokuService
	clientCallback:Function
	constructor(){
		this.service = new SudokuService()
		this.clientCallback = null
	}

	getHint = (puzzleString:String, callback:Function) => {
		this.clientCallback = callback
		this.service.getHint(puzzleString, this.onHintReceived)
	}

	onHintReceived = (sudokuServiceResponse:SudokuServiceResponse) => {
		if(!sudokuServiceResponse.isValid){this.clientCallback(null)}
		else{
			let ssbHint:SudokuServiceBridgeHint = SudokuServiceBridgeHint.fromSudokuServiceHint(sudokuServiceResponse.getHint())
			this.clientCallback(ssbHint)
		}
	}

	validate = (puzzleString:String, callback:Function) => {
		this.clientCallback = callback
		this.service.validate(puzzleString, this.onValidate)
	}

	onValidate = (validationResponse:SudokuValidatorResult) =>{
		let isValid = validationResponse.isValid
		let invalidCells = validationResponse.errors
		let isComplete = validationResponse.isComplete
		let validationResult:SBSValidationResult = new SBSValidationResult(isValid, invalidCells, isComplete)
		this.clientCallback(validationResult)
	}

	getNewPuzzle = (callback:Function) => {
		this.clientCallback = callback
		this.service.getNewPuzzle(this.onNewPuzzle)
	}

	onNewPuzzle = (serviceResponse:SudokuServiceResponse) => {
		let puzzle:SBSPuzzle = new SBSPuzzle("id", serviceResponse.puzzle.start)
		this.clientCallback(puzzle)
	}
}

class SBSPuzzle{
	id:String
	puzzleString:String
	constructor(id:String, puzzleString:String){
		this.id = id
		this.puzzleString = puzzleString
	}
}

class SBSValidationResult{
		isValid:Boolean
		isComplete:Boolean
		invalidCells:Number[]
		constructor(isValid:Boolean, invalidCells:Number[], isComplete:Boolean){
			this.isValid = isValid
			this.invalidCells= invalidCells
			this.isComplete = isComplete
		}
}

interface SudokuBridgePuzzle{
  start:String
  solution:String
}
