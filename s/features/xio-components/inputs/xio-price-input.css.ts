
import {css} from "../../../framework/component.js"
export default css`

/* * { outline: 1px solid #f002; } */

:host {
	display: block;
	width: 100%;
	max-width: 48rem;
	--pad: var(--xio-price-input-pad, 0.2em);
	--font: var(--xio-price-input-font, inherit);
	--color: var(--xio-price-input-color, inherit);
	--font-size: var(--xio-price-input-button-font-size, 1.5rem);
	--svg-height: var(--xio-price-input-height, 1.2em);
	--label-font: var(--xio-price-input-label-font, inherit);
	--label-color: var(--xio-price-input-label-color, inherit);
	--pad-problems: var(--xio-price-input-problems-padding, 1.7em);
	--problems-font: var(--xio-price-input-problems-font, inherit);
	--problems-color: var(--xio-price-input-problems-color);
	--background: var(--xio-price-input-background, transparent);
	--valid-color: var(--xio-price-input-valid-color, #00ff8c);
	--invalid-color: var(--xio-price-input-invalid-color, #ff6100);
	--border: var(--xio-price-input-border, 1px solid);
	--border-radius: var(--xio-price-input-border-radius, 0.3em);
}

label {
	font: var(--label-font);
	color: var(--label-color);
}

slot {
	display: block;
	padding: 0 var(--pad);
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

.price__input__parent {
	display: flex;
	align-items: center;
	gap: 0.2rem;
	padding: var(--pad) calc(2 * var(--pad));
	border-radius: var(--border-radius);
	border: var(--border);
}

.focussed {
	outline: 2px solid cyan;
}

.symbol, .currency {
	font-size: 1rem;
	opacity: 0.4;
	user-select: none;
	text-transform: uppercase;
}

.currency {
	margin-left: 0.5em;
}

input {
	font: var(--font);
	font-size: 1.5rem;
	text-align: right;
	border: none;
	padding: 0;
	background: var(--background);
	color: var(--color);
	}

input:is(:focus, :active) {
	outline: 0;
}

input::-webkit-inner-spin-button {
	-webkit-appearance: none;
}

svg {
	width: var(--svg-height);
	height: var(--svg-height);
	pointer-events: none;
}

.price__input__parent[data-valid] svg {
	color: var(--valid-color);
}

.price__input__parent:not([data-valid]) svg {
	color: var(--invalid-color);
}

button {
	display: flex;
	font-size: var(--font-size);
	color: var(--color);
	opacity: 0.4;
	background: var(--background);
	cursor: pointer;
	border: none;
	user-select: none;
	transition: all 0.2s ease-in 0s;
}

button:is(:hover, :focus) {
	opacity: 1;
	outline: none;
}

.decrement:active {
	opacity: 0.6;
	transform: translateY(2px);
}

.increment:active {
	opacity: 0.6;
	transform: translateY(-2px);
}

ul {
	font: var(--problems-font);
	list-style-type: none;
	padding-left: var(--pad-problems);
	color: var(--problems-color, var(--invalid-color));
}

`