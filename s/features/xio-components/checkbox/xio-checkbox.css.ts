
import {css} from "../../../framework/component.js"
export default css`

* {box-sizing: border-box;}

:host {
	display: inline-block;
	vertical-align: middle;
	color: white;
}

:host([disabled]) {
	opacity: 0.25;
}

button {
	display: inline-block;
	border: unset;
	color: unset;
	background: unset;
}

button {
	position: relative;
	width: 1.5em;
	height: 1.5em;
	background: #3338;
	box-shadow: inset 1px 2px 3px #000a;
	border-radius: 0.5em;
	border: 1px solid #fff4;
}

button[data-mode="ready"] {
	cursor: pointer;
}

button[data-mode="ready"]:hover,
button[data-mode="ready"]:focus {
	background: #5558;
	border: 1px solid #fff8;
}

button > span {
	display: inline-block;
}

button svg {
	width: 100%;
	height: 100%;
}

button .error {
	display: inline-block;
	position: absolute;
	top: 80%;
	left: 0;
	width: max-content;
	max-width: 16em;
	color: red;
	background: #200a;
	text-shadow: 1px 2px 3px #0008;
	text-align: left;
	padding: 0.2em 0.5em;
	border-radius: 0.5em;
	pointer-events: none;
}

button[data-mode="loading"] svg,
button[data-mode="error"] svg {
	padding: 10%;
}

button[data-mode="error"] svg {
	color: red;
	animation: fade 1s ease infinite alternate;
}

button[data-mode="loading"] svg {
	animation:
		spin 10s linear infinite,
		fade 500ms ease infinite alternate;
}

@keyframes spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

@keyframes fade {
	from { opacity: 1.0; }
	to { opacity: 0.5; }
}

`
