
import {css} from "../../../framework/component.js"
export default css`

:host {
	display: inline-block;
	width: max-content;
	height: max-content;
	--_padding: var(--xio-button-padding, 0.2em 0.5em);
	--_background: var(--xio-button-background, transparent);
	--_border: var(--xio-button-border, 1px solid);
	--_border-radius: var(--xio-button-border-radius, 0);
	--_opacity: var(--xio-button-opacity, 0.7);
	--_hover-opacity: var(--xio-button-hover-opacity, 1);
	--_hover-color: var(--xio-button-hover-color, inherit);
	--_hover-background: var(--xio-button-hover-background, var(--_background));
	--_disabled-opacity: var(--xio-button-disabled-opacity, 0.2);
	--_disabled-border-style: var(--xio-button-disabled-border-style, dashed);
}

button {
	width: 100%;
	height: 100%;
	cursor: pointer;
	font: inherit;
	color: inherit;
	padding: var(--_padding);
	font-weight: bold;
	background: var(--_background);
	border: var(--_border);
	border-radius: var(--_border-radius);
	opacity: var(--_opacity);
}

button:not([disabled]):hover,
button:not([disabled]):focus {
	opacity: var(--_hover-opacity);
	color: var(--_hover-color);
	background: var(--_hover-background);
}

button[disabled] {
	cursor: default;
	opacity: var(--_disabled-opacity);
	border-style: var(--_disabled-border-style);
}

`
