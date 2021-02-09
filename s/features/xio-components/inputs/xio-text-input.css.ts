
import {css} from "../../../framework/component.js"
export default css`

:host {
	display: block;
	max-width: 32em;
	--pad: var(--xio-text-input-pad, 0.3em);
	--font: var(--xio-text-input-font, inherit);
	--color: var(--xio-text-input-color, inherit);
	--label-font: var(--xio-text-input-label-font, inherit);
	--label-color: var(--xio-text-input-label-color, inherit);
	--background: var(--xio-text-input-background, transparent);
	--valid-color: var(--xio-text-input-valid-color, #00ff8c);
	--invalid-color: var(--xio-text-input-invalid-color, #ff6100);
	--border: var(--xio-text-input-border, 1px solid);
	--border-radius: var(--xio-text-input-border-radius, 0.3em);
}

label {
	font: var(--label-font);
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
	position: relative;
	flex: 1 1 auto;
}

.inputbox svg {
	position: absolute;
	display: block;
	right: var(--pad);
	top: 0;
	bottom: 0;
	margin: auto;
	width: 1em;
	height: 1em;
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
	flex-direction: column;
	justify-content: center;
	flex: 0 0 auto;
	width: 12em;
	padding: var(--pad);
	list-style: none;
	color: var(--invalid-color);
}

.problems > li::before {
	content: "- ";
}

`
