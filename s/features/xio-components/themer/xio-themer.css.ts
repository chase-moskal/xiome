
import {css} from "../../../framework/component.js"
export default css`

* { outline: 1px solid #f004; }

:host {
	display: inline-block;
	width: 2em;
	height: 2em;
}

button {
	display: block;
	font-size: inherit;
	color: inherit;
	background: transparent;
	border: none;
	width: 100%;
	height: 100%;
}

slot {
	display: block;
	width: 100%;
	height: 100%;
}

slot svg, slot::slotted(svg) {
	display: block;
	width: 100%;
	height: 100%;
}

`
