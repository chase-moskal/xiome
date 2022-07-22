
import {css} from "../../../framework/component.js"
export default css`

/* * { outline: 1px solid #f002; } */

:host {
	display: block;
	width: 100%;
	max-width: 48rem;
	--valid-color: var(--xio-price-input-valid-color, #00ff8c);
	--invalid-color: var(--xio-price-input-invalid-color, #ff6100);
}

.container {
	display: flex;
	flex-direction: column;
}

.inner__container{
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.price-input {
	display: flex;
	align-items: center;
	gap: 0.2rem;
	padding: 0.1rem 0.7rem;
	border-radius: 5px;
	border: 1px solid;
}

.focussed {
	outline: 2px solid cyan;
}

span {
	font-size: 1rem;
	opacity: 0.4;
	user-select: none;
	text-transform: uppercase;
}

input {
	text-align: right;
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

svg {
	width: 1.2em;
	height: 1.2em;
	pointer-events: none;
}

.container[data-valid] svg {
	color: var(--valid-color);
}

.container:not([data-valid]) svg {
	color: var(--invalid-color);
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
	user-select: none;
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
	color: var(--invalid-color);
}

`
