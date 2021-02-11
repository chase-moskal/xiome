
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

p[data-field="tagline"] {
	opacity: 0.7;
	font-size: 0.8em;
	font-style: italic;
}

xio-text-input > span {
	opacity: 0.6;
	font-size: 0.7rem;
}

.detail {
	opacity: 0.5;
	font-size: 0.7em;
	margin-top: 0.5em;
	list-style: none;
}

.buttonbar {
	margin-top: 1rem;
}

`
