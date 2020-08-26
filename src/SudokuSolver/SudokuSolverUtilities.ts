console.log("SudokuSolverUtilities")

class ClientSolver{
	state:any
	setState = (o:Object) =>{this.state = o}
}

class SudokuSolverUtilities{
		clientSolver:ClientSolver
		constructor(clientSolver:ClientSolver){
			this.clientSolver = clientSolver
		}

		isValidEntry = (s:String) =>{
			if(s == ""){return true}
			let n:number = Number(s).valueOf()
			if(!isNaN(n) && n > 0 && n < 10){
				return true
			}
			return false
		}

		getPatternMap(){
			let hintBackgroundCells:Array<Number> = [0,1,3,4,5,6,7,8,6,15,16,24,33,42,51,60,78,8,17,26,35,53,62,71,80]
			let hintValueRelatedCells:Array<Number> = [2,69,44]
			return {"hintBackgroundCells": hintBackgroundCells, "hintValueRelatedCells": hintValueRelatedCells}
		}

	 	checkToRemoveRelatedHint = (cellIndex:Number) => {
	 		if(this.clientSolver.state.hint != null && cellIndex == this.clientSolver.state.hint.index){
				this.clientSolver.setState({hint:null, patternMap:null})
	 		}
	 	}

	 	checkToRemoveRelatedValidationError = (cellIndex:Number) => {
	 		if(this.clientSolver.state.validationErrors.includes(cellIndex)){
				let updatedValErrors = this.clientSolver.state.validationErrors.filter(
					function(element:Number){ return element != cellIndex }
				)
		 		this.clientSolver.setState({validationErrors:updatedValErrors})
	 		}

	 	}

	 	buildEmptyPuzzleArray = () => {
	 		let a = []
	 		for(let i = 0; i < 81; i++){
	 			a.push("")
	 		}
	 		return a
	 	}

	 	puzzleArrayToString = (arr:Array<String>) => {
	 		let len:Number = arr.length
	 		let str:String = ""
	 		for(let i = 0; i < len; i++){
	 			let val:String = String(arr[i])
	 			if(val == ""){val = "0"}
	 			str += String(val)
	 		}
	 		return str;
	 	}

	 	puzzleStringToArray = (s:String) => {
	 		let a:Array<String> = String(s).split("")
	 		let len:Number = a.length
	 		for(let i = 0; i < len; i++){
	 			let val:String = a[i]
	 			if(val == "0"){
	 				a[i] = ""
	 			}
	 		}
	 		return a
	 	}
}
