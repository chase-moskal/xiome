
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

p[data-field=tagline] {
	opacity: 0.7;
	font-size: 0.8em;
	font-style: italic;
}

xio-text-input::part(label) {
	opacity: 0.6;
	font-size: 0.7rem;
}

xio-text-input + xio-text-input {
	margin-top: 0.5em;
}

.detail {
	font-size: 0.7em;
	margin-top: 0.5em;
	list-style: none;
}

.detail > li > :first-child {
	font-weight: bold;
}

.detail code {
	font-size: 0.6em;
	padding: 0.2em;
	border-radius: 0.3em;
	word-break: break-all;
	background: #0002;
}

.roles {
	list-style: none;
	padding: 0;
	margin-top: 0.5em;
}

.roles li {
	display: inline-block;
	border: 1px solid;
	border-radius: 1em;
	padding: 0.1em 0.3em;
	line-height: 0.8em;
}

.buttonbar {
	margin-top: 1rem;
}

`
