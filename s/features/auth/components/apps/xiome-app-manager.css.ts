
import {css} from "../../../../framework/component.js"
export default css`

code {
	display: inline-block;
	font-size: 0.7em;
	padding: 0.2em;
	border-radius: 0.3em;
	background: #0002;
	overflow-wrap: anywhere;
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

.appcreator {
	margin: 0 var(--xmargin, 0);
	padding: 0.4em 1rem;
}

.token-manager ul,
.token-manager ol {
	list-style: none;
}

.token-list {
	margin: 0.5em 0;
}

.token-list > li {
	padding: 0 0.5em;
	border: 4px solid #fff4;
	border-top: 0;
	border-bottom: 0;
}

.token-list > li + li{
	margin-top: 1.5em;
}

.token-list > li > * + * {
	margin-top: 0.2em;
}

.token-list .token-origins {
	margin-top: 0;
	margin-left: 1em;
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
