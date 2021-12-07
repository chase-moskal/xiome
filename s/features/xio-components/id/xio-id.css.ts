
import {css} from "../../../framework/component.js"
export default css`

:host {
	display: inline-block;
	position: relative;
	width: 6em;
}

:host::before {
	opacity: 0;
	content: "copied!";
	display: block;
	position: absolute;
	top: -0.5em;
	right: -0.5em;
	background: #0a0c;
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
	font: inherit;
	color: inherit;
	background: transparent;
	width: 100%;
}

.container {
	position: relative;
	display: flex;
	flex-direction: row;
	user-select: none;
	cursor: pointer;
	border: none;
}

.content {
	display: flex;
	justify-content: row;
}

.label::after {
	content: ":";
	margin-right: 0.2em;
}

.id {
	opacity: 0.75;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.copy svg {
	width: 1em;
	height: 1em;
}

.copy {
	opacity: 0.4;
	transition: opacity 100ms linear;
}

.container:hover .copy {
	opacity: 0.9;
}

.container:active .copy {
	opacity: 1;
}

`
