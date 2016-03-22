Components = require './components.coffee'
C = Components.Units

ctrlBind = (c) ->
	manager = c.cManager

	manager.attachNoAction C.Info, 'backTick'
	.refresh = ->
		@setText c.life.historyStatus().back

	manager.attachAction C.Button, 'startBtn', c.startStop
	.refresh = ->
		@setText if c.timer then '\u25af' else '\u25b7'

	manager.attachNoAction C.Info, 'tickNo'
	.refresh = ->
		@setText 'tick #' + c.life.numTicks

	manager.attachNoAction C.Info, 'noRows'
	.refresh = ->
		@setText c.life.grid.y

	manager.attachNoAction C.Info, 'noCols'
	.refresh = ->
		@setText c.life.grid.x

	manager.attachAction C.Input, 'delay', c.delay, c.speedChange

	manager.attachAction C.Input, 'cellSize',  c.cellSize, c.cellSizeChange()

	manager.attachAction C.Check, 'showNeighbors',  c.showNeighbors, c.showNeighborsChange()

	manager.attachAction C.Grid, 'grid', c.life.grid, c.showNeighbors, c.cellAction

module.exports = ctrlBind
