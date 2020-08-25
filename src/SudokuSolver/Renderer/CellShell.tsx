
/// <reference types="react" />
/// <reference types="react-dom" />

console.log("CellShell tsx")


	class CellShell extends React.Component {
		renderClient:SudokuSolver
		constructor(props:any){
			super(props)
			this.renderClient = props.renderClient
		}

		getProps = () =>{
			return this.props as any
		}

		render(){
			return this.getHTML()
		}

		getHTML = () => {
			let c = "cell_shell " + this.getClasses()
			return	<div
								class={c}>
						<input
			  				id={"cell_" + this.getProps().index}
			  				value={"" + this.getProps().value}
			  				onChange={(ev) => this.getProps().onCellChange(ev, this.getProps().index)}
			  				type="text"
								maxlength="1" />
					</div>
		}

		getClasses = () => {
	 		let classes = []
	 		let colIndex = this.getProps().index % 9
	 		let rowIndex = Math.floor(this.getProps().index/9)
	 		if(this.getProps().isHinted){
	 			classes.push("hintedCell")
	 		}
	 		else{
	 			if(this.renderClient.state.patternMap &&  this.renderClient.state.patternMap["hintBackgroundCells"]){
			 		let isHintBackgroundCell = this.renderClient.state.patternMap["hintBackgroundCells"].includes(this.getProps().index)
			 		if(isHintBackgroundCell){classes.push("hintBackgroundCell")}
			 		else{
			 			let isHintValueRelatedCell = this.renderClient.state.patternMap["hintValueRelatedCells"].includes(this.getProps().index)
			 			if(isHintValueRelatedCell){classes.push("hintValueRelatedCell")}
			 		}
	 			}

		 	}
	 		if(colIndex == 2 || colIndex == 5)
	 			classes.push("column-right")
	 		if(rowIndex == 2 || rowIndex == 5)
	 			classes.push("row-bottom")
	 		if(!this.isListItemValid(this.getProps().index))
	 			classes.push("invalidCell")
		 	return classes.join(" ")
		}

		isListItemValid = (index:Number) => {
			let b = !this.renderClient.state.validationErrors.includes(index)
			return b
		}
	}
