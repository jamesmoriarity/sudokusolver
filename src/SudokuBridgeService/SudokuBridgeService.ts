/// <reference path="../AlphaSudokuService/SudokuService.ts" />
/// <reference path="../AlphaSudokuService/SudokuValidatorResult.ts" />
/// <reference path="../AlphaSudokuService/SudokuServiceResponse.ts" />
/// <reference path="./SudokuServiceBridgeHint.ts" />

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
		if(!sudokuServiceResponse.isValid){this.clientCallback(new SBSResponse(false))}
		else{
			let sbsResponse:SBSResponse = new SBSResponse(true)
			let ssbHint:SudokuServiceBridgeHint = SudokuServiceBridgeHint.fromSudokuServiceHint(sudokuServiceResponse.getHint())
			sbsResponse.setHint(ssbHint)
			this.clientCallback(sbsResponse)
		}
	}

	validate = (puzzleString:String, callback:Function) => {
		this.clientCallback = callback
		this.service.validate(puzzleString, this.onValidate)
	}

	onValidate = (validationResponse:SudokuValidatorResult) =>{
		let v:SudokuValidatorResult = validationResponse
		let b = v.isValid
		let sbs = new SBSResponse(b)
		sbs.setErrors(v.errors)
		sbs.setIsComplete(validationResponse.isComplete)
		this.clientCallback(sbs)
	}

	getNewPuzzle = (callback:Function) => {
		this.clientCallback = callback
		this.service.getNewPuzzle(this.onNewPuzzle)
	}

	onNewPuzzle = (serviceResponse:SudokuServiceResponse) => {
		this.clientCallback(this.getSBSNewPuzzleResponse(serviceResponse))
	}

	getSBSNewPuzzleResponse = (serviceResponse:SudokuServiceResponse) =>{
		if (serviceResponse.isValid){
			let sbsr = new SBSResponse(true)
			sbsr.setPuzzle(serviceResponse.puzzle.puzzle)
			return(sbsr)
		}
		else{
			let sbsr = new SBSResponse(false)
			sbsr.setErrors(serviceResponse.errors)
			return(sbsr)
		}
	}
}

class SBSResponse{
	isValid:Boolean
	puzzle:any
	errors:Array<Number>
	hint:SudokuServiceBridgeHint
	isComplete:Boolean
	constructor(isValid:Boolean){
		this.isValid = isValid
		this.puzzle = null
		this.errors = []
		this.hint = null
		this.isComplete = false
	}
	setPuzzle = (p:any) => {
		this.puzzle = p
	}
	setErrors = (e:Array<Number>) => {
		this.errors = [...e]
	}
	setHint = (h:SudokuServiceBridgeHint) => {
		this.hint = h
	}
	setIsComplete = (b:Boolean) => {
		this.isComplete = b
	}
}
