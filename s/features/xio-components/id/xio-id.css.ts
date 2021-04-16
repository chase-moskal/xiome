
import {css} from "../../../framework/component.js"
export default css`

button {
	font-size: unset;
	color: unset;
	background: transparent;
}

.container {
	position: relative;
	display: flex;
	flex-direction: column;
	user-select: none;
	cursor: pointer;
	border: none;
	background: #0002;
	border-radius: 0.2em;
	overflow: hidden;
}

:host {
	display: inline-block;
	position: relative;
}

:host::before {
	opacity: 0;
	content: "copied!";
	display: block;
	position: absolute;
	top: -0.5em;
	right: -0.5em;
	background: #00aa0044;
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

.content {
	display: flex;
	justify-content: row;
	background: #0002;
}

.label,
.content {
	padding: 0.2em 0.5em;
}

.id {
	opacity: 0.75;
	max-width: 6em;
	overflow: hidden;
	text-overflow: ellipsis;
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
