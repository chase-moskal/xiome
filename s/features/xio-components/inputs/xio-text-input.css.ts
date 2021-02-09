
import {css} from "../../../framework/component.js"
export default css`

/* * { outline: 1px solid #f002; } */

:host {
	display: block;
	max-width: 48em;
	--width: var(--xio-text-input-width, 24em);
	--pad: var(--xio-text-input-pad, 0.3em);
	--font: var(--xio-text-input-font, inherit);
	--color: var(--xio-text-input-color, inherit);
	--label-font: var(--xio-text-input-label-font, inherit);
	--label-color: var(--xio-text-input-label-color, inherit);
	--problems-font: var(--xio-text-input-problems-font, inherit);
	--problems-color: var(--xio-text-input-problems-color);
	--background: var(--xio-text-input-background, transparent);
	--valid-color: var(--xio-text-input-valid-color, #00ff8c);
	--invalid-color: var(--xio-text-input-invalid-color, #ff6100);
	--border: var(--xio-text-input-border, 1px solid);
	--border-radius: var(--xio-text-input-border-radius, 0.3em);
}

label {
	font: var(--label-font);
	color: var(--label-color);
}

slot {
	display: inline-block;
	padding: 0 var(--pad);
}

.flexy {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
}

.flexy > * {
	flex: 0 0 auto;
}

.inputbox {
	display: block;
	width: 100%;
	max-width: var(--width);
	position: relative;
	flex: 0 1 auto;
}

.inputbox svg {
	position: absolute;
	display: block;
	top: var(--pad);
	right: var(--pad);
	width: 1.2em;
	height: 1.2em;
	pointer-events: none;
}

.container[data-valid] .inputbox svg {
	color: var(--valid-color);
}

.container:not([data-valid]) .inputbox svg {
	color: var(--invalid-color);
}

#textinput {
	width: 100%;
	font: var(--font);
	padding: var(--pad);
	padding-right: calc(1em + calc(2 * var(--pad)));
	margin: 0;
	color: var(--color);
	background: var(--background);
	border: var(--border);
	border-radius: var(--border-radius);
}

textarea {
	min-height: 5em;
}

.problems {
	display: flex;
	font: var(--problems-font);
	padding: var(--pad) calc(4 * var(--pad));
	flex-direction: column;
	justify-content: flex-start;
	flex: 1 1 auto;
	min-width: 12em;
	list-style: none;
	color: var(--problems-color, var(--invalid-color));
}

.problems > li + li {
	margin-top: 0.2em;
}

`
