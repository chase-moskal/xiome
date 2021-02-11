
import {css} from "../../../framework/component.js"
export default css`

:host {
	display: block;
}

.cardplate > * {
	display: block;
}

.tags {
	list-style: none;
	font-size: 0.6em;
	cursor: default;
}

.tags > li {
	display: inline-block;
	margin: 0 0.1em;
	padding: 0 0.25em;
	border: 1px solid;
	border-radius: 1em;
}

[data-tag=staff] {
	color: var(--cobalt-tagcolor-staff, lime);
}

[data-tag=banned] {
	color: var(--cobalt-tagcolor-banned, red);
}

xio-text-input {
	--xio-text-input-pad: 0.1rem;
}

xio-text-input > span {
	display: none;
	opacity: 0.6;
	font-size: 0.6rem;
	margin-left: 0.2rem;
}

.textfields[data-readonly] xio-text-input::part(textinput) {
	border: 0;
	background: transparent;
}

.tagline::part(textinput) {
	opacity: 0.7;
	padding-left: 1em;
	font-size: 0.8em;
	font-style: italic;
}

.tagline.value-present::before,
.tagline.value-present::after {
	content: '"';
}

.detail {
	opacity: 0.5;
	font-size: 0.7em;
	list-style: none;
}

.buttonbar {
	margin-top: 1rem;
	text-align: right;
}

`
