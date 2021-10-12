
import {css} from "../../../framework/component.js"
export default css`

/* * { outline: 1px solid #f002; } */

:host {
	display: block;
	width: 100%;
	max-width: 48rem;
	--height: var(--xio-text-input-height, 5rem);
	--pad: var(--xio-text-input-pad, 0.2em);
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

:host([hidden]) {
	display: none;
}

label {
	font: var(--label-font);
	color: var(--label-color);
}

slot {
	display: block;
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

:host([textarea]) .flexy {
	flex-direction: column;
}

[part="inputbox"] {
	display: block;
	/* max-width: var(--width); */
	position: relative;
	flex: 1 1 auto;
}

:host([textarea]) [part="inputbox"] {
	flex: 1 1 auto;
	/* max-width: unset; */
}

[part="inputbox"] svg {
	position: absolute;
	display: block;
	top: var(--pad);
	right: var(--pad);
	width: 1.2em;
	height: 1.2em;
	pointer-events: none;
}

.container[data-valid] [part="inputbox"] svg {
	color: var(--valid-color);
}

.container:not([data-valid]) [part="inputbox"] svg {
	color: var(--invalid-color);
}

#textinput {
	min-width: 1em;
	width: 100%;
	font: var(--font);
	padding: var(--pad);
	padding-right: calc(1em + calc(2 * var(--pad)));
	margin: 0;
	color: var(--color);
	background: var(--background);
	border: var(--border);
	border-radius: var(--border-radius);
	text-overflow: ellipsis;
}

textarea {
	min-height: var(--height);
}

[part="problems"] {
	display: flex;
	font: var(--problems-font);
	padding: 0 calc(2 * var(--pad));
	flex-direction: column;
	justify-content: flex-start;
	flex: 1 1 auto;
	/* min-width: 12rem; */
	list-style: none;
	color: var(--problems-color, var(--invalid-color));
}

[part="problems"] > li {
	margin-top: 0.2em;
}

`
