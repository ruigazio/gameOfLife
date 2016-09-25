class Clock

	constructor: (dom, clock) ->
		@dom = dom
		@clock = clock
		@setTemplate()

	setTemplate: ->
		@domAtoms = {}

		@domAtoms.sampleSize = @dom.querySelector '#clock-sampleSize'
		@domAtoms.sampleSize.innerHTML = @clock.sampleSize

		for k, v of @clock.getTimes()
			tag = "#clock-#{k}"
			@domAtoms[k] = @dom.querySelector tag

		return null

	refresh: ->
		times = @clock.getTimes()
		fps = @clock.getFPS()
		for k, v of times
			@domAtoms[k].innerHTML = "#{v} (#{fps[k]})"

module.exports = Clock
