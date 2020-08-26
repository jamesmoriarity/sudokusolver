/// <reference types="react" />
/// <reference types="react-dom" />

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
		return	<div class={c}>
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
		
 		if(this.isSideOfBox(colIndex))
 			classes.push("column-right")

 		if(this.isBottomOfBox(rowIndex))
 			classes.push("row-bottom")

 		if(this.isInvalidCell(this.getProps().index))
 			classes.push("invalidCell")

	 	return classes.join(" ")
	}

	isBottomOfBox = (rowIndex:number) => {
		return (rowIndex == 2 || rowIndex == 5)
	}

	isSideOfBox = (colIndex:number) =>{
		return (colIndex == 2 || colIndex == 5)
	}

	isInvalidCell = (index:Number) => {
		let b = this.renderClient.state.validationErrors.includes(index)
		return b
	}
}
