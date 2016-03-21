Grid = require './gridRender.coffee'

Info = (dom) ->
	@dom = dom
	return @

Info.prototype =
	refresh: () ->

	setText: (text) ->
		@dom.innerHTML = text
		return

Button = (dom, action) ->
	Info.call @, dom
	@dom.onclick = action
	return @

Button.prototype = Object.create Info.prototype
Button.prototype.constructor = Button

Input = (dom, initial, action) ->
	Info.call @, dom
	@dom.onchange = action
	@dom.value = initial
	return @

Input.prototype = Object.create Info.prototype
Input.prototype.constructor = Input

Check = (dom, initial, action) ->
	Info.call @, dom
	@dom.onchange = action
	@dom.checked = initial
	return @

Check.prototype = Object.create Info.prototype
Check.prototype.constructor = Check

Manager = (ctrl) ->
	@ctrl = ctrl
	@instances = {}
	return @

Manager.prototype =
	attachNoAction: (ctor, idStr, args...) ->
		args.unshift document.getElementById idStr
		args.unshift null
		instance = new (ctor.bind.apply ctor, args)
		@instances[idStr] = instance
		return instance

	attachAction: (args..., action) ->
		args.push action.bind @ctrl
		@attachNoAction.apply @, args

	refresh: ->
		for id, ctrl of @instances
			ctrl.refresh()
		return

Units =
	Info: Info
	Input: Input
	Check: Check
	Button: Button
	Grid: Grid

module.exports = 
	Manager: Manager
	Units: Units
