
import {css} from "../../../framework/component.js"
export default css`

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

	Xtransform: scale(1);
	Xtransition: transform 200ms ease;
}

Xbutton:active {
	transform: scale(0.8);
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
