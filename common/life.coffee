Cell = require './cell.coffee'

class Life
	@historyLimit = 100
	Cell.historyLimit = Life.historyLimit
	constructor: (grid) ->
		@grid = grid
		@numTicks = 0
		return @

	historyStatus: () ->
		cell = @grid.getCell 0, 0
		back: cell.previous.length
		forward: cell.following.length

	stepBack: () ->
		if @historyStatus().back
			@grid.forEachCell Cell.prototype.stepBack
			@numTicks--
		
	resetPreStep: () ->
		@grid.forEachCell Cell.prototype.resetPreStep
		@preStep()

	preStep: () ->
		@step Cell.prototype.getNextState

	stepForward: () ->
		if @historyStatus().forward
			@grid.forEachCell Cell.prototype.stepForward
		else
			@step Cell.prototype.liveOrDie
		@numTicks++

	step: (cellAction) ->

		countAndSetRow = (state, cell) ->
			above = state.aboveRow.shift()
			aboveLeft = state.aboveLeft
			left = state.left

			state.aboveLeft = above
			state.left = cell

			aboveLeft.neighbors += cell.alive + above.alive + left.alive
			left.neighbors += aboveLeft.alive + above.alive
			above.neighbors += left.alive + aboveLeft.alive
			cell.neighbors += aboveLeft.alive

			cellAction.call aboveLeft

			return state
		

		countAndSetCells = (previousRowOriginal, rowOriginal) ->
			row = rowOriginal.slice()
			previousRow = previousRowOriginal.slice()

			initialState =
				aboveLeft: previousRow.shift()
				aboveRow: previousRow
				left: row.shift()
			
			finalState = row.reduce countAndSetRow, initialState

			finalState.aboveLeft.neighbors += finalState.left.alive
			finalState.left.neighbors += finalState.aboveLeft.alive
			cellAction.call finalState.aboveLeft

			return rowOriginal
		
		cells = @grid.cells.slice()
		firstRow = cells.shift()
		lastRowOrig = cells.reduce countAndSetCells, firstRow

		lastRow = lastRowOrig.slice()
		first = lastRow.shift()

		lastCell = lastRow.reduce (left, right) ->
			right.neighbors += left.alive
			left.neighbors += right.alive
			cellAction.call left
			return right
		, first

		cellAction.call lastCell

	setPattern: (getPattern) ->
		@numTicks = 0
		getPattern()
		@preStep()

	setRandom: () -> @setPattern @grid.setRandomState.bind @grid
	setBlank: () -> @setPattern @grid.setBlankState.bind @grid
	loadPattern: (pattern) -> @setPattern @grid.fromJson.bind @grid, pattern

module.exports = Life
