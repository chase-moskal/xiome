
import {css} from "../../../framework/component2/component2.js"
export default css`

:host {
	display: inline-block;
	--local-avatar-size: var(--avatar-size, 3em);
}

.container {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
}

xio-avatar {
	flex: 0 0 auto;
	margin-right: 0.4em;
	--avatar-size: var(--local-avatar-size);
}

.box {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	flex: 1;
	flex-basis: 8em;
}

.textfields {
	flex: 1 1 auto;
	margin-right: 1em;
}

.detail {
	margin-top: 0.5em;
}

.buttonbar {
	margin-top: 0.5em;
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

xio-text-input > span {
	opacity: 0.4;
	font-size: 0.7rem;
}

xio-text-input + xio-text-input {
	margin-top: 0.1em;
}

.detail {
	font-size: 0.7em;
	list-style: none;
}

.detail > li {
	margin-top: 0.2em;
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
	font-size: 0.6em;
	list-style: none;
	padding: 0;
	margin-top: 0.3rem;
}

.roles li {
	display: inline-block;
	border: 1px solid;
	border-radius: 1em;
	padding: 0.1em 0.3em;
	line-height: 0.8em;
}

`
