getCellClass = (alive) ->
	return "cell " + if alive then "alive" else "dead"

Cell = (cell, showNeighbors, action ) ->
	@dom = document.createElement "div"
	@dom.className = getCellClass cell.display.alive
	@alive = cell.display.alive
	@neighbors = cell.display.neighbors
	@dom.innerHTML = if showNeighbors then @neighbors else ''
	@cell = cell
	@dom.onclick = => action @
	return @

Cell.prototype =
	refreshWithNeighbors: () ->
		if ! (@cell.display.alive == @alive && @cell.display.neighbors == @neighbors)
			@alive = @cell.display.alive
			@neighbors = @cell.display.neighbors
			@dom.className = getCellClass @alive
			@dom.innerHTML = @neighbors
		return

	refreshNoNeighbors: () ->
		if ! (@cell.display.alive == @alive)
			@alive = @cell.display.alive
			@dom.className = getCellClass @alive
		return

Grid = (dom, grid, showNeighbors, action) ->
	@dom = dom
	@grid = grid
	@cells = new Array grid.y
	@action = action
	@showNeighbors = showNeighbors
	@buildRows()
	return @

Grid.prototype =
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
					cell.neighbors = null
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
