'use strict'

###*
 # @ngdoc service
 # @name newlifeApp.cell
 # @description
 # # cell
 # Factory in the newlifeApp.
###
angular.module 'lifeApp'
.factory 'Cell', ->
	Display = (alive, neighbors) ->
		@neighbors = neighbors
		@alive = alive
		return @

	Cell = (x, y, alive) ->
		@display = new Display alive, 0
		@x = x
		@y = y
		@alive = alive
		@neighbors = 0
		@previous = []
		@following = []
		return @

	Cell.Display = Display

	Cell.prototype =
		reset: (alive) ->
			@alive = !!alive
			@previous = []
			@following = []
			@neighbors = 0
			@display.alive = !!alive
			@display.neighbors = 0

		resetPreStep: ->
			@alive = @display.alive
			@following = []

		stepBack: () ->
			@following.push @display
			@display = @previous.pop()

		stepForward: () ->
			@previous.push @display
			@display = @following.pop()

		invertState: () ->
			@display.alive = !@display.alive

		getNextState: () ->
			nextState = @alive && (@neighbors > 1 && @neighbors < 4) || ( !@alive && @neighbors == 3)

			@display = new Display @alive, @neighbors
			@alive = nextState
			@neighbors = 0

		liveOrDie: () ->

			if @previous.length > Cell.historyLimit
				@previous.shift()

			@previous.push @display
			@getNextState()

	return Cell
