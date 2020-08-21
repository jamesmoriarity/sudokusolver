class SudokuSolverUtilities{

		constructor(clientSolver){
			this.clientSolver = clientSolver
		}


	 	checkToRemoveHint = (cellIndex) => {
	 		if(this.clientSolver.state.hint != null && cellIndex == this.clientSolver.state.hint.index){
	 			this.clientSolver.setState({hint:null})
	 		}
	 	}

	 	checkToRemoveValidationError = (cellIndex) => {
	 		if(this.clientSolver.state.validationErrors.includes(cellIndex)){
				let updatedValErrors = this.clientSolver.state.validationErrors.filter(
					function(element){ return element != cellIndex }
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

	 	toString = (arr) => { 
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
}
