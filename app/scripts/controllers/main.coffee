'use strict'

###*
 # @ngdoc function
 # @name yayApp.controller:MainCtrl
 # @description
 # # MainCtrl
 # Controller of the yayApp
###
angular.module 'lifeApp'
.controller 'MainCtrl', ["Life", "Grid", "Examples", "$scope", (Life, Grid, Examples, $scope) ->

	grid = new Grid(40,40,50)
	life = new Life( grid )

	life.loadPattern Examples.gosper

	actions =
		stop: ->
			if $scope.timer
				clearInterval $scope.timer
				$scope.timer = null
				return false
			return true

		start: ->
			$scope.timer = setInterval ->
				life.stepForward()
				$scope.$apply()
			, $scope.delay

		startStop: ->
			if $scope.stop()
				$scope.cellClickCheck()
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
		grid: grid
		life: life

	angular.extend $scope, actions, settings
	return
]
