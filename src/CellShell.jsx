	class CellShell extends React.Component {

		constructor(props){
			super(props)
		}

		render(){ 
			return this.getHTML()
		}

		getHTML = () => {
			return	<div class={"cell_shell " + this.getClasses(this.props.index)}>
						<input  
			  				id={"cell_" + this.props.index} 
			  				value={"" + this.props.value} 
			  				onChange={(ev) => this.props.onCellChange(ev, this.props.index)}
			  				type="text" maxlength="1" />
					</div>
		}

		getClasses = (index) => {
	 		let classes = []
	 		let colIndex = index % 9
	 		let rowIndex = Math.floor(index/9)
	 		let isInHintDisplay = this.props.hintMap.includes(Number(index))
	 		if(colIndex == 2 || colIndex == 5){	classes.push("column-right") }
	 		if(rowIndex == 2 || rowIndex == 5){ 	classes.push("row-bottom") }
	 		if(!this.props.isValid){ 			classes.push("invalidCell") }
	 		if(this.props.isHinted){ 			classes.push("hintedCell") }
	 		if(isInHintDisplay && !this.props.isHintRelated){
	 										classes.push("boxHiddenSinglePattern")
	 		}
	
	 		if(this.props.isHintRelated){ 		classes.push("hintRelatedCell") }
	 		return classes.join(" ")
		}
	}
