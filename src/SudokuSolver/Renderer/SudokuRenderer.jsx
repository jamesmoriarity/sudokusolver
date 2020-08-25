
console.log("SudokuRenderer1.jsx")

	class SudokuRenderer{
		constructor(){  // expects a RenderClient interface
			this.renderClient = null
			this.state = null
			this.renderRowIndex = 0
		}

		render = (renderClient) => {
			this.renderClient = renderClient
			this.state = renderClient.state
			return	<div id="_sudoku">
						<div>{this.state.greeting} Valid: {(this.state.isValid) ? "true" : "false"} Complete: {(this.state.isComplete)?"true":"false"}</div>
						<div id="grid">
							{this.getTableGrid()}
						</div>
						<div id="new_game_shell">
							<button id="new_game_btn" onClick={this.renderClient.newPuzzle}>New Puzzle</button>
						</div>
						<div id="reset"><button id="reset_btn" onClick={this.renderClient.reset}>Reset</button></div>
						<div id="validate"><button id="validate_btn" onClick={this.renderClient.validate}>Validate</button></div>
						<div id="get_hint"><button id="get_hint_btn" onClick={this.renderClient.getHint}>Get Hint</button></div>
					</div>
		}

		getTableGrid = () => {
			let puzzleGrid = this.buildPuzzleGridFromArray([...this.state.puzzleArray])
			let rows = puzzleGrid.map(this.renderTableRow)
			return <table cellpadding="0" cellspacing="0" border="0">{rows}</table>
		}

		renderTableRow = (row, rowIndex) => {
			this.renderRowIndex = rowIndex
			let cells = row.map(this.renderTableCell)
			return <tr>{cells}</tr>
		}

		renderTableCell = (value, cellIndex) =>{
			let fullIndex = (this.renderRowIndex * 9) + cellIndex
			let cell = <td><CellShell
					renderClient={this.renderClient}
	 				index={fullIndex}
	 				isHintRelated={this.isListItemHintRelated(fullIndex, value)}
	 				isHinted={this.isListItemHinted(fullIndex, value)}
	 				value={value}
	 				onCellChange={this.renderClient.onCellChange}/></td>

			return cell
		}

		isListItemHintRelated = (index, value) => {
			/*
				get the rows and columns in the same box as the hinted cell
				if they contain the hinted value, highlight the row/column from
				the cell with the hinted value through the box

				get box from cellindex
					let row = Math.floor(index/9)
					let column = index % 9
					let boxIndex = (row * 3) + column

				get rowIndexes from boxIndex
					let startRow = (Math.floor(boxIndex/3) * 3)
					return [startRow, startRow + 1, startRow + 2]

				get columnIndexes from boxIndex
					let startColumn = (boxIndex % 3) * 3
					return [startColumn, startColumn + 1, startColumn + 2]

				getCellIndexesFromRowByRowIndex
					let start = rowIndex * 9
					let end = start + 9
					let a = []
					for(let i = start; i < end; i++){
						a.push(String(i))
					}
					return a

				getCellIndexesFromColumnByColumnIndex
					let a = []
					for(let i = 0; i < 9; i++){
						a.push( (9 * i) + columnIndex )
					}
					return a
				*/
			let b = (this.state.hint == null) ? false : (this.state.hint.index != index && this.state.hint.value == value && String(this.state.hint.type).includes("Hidden Single") )
			return b
		}

		isListItemHinted = (index, value) => {
			let b = (this.state.hint == null) ? false : (this.state.hint.index == index)
			return b
		}



	 	buildPuzzleGridFromArray = (arr) => {
			let grid = []
			for(let i = 0; i < 9; i++){
				let row = []
				for(let j = 0; j < 9; j++){
					let arrIndex = (i * 9) + j
					row.push(arr[arrIndex])
				}
				grid.push(row)
			}
			return grid
		}

	}
