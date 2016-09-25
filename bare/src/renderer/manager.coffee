class Manager
	constructor: (ctrl) ->
		@ctrl = ctrl
		@instances = {}

	attach: (ctor, idStr, args...) ->
		args.unshift document.getElementById idStr
		args.unshift null
		instance = new (ctor.bind.apply ctor, args)
		@instances[idStr] = instance
		return instance

	attachCtrlAction: (args..., action) ->
		args.push action.bind @ctrl
		@attach.apply @, args

	refresh: ->
		for id, ctrl of @instances
			ctrl.refresh()
		return

	getCtrl: ->
		@ctrl

module.exports = Manager
