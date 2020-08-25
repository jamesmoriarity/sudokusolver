console.log("CellShell")
	class CellShell extends React.Component {

		constructor(props){
			super(props)
			this.renderClient = props.renderClient
		}

		render(){
			return this.getHTML()
		}

		getHTML = () => {
			return	<div class={"cell_shell " + this.getClasses()}>
						<input
			  				id={"cell_" + this.props.index}
			  				value={"" + this.props.value}
			  				onChange={(ev) => this.props.onCellChange(ev, this.props.index)}
			  				type="text" maxlength="1" />
					</div>
		}

		getClasses = () => {
	 		let classes = []
	 		let colIndex = this.props.index % 9
	 		let rowIndex = Math.floor(this.props.index/9)
	 		if(this.props.isHinted){
	 			classes.push("hintedCell")
	 		}
	 		else{
	 			if(this.renderClient.state.patternMap &&  this.renderClient.state.patternMap["hintBackgroundCells"]){
			 		let isHintBackgroundCell = this.renderClient.state.patternMap["hintBackgroundCells"].includes(this.props.index)
			 		if(isHintBackgroundCell){classes.push("hintBackgroundCell")}
			 		else{
			 			let isHintValueRelatedCell = this.renderClient.state.patternMap["hintValueRelatedCells"].includes(this.props.index)
			 			if(isHintValueRelatedCell){classes.push("hintValueRelatedCell")}
			 		}
	 			}

		 	}
	 		if(colIndex == 2 || colIndex == 5)
	 			classes.push("column-right")
	 		if(rowIndex == 2 || rowIndex == 5)
	 			classes.push("row-bottom")
	 		if(!this.isListItemValid(this.props.index))
	 			classes.push("invalidCell")
		 	return classes.join(" ")
		}

		isListItemValid = (index) => {
			let b = !this.renderClient.state.validationErrors.includes(index)
			return b
		}
	}
