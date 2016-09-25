C = require './renderer/smallComponents.coffee'
Grid = require './renderer/grid.coffee'
Clock = require './renderer/clock.coffee'

ctrlBind = (ctrl) ->
	manager = ctrl.rManager
	c = ctrl

	manager.attach C.Info, 'backTick'
	.refresh = ->
		@setText c.life.historyStatus().back

	manager.attachCtrlAction C.Button, 'startBtn', c.startStop
	.refresh = ->
		@setText if c.timer then '\u25af' else '\u25b7'

	manager.attach C.Info, 'tickNo'
	.refresh = ->
		@setText 'tick #' + c.life.numTicks

	manager.attach C.Info, 'noRows'
	.refresh = ->
		@setText c.life.grid.y

	manager.attach C.Info, 'noCols'
	.refresh = ->
		@setText c.life.grid.x

	manager.attach Clock, 'clock', c.clock

	manager.attach C.Input, 'cellSize',  c.cellSize, c.cellSizeChange()

	manager.attach C.Check, 'showNeighbors',  c.showNeighbors, c.showNeighborsChange()

	manager.attachCtrlAction C.Input, 'delay', c.delay, c.speedChange

	manager.attachCtrlAction Grid, 'grid', c.life.grid, c.showNeighbors, c.cellAction



module.exports = ctrlBind
