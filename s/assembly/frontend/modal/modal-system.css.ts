
import {css} from "../../../framework/component.js"
export default css`

*:focus {
	outline: var(--focus-outline);
}

[data-modal-system] {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	display: block;
}

[data-modal-system] [data-blanket] {
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

[data-modal-system] [data-plate] {
	z-index: 102;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;

	width: 96%;
	max-width: 32em;
	min-height: 1em;
	margin: 2em auto;

	background: linear-gradient(to bottom right, #fff, #ccc);
	color: #444;
}

[data-modal-system] [data-content]:focus {
	outline: unset;
}

[data-modal-system] [data-confirm] {
	padding: 1em;
}

[data-modal-system] [data-buttons] {
	margin-top: 1em;
	text-align: right;
}

[data-modal-system] [data-button] {
	--xio-button-hover-color: white;
	--xio-button-hover-background: #666;
}

[data-modal-system] [data-vibe=positive] {
	color: green;
	--xio-button-hover-color: white;
	--xio-button-hover-background: green;
}

[data-modal-system] [data-vibe=negative] {
	color: #a00;
	--xio-button-hover-color: white;
	--xio-button-hover-background: #a00;
}

`
