Grid = require '../../common/grid.coffee'
Life = require '../../common/life.coffee'
Controls = require './controls.coffee'
ctrlBind = require './controlBinding.coffee'

console.log "hello life"

grid = new Grid 40, 40, 50
life = new Life grid
console.log 'setting gosper'

ctrl = new Controls life
window.ctrl = ctrl

window.onload = ->
	ctrlBind ctrl
	ctrl.setGosper()

module.exports = ctrl
