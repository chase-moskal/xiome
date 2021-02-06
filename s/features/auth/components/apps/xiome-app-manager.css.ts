
import {css} from "../../../../framework/component.js"
export default css`

code {
	display: inline-block;
	font-size: 0.7em;
	padding: 0.2em;
	border-radius: 0.3em;
	background: #0002;
	overflow-wrap: anywhere;
	word-break: break-all;
}

code.id {
	opacity: 0.7;
	font-size: 0.5em;
}

.codeblock {
	display: block;
}

.xiome-config { color: #fff4; }
.xiome-config [data-syntax=tag] { color: deepskyblue; }
.xiome-config [data-syntax=attr] { color: skyblue; }
.xiome-config [data-syntax=data] { color: #aaffa0; }
.xiome-config [data-syntax=indent] {
	display: block; margin-left: 1em;
}

.applist .app {
	padding: 0.4em 1rem;
	margin: 0 var(--xmargin, 0);
	margin-top: 0.5em;
	border: 1px solid;
}

.applist .app + .app {
	margin-top: 0.5em;
}

.app-details {
	margin-left: 1em;
}

.app-creator {
	margin: 0 var(--xmargin, 0);
	padding: 0.4em 1rem;
}

.token-manager ul,
.token-manager ol {
	list-style: none;
}

.token-list {
	margin: 1.5em 0;
}

.token-list > li {
	border: 1px solid #fff1;
	padding: 0.5em;
	border-radius: 0.5em;
}

.token-list > li + li{
	margin-top: 1.5em;
}

.token-list > li > * + * {
	margin-top: 0.2em;
}

.token-details {
	list-style: none;
	margin-left: 1em;
}

.token-details > li > * {
	margin-left: 1em;
}

.token-details > li + li {
	margin-top: 0.5em;
}

.token-details > li > *:first-child {
	margin-left: 0;
}

.token-list ul {
	margin-top: 0;
	margin-left: 1em;
}

.token-expiry [data-is-expired] {
	color: red;
	font-weight: bold;
}

.token-creator {
	margin-top: 1em;
}

.delete-app-button,
.delete-token-button {
	display: block;
	margin-left: auto;
	color: red;
}

`
