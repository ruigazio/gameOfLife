'use strict';

/* Controllers */

var gameOfLifeApp = angular.module('gameOfLifeApp', []);

gameOfLifeApp.controller('LifeCtrl', function($scope) {
	
	var timer = null;

	var delay = function(){
		return 1000/$scope.speed;
	}

	var resetTimer = function(){
		$scope.stop();
		$scope.start();
	}


	$scope.stop = function(){
		clearInterval( timer );
	}

	$scope.start = function(){
		timer = setInterval( function(){
			$scope.life.stepForward();
			$scope.$apply();
		}, delay());
	}

	$scope.incSpeed = function(){
		$scope.speed++;
		resetTimer();
	}

	$scope.decSpeed = function(){
		if( $scope.speed > 1){
			$scope.speed--;
			resetTimer();
		}
	}

	$scope.stepForward = function(){
		if( timer )
			$scope.stop();
		$scope.life.stepForward();
	}

	$scope.stepBack = function(){
		if( timer )
			$scope.stop();
		$scope.life.stepBack();
	}

	$scope.cellClick = function(cell){
		if( timer )
			$scope.stop();
		$scope.life.cellClick(cell);
	}


	$scope.speed = 1;
	$scope.grid = new Grid(50,50,50);
	$scope.life = new Life( $scope.grid );
	$scope.life.step(Cell.prototype.getNextState);
});
