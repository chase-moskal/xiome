
import {css} from "../../../../framework/component.js"
export default css`

:host {
	display: block;
	width: 24em;
	max-width: 100%;
	border: 1px solid;
	border-radius: 5px;
}

.dacastbox {
	padding: 1em;
}

xio-text-input::part(problems) {
	width: 100%;
}

.buttonbar {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
}

.buttonbar > * {
	margin: 0.4em 0.2em;
}

.failed {
	color: red;
	display: flex;
}

.linked {
	display: flex;
}

.helpbox ul {
	padding-left: 1.5em;
}

`
