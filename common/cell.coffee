class Display
	constructor: (alive, neighbors) ->
		@neighbors = neighbors
		@alive = alive
		return @

class Cell

	@Display = Display

	constructor: (x, y, alive) ->
		@display = new Display alive, 0
		@x = x
		@y = y
		@alive = alive
		@neighbors = 0
		@previous = []
		@following = []
		return @

	reset: (alive) ->
		@alive = !!alive
		@previous = []
		@following = []
		@neighbors = 0
		@display = new Display @alive, 0

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
		@display = new Display !@display.alive, @display.neighbors

	getNextState: () ->
		nextState = @alive && (@neighbors > 1 && @neighbors < 4) || ( !@alive && @neighbors == 3)

		unless @display.alive == @alive && @display.neighbors == @neighbors
			@display = new Display @alive, @neighbors

		@alive = nextState
		@neighbors = 0

	liveOrDie: () ->

		if @previous.length > Cell.historyLimit
			@previous.shift()

		@previous.push @display
		@getNextState()

module.exports = Cell
