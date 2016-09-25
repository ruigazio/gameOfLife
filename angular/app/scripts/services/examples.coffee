'use strict'

###*
 # @ngdoc service
 # @name newlifeApp.examples
 # @description
 # # examples
 # Factory in the newlifeApp.
###
angular.module 'lifeApp'
.factory 'Examples', ->
	Examples =
		gosper: [
			[26, 3], [24, 4], [26, 4], [14, 5], [15, 5], [22, 5], [23, 5], [36, 5], [37, 5]
			, [13, 6], [17, 6], [22, 6], [23, 6], [36, 6], [37, 6], [2, 7], [3, 7], [12, 7]
			, [18, 7], [22, 7], [23, 7], [2, 8], [3, 8], [12, 8], [16, 8], [18, 8], [19, 8]
			, [24, 8], [26, 8], [12, 9], [18, 9], [26, 9], [13, 10], [17, 10], [14, 11], [15, 11]
		]
		pulsar: [
			[15,11],[16,11],[17,11],[21,11],[22,11],[23,11],[13,13],[18,13],[20,13],[25,13],[13,14],[18,14],[20,14],[25,14],[13,15],[18,15],[20,15],[25,15],[15,16],[16,16],[17,16],[21,16],[22,16],[23,16],[15,18],[16,18],[17,18],[21,18],[22,18],[23,18],[13,19],[18,19],[20,19],[25,19],[13,20],[18,20],[20,20],[25,20],[13,21],[18,21],[20,21],[25,21],[15,23],[16,23],[17,23],[21,23],[22,23],[23,23]
		]