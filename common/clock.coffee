class Clock
	constructor: ( sampleSize ) ->
		@frame = 0
		@worst = 0
		@marker = performance.now()
		@avgSample = new Uint16Array( sampleSize )
		@sampleIdx = 0
		@sampleSize = sampleSize
		@average = 0
		@avgTotal = 0
		@cycleComplete = false

	stop: ->
		@cycleComplete = false
		@worst = 0
		@avgSample.fill 0
		@avgTotal = 0
		@marker = 0
		@sampleIdx = 0
		@average = 0

	start: ->
		@marker = performance.now()

	mark: ->
		previous = @marker
		@marker = performance.now()
		@frame = Math.floor @marker - previous

		frameSlot = @avgSample[ @sampleIdx ]

		@avgSample[ @sampleIdx ] = @frame
		@avgTotal += @frame - frameSlot

		if @cycleComplete
			@average = Math.floor @avgTotal / @sampleSize

		if @frame > @worst
			@worst = @frame

		@sampleIdx++
		(@sampleIdx %= @sampleSize) || (@worst = 0 ; @cycleComplete = true)		#eslint-disable-line

	getFPS: ->
		@functor (time) ->
			Math.floor 1 / (time/1000)

	getTimes: ->
		@functor (time) -> (time)

	functor: (f) ->
		frame: f @frame
		worst: f @worst
		average: f @average

module.exports = Clock
