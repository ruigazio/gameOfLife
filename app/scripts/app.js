'use strict';

/**
 * @ngdoc overview
 * @name gameOfLifeApp
 * @description
 * # gameOfLifeApp
 *
 * Main module of the application.
 */
angular
  .module('gameOfLifeApp',[])
  .service('Life', function(){
      return window.LifeApp.Life;
  }).service('Grid', function(){
      return window.LifeApp.Grid;
  });
