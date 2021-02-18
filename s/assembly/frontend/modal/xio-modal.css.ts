
import {css} from "../../../framework/component.js"
export default css`

*:focus {
	outline: var(--focus-outline);
}

:host {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	display: block;
}

[part=blanket] {
	z-index: 101;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: block;
	background: #0008;
	backdrop-filter: blur(10px);
}

[part=plate] {
	z-index: 102;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;

	width: 96%;
	max-width: 32em;
	min-height: 1em;
	margin: 2em auto;

	background: white;
	color: #666;
}

[part=content]:focus {
	outline: unset;
}

[data-confirm] {
	padding: 1em;
}

[data-buttons] {
	margin-top: 1em;
	text-align: right;
}

[part=button-yes] {
	color: green;
	--xio-button-hover-color: white;
	--xio-button-hover-background: green;
}

[part=button-no] {
	--xio-button-hover-color: white;
	--xio-button-hover-background: #666;
}

`
