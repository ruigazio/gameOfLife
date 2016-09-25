class Info
	constructor: (dom) ->
		@dom = dom

	refresh: () ->

	setText: (text) ->
		@dom.innerHTML = text
		return

class Button extends Info
	constructor: (dom, action) ->
		super dom
		@dom.onclick = action

class Input extends Info
	constructor: (dom, initial, action) ->
		super dom
		@dom.value = initial
		@dom.onchange = action

class Check extends Info
	constructor: (dom, initial, action) ->
		super dom
		@dom.onchange = action
		@dom.checked = initial

module.exports =
	Info: Info
	Input: Input
	Check: Check
	Button: Button
