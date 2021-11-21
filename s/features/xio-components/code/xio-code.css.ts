
import {css} from "../../../framework/component.js"
export default css`

:host {
	display: inline-block;
	position: relative;
	--bg-color1: grey;
	--bg-color2: red;
	--bg-color3: blue;
	--border: 0.2em solid #bfff00;
	--padding: 3em;
	--border-radius: 0.2em;
}

:host::before {
	opacity: 0;
	content: "copied!";
	display: block;
	position: absolute;
	top: -0.5em;
	right: -0.5em;
	background: var(--bg-color1, var(--bg-color2, var(--bg-color3, #0a0c)));
	padding: 0 0.5em;
	border-radius: 1em;
	pointer-events: none;
	z-index: 1;
}

:host(:not([copied]))::before {
	transition: opacity 500ms ease;
}

:host([copied])::before {
	opacity: 1;
}

button {
	position: relative;
	display: flex;
	flex-direction: row;
	user-select: none;
	cursor: pointer;
	border: none;

	font-size: unset;
	color: unset;
	background: transparent;
}

button:hover .copy-icon {
	opacity: 0.9;
}

button:active .copy-icon {
	opacity: 1;
}

.content {
	display: flex;
	justify-content: row;
}

.copy-icon svg {
	width: 1em;
	height: 1em;
	
}

.copy-icon {
	opacity: 0.4;
	transition: opacity 100ms linear;
	border: var(--border);
	border-radius: var(--border-radius);
	padding: var(--padding);
}

`
