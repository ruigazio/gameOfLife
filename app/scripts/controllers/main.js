'use strict';

/**
 * @ngdoc function
 * @name gameOfLifeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the gameOfLifeApp
 */
angular.module('gameOfLifeApp')
.controller('MainCtrl', ["Life", "Grid", "$scope", 
    function (Life, Grid, $scope) {

	var grid = new Grid(40,40,50);
	var life = new Life( grid );

    var actions = {
    stop: function(){
		if( $scope.timer ){
			clearInterval( $scope.timer );
			$scope.timer = null;
			return false;
		}
		return true;
	},

	start: function(){
		$scope.timer = setInterval( function(){
			life.stepForward();
			if( life.colonyStable() ){
				clearInterval( $scope.timer );
				$scope.timer = null;
			}
			$scope.$apply();
		}, 1000 / $scope.speed );
	},

	startStop: function(){
		if( $scope.stop() )
			$scope.start();
	},

	speedChange: function(){
		if( $scope.speed > 0){
			if( $scope.timer ){
				$scope.stop();
				$scope.start();
			}
		}
	},

	stepForward: function(){
		$scope.stop();
		life.stepForward();
	},

	stepBack: function(){
		$scope.stop();
		life.stepBack();
	},

	cellClick: function(cell){
		$scope.stop();
		life.cellClick(cell);
	},

	random: function(){
		$scope.stop();
		life.setRandomState();
	 	life.preStep();
	},

	blank: function(){
		$scope.stop();
		life.setBlankState();
	},

	gosper: function(){
		$scope.stop();
		life.setGosper();
	}
    };

    var settings = {
	    speed: 5
	    , cellSize: 15
	    , displayNeighbours: false
	    , grid: grid
	    , life: life
    };

    angular.extend($scope, actions, settings);

	life.preStep();

  }]);
