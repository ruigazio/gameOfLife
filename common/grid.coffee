Cell = require './cell.coffee'

class Grid
	constructor: (x, y, sparse) ->
		@x = x
		@y = y
		@cells = new Array y
		@sparseFactor = sparse

		i = 0
		while i < y
			@cells[i] = @createRow i
			i++
		return @

	createRow: (y) ->
		j = 0
		row = new Array @x
		while j < @x
			row[j] = new Cell j, y, false
			j++
		return row

	getCell: (x, y) ->
		@cells[y][x]

	setCell: (x, y, alive) ->
		@cells[y][x].alive = alive

	forEachCell: (f, args) ->
		args = args || []
		for row in @cells
			for cell in row
				f.apply cell, args
		return

	setBlankState: () ->
		@forEachCell Cell.prototype.reset, [false]

	setRandomState: () ->
		initialState = new Uint8Array @x * @y
		window.crypto.getRandomValues initialState
		i = 0
		for row in @cells
			for cell in row
				cell.reset initialState[i++] < @sparseFactor
		return

	addCol: () ->
		@x++
		for row, y in @cells
			row.push new Cell @x, y, false
		return

	delCol: () ->
		@x--
		for row in @cells
			row.pop()
		return

	addRow: () ->
		@y++; @cells.push @createRow @y

	delRow: () ->
		@y--; @cells.pop()

	fromJson: (list) ->
		@setBlankState()
		for coor in list
			@getCell coor[0], coor[1]
			.alive = true
		return

	toJson: () ->
		@cells.reduce (out, row) ->
			row.reduce (sameOut, cell) ->
				if cell.display.alive
					sameOut.push [cell.x, cell.y]
				return sameOut
			, out
		, []

module.exports = Grid
