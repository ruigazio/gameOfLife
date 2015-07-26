'use strict';

/* Controllers */

var gameOfLifeApp = angular.module('gameOfLifeApp', []);

gameOfLifeApp.controller('LifeCtrl', function($scope) {
	

		

	$scope.stop = function(){
		if( $scope.timer ){
            clearInterval( $scope.timer );
            $scope.timer = null;
            return false;
        }
        return true;
    }

	$scope.start = function(){
        $scope.timer = setInterval( function(){
            $scope.life.stepForward();
            if( $scope.life.colonyStable() ){
                clearInterval( $scope.timer );
                $scope.timer = null;
            }
            $scope.$apply();
        }, 1000 / $scope.speed );
	}

	$scope.startStop = function(){
		if( $scope.stop() )
            $scope.start();
	}

	$scope.speedChange = function(){
		if( $scope.speed > 0){
            if( $scope.timer ){
                $scope.stop();
                $scope.start();
            }
		}
	}

	$scope.stepForward = function(){
        $scope.stop();
		$scope.life.stepForward();
	}

	$scope.stepBack = function(){
        $scope.stop();
		$scope.life.stepBack();
	}

	$scope.cellClick = function(cell){
        $scope.stop();
		$scope.life.cellClick(cell);
	}

    $scope.random = function(){
        $scope.stop();
		$scope.life.setRandomState();
	 	$scope.life.step( Cell.prototype.getNextState);
	}

    $scope.blank = function(){
        $scope.stop();
		$scope.life.setBlankState();
	}

    $scope.gosper = function(){
        $scope.stop();
		$scope.life.setGosper();
	}

	$scope.speed = 5;
	$scope.cellSize = 15;
	$scope.displayNeighbours = false;
	$scope.grid = new Grid(40,40,50);
	$scope.life = new Life( $scope.grid );
	$scope.life.step(Cell.prototype.getNextState);
});
