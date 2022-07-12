
import {css} from "../../../framework/component.js"
export default css`

/* * { outline: 1px solid #f002; } */

:host {
	display: block;
	width: 100%;
	max-width: 48rem;
}

.price-input {
	gap: 0.2rem;
	padding: 0.1rem 0.7rem;
	border-radius: 5px;
	border: 1px solid;
}

span {
	font-size: 1rem;
	opacity: 0.4;
	user-select: none;
	text-transform: uppercase;
}

div {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

input {
	text-align: center;
	font-size: 1.5rem;
	border: none;
	background: transparent;
	padding: 0;
	color: inherit;
	}

input:is(:focus, :active) {
	outline: 0;
}

input::-webkit-inner-spin-button {
	-webkit-appearance: none;
}

button {
	font-size: 2.5rem;
	color: inherit;
	opacity: 0.4;
	background: transparent;
	cursor: pointer;
	transition: all 0.2s ease-in 0s;
	padding: 0 0.2rem;
	border: none;
}

button:is(:hover, :focus) {
	opacity: 1;
	outline: none;
}

button:active {
	opacity: 0.6;
}

ul {
	list-style-type: none;
	color: red;
}

`
