Components = require './components.coffee'
Examples = require '../../common/examples.coffee'

setCellSize = (dom, size) ->
	dom.innerHTML = '.cell{ width:' + size + 'px;' +
		'height:' + size + 'px;' +
		'font-size:' + (size*0.6) + 'pt}'

Controls = (life) ->
	@timer = null
	@life = life
	@delay = 1
	@cellSize = 12
	@showNeighbors = false
	@cManager = new Components.Manager @
	return @

Controls.prototype =
	interrupt: (action) ->
		@stop()
		action()
		@refresh()

	stop: ->
		if @timer
			clearInterval @timer
			@timer = null

	startStop: ->
		if @timer
			clearInterval @timer
			@timer = null
		else
			@cellClickCheck()
			@timer = setInterval (@tick.bind @), @delay
		@refresh()

	stepForward: ->
		@cellClickCheck()
		@interrupt @life.stepForward.bind @life

	tick: ->
		@life.stepForward()
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
		dom = document.getElementById 'styleNeighbors'
		(e) =>
			@showNeighbors = !! e.target.checked
			@cManager.instances.grid.toggleNeighbors @showNeighbors

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
			@cManager.instances.grid.buildRows()

	addRow: -> @gridAction @life.grid.addRow
	delRow: -> @gridAction @life.grid.delRow
	addCol: -> @gridAction @life.grid.addCol
	delCol: -> @gridAction @life.grid.delCol


	setPulsar: -> @load Examples.pulsar
	setGosper: -> @load Examples.gosper
	setBlank: -> @lifeAction @life.setBlank
	setRandom: -> @lifeAction @life.setRandom

	refresh: ->
		@cManager.refresh()

module.exports = Controls
