Manager = require './renderer/manager.coffee'
Examples = require './life/examples.coffee'
Clock = require './life/clock.coffee'

setCellSize = (dom, size) ->
	dom.innerHTML = '.cell{ width:' + size + 'px;' +
		'height:' + size + 'px;' +
		'font-size:' + (size*0.6) + 'pt}'

class Controls
	constructor: (life) ->
		@timer = null
		@life = life
		@delay = 1
		@cellSize = 12
		@showNeighbors = false
		@clock = new Clock 50
		@rManager = new Manager @

	interrupt: (action) ->
		@stop()
		action()
		@refresh()

	stop: ->
		if @timer
			clearInterval @timer
			setTimeout @clock.stop.bind @clock
			@timer = null
		else
			true

	startStop: ->
		if @stop()
			@cellClickCheck()
			@timer = setInterval (@tick.bind @), @delay
			@clock.start()
		@refresh()

	stepForward: ->
		@cellClickCheck()
		@interrupt @life.stepForward.bind @life

	tick: ->
		@life.stepForward()
		@clock.mark()
		@refresh()

	stepBack: ->
		@cellClickCheck()
		@interrupt @life.stepBack.bind @life

	speedChange: (e) ->
		@delay = Number.parseInt e.target.value
		if @timer
			clearInterval @timer
			@timer = setInterval (@tick.bind @), @delay

	showNeighborsChange: ->
		(e) =>
			@showNeighbors = !! e.target.checked
			@rManager.instances.grid.toggleNeighbors @showNeighbors

	cellSizeChange: ->
		dom = document.getElementById 'styleCell'
		setCellSize dom, @cellSize
		(e) =>
			@cellSize = Number.parseInt e.target.value
			setCellSize dom, @cellSize

	cellAction: (rCell) ->
		@stop()
		@cellClicked = true
		rCell.cell.invertState()
		@life.resetPreStep()
		@refresh()

	cellClickCheck: ->
		if @cellClicked
			@cellClicked = false
			@life.resetPreStep()

	load: (pattern) ->
		@interrupt @life.loadPattern.bind @life, pattern

	lifeAction: (action) ->
		@interrupt action.bind @life

	gridAction: (action) ->
		@interrupt =>
			action.call @life.grid
			@rManager.instances.grid.buildRows()

	addRow: -> @gridAction @life.grid.addRow
	delRow: -> @gridAction @life.grid.delRow
	addCol: -> @gridAction @life.grid.addCol
	delCol: -> @gridAction @life.grid.delCol


	setPulsar: -> @load Examples.pulsar
	setGosper: -> @load Examples.gosper
	setBlank: -> @lifeAction @life.setBlank
	setRandom: -> @lifeAction @life.setRandom

	refresh: ->
		@rManager.refresh()

module.exports = Controls
