Grid = require './life/grid.coffee'
Life = require './life/life.coffee'
Controls = require './controls.coffee'
Manager = require './renderer/manager.coffee'
ctrlBind = require './controlBinding.coffee'

console.log "hello life"

grid = new Grid 40, 40, 50
life = new Life grid

ctrl = new Controls life

window.ctrl = ctrl

window.onload = ->
	ctrlBind ctrl
	ctrl.setGosper()
	console.log 'setting gosper'

module.exports = ctrl
