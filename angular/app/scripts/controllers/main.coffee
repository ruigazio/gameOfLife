'use strict'

###*
 # @ngdoc function
 # @name yayApp.controller:MainCtrl
 # @description
 # # MainCtrl
 # Controller of the yayApp
###
angular.module 'lifeApp'
.controller 'MainCtrl', ["Life", "Grid", "Clock","Examples", "$scope", (Life, Grid, Clock, Examples, $scope) ->

	grid  = new Grid 40, 40, 50
	life  = new Life grid
	clock = new Clock 50

	$scope.times = clock.getTimes()
	$scope.fps = clock.getFPS()

	life.loadPattern Examples.gosper

	actions =
		stop: ->
			if $scope.timer
				clearInterval $scope.timer
				$scope.timer = null
				clock.stop()
				return false
			return true

		start: ->
			$scope.timer = setInterval ->
				clock.mark()
				$scope.times = clock.getTimes()
				$scope.fps = clock.getFPS()
				life.stepForward()
				$scope.$apply()
			, $scope.settings.delay

		startStop: ->
			if $scope.stop()
				$scope.cellClickCheck()
				clock.start()
				$scope.start()

		speedChange: ->
			if $scope.timer
				$scope.stop()
				$scope.start()

		stepForward: ->
			$scope.stop()
			$scope.cellClickCheck()
			life.stepForward()

		stepBack: ->
			$scope.stop()
			$scope.cellClickCheck()
			life.stepBack()

		cellClickCheck: ->
			if $scope.cellClicked
				$scope.cellClicked = false
				life.resetPreStep()

		cellClick: (cell) ->
			$scope.stop()
			$scope.cellClicked = true
			cell.invertState()
			life.resetPreStep()

		random: ->
			$scope.stop()
			life.setRandom()

		blank: ->
			$scope.stop()
			life.setBlank()

		gosper: ->
			$scope.stop()
			life.loadPattern Examples.gosper

		pulsar: ->
			$scope.stop()
			life.loadPattern Examples.pulsar

	settings =
		delay: 1
		cellSize: 12
		displayNeighbors: false
	
	lifeObjs =
		grid: grid
		life: life
		clock: clock

	angular.extend $scope, actions, lifeObjs, settings: settings
	return
]
