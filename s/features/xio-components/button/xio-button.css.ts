
import {css} from "../../../framework/component2/component2.js"
export default css`

:host {
	display: inline-block;
}

button {
	cursor: pointer;
	font: inherit;
	font-weight: bold;
	color: inherit;
	padding: var(--xio-button-padding, 0.2em 0.5em);
	background: var(--xio-button-background, transparent);
	border: var(--xio-button-border, 1px solid);
	border-radius: var(--xio-button-border-radius, 0);
}

button:not([disabled]):hover,
button:not([disabled]):focus {
	color: var(--xio-button-hover-color, #000a);
	background: var(--xio-button-hover-background, #fff8);
}

button[disabled] {
	cursor: default;
	opacity: var(--xio-button-disabled-opacity, 0.25);
	border-style: var(--xio-button-disabled-border-style, dashed);
}

`
