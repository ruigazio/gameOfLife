getCellClass = (alive) ->
	return "cell " + if alive then "alive" else "dead"

class Cell
	constructor: (cell, showNeighbors, action ) ->
		@dom = document.createElement "div"
		@dom.className = getCellClass cell.display.alive
		@display = cell.display
		@dom.innerHTML = if showNeighbors then @neighbors else ''
		@cell = cell
		@dom.onclick = => action @

	refreshWithNeighbors: () ->
		if ! (@cell.display == @display)
			@display = @cell.display
			@dom.className = getCellClass @display.alive
			@dom.innerHTML = @display.neighbors
		return

	refreshNoNeighbors: () ->
		if ! (@cell.display == @display)
			@display = @cell.display
			@dom.className = getCellClass @display.alive
		return

class Grid
	constructor: (dom, grid, showNeighbors, action) ->
		@dom = dom
		@grid = grid
		@cells = new Array grid.y
		@action = action
		@showNeighbors = showNeighbors
		@buildRows()

	buildRows: () ->
		@dom.innerHTML = ''
		if @showNeighbors
			Cell.prototype.refresh = Cell.prototype.refreshWithNeighbors
		else
			Cell.prototype.refresh = Cell.prototype.refreshNoNeighbors
		for row, y in @grid.cells
			rowDiv = document.createElement "div"
			rowDiv.className = "row"
			@dom.appendChild rowDiv
			@cells[y] = new Array row.length
			for cell, x in row
				rCell = new Cell cell, @showNeighbors, @action
				@cells[y][x] = rCell
				rowDiv.appendChild rCell.dom
		return @dom

	toggleNeighbors: (show) ->
		if show
			Cell.prototype.refresh = Cell.prototype.refreshWithNeighbors
			for row in @cells
				for cell in row
					cell.display = null
		else
			Cell.prototype.refresh = Cell.prototype.refreshNoNeighbors
			for row in @cells
				for cell in row
					cell.dom.innerHTML = ''
		@refresh()

	refresh: () ->
		for row, y in @grid.cells
			for cell, x in row
				rCell = @cells[y][x]
				rCell.refresh()
		return

module.exports = Grid
