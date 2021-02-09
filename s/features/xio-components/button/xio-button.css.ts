
import {css} from "../../../framework/component.js"
export default css`

:host {
	display: inline-block;
}

button {
	cursor: pointer;
	font: inherit;
	font-weight: bold;
	padding: var(--xio-button-padding, 0.2em 0.5em);
	color: inherit;
	background: var(--xio-button-background, transparent);
	border: 1px solid;
}

button:not([disabled]):hover,
button:not([disabled]):focus {
	color: var(--xio-button-hover-color, #000a);
	background: var(--xio-button-hover-background, #fff8);
}

button[disabled] {
	opacity: 0.25;
	cursor: default;
}

`
