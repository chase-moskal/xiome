
import {css} from "../../../../framework/component.js"
import adminManagerCss from "./admins/admin-manager.css.js"
export default css`

:host {
	display: block;
}

.app-list {
	margin-bottom: 2em;
}

.app {
	margin-top: 0.5em;
	border: 1px solid #fff1;
	border-radius: 0.2em;
	overflow: hidden;
}

.app > * + * {
	margin-top: 0.3em;
}

.app + .app {
	margin-top: 1.5em;
}

.app > * {
	padding: 0.4em 1rem;
}

.app-header {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: flex-end;
	padding: 0;
	background: #0001;
}

.app-header .title {
	max-width: 100%;
	flex: 1 0 auto;
	padding: 0.3em 1em;
}

.app-header .title h3 {
	font-size: 1.5em;
	font-weight: bold;
}

.app-header .title h3::before {
	content: "🌐";
	color: white;
}

.app-header .stats {
	display: flex;
	flex-direction: row;
	justify-content: center;
	flex-wrap: wrap;
	padding: 0.2em;
}

.app-header .stats [data-stat] {
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	max-width: 6em;
	text-align: center;
}

.app-header .stats [data-stat] > span {
	padding: 0.1em 0.6em;
}

.app-header .stats [data-stat] > span:nth-child(1) {
	justify-self: flex-start;
}

.app-header .stats [data-stat] > span:nth-child(2) {
	opacity: 0.3;
	font-size: 0.6em;
}

.twoside {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
}

.twoside > div {
	flex: 1 0 50%;
	padding-bottom: 1em;
}

.twoside > div:nth-child(1) {
	padding-right: 1rem;
}

.app-editor {
	min-width: 15em;
}

.app-form > * + * {
	margin-top: 0.3em;
}

.app-form xio-button {
	margin-top: 0.6em;
}

.app-options > * + * {
	margin-top: 1em;
}

code {
	display: inline-block;
	font-size: 0.8em;
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

.htmlcode { color: #fff6; }
.htmlcode [data-syntax=tag] { color: deepskyblue; }
.htmlcode [data-syntax=attr] { color: skyblue; }
.htmlcode [data-syntax=data] { color: #aaffa0; }
.htmlcode [data-syntax=indent] {
	display: block;
	margin-left: 1em;
}

.app-code code {
	display: block;
	padding: 1em 2em;
	margin-top: 1em;
}

.delete-app-button {
	display: block;
	text-align: right;
	--xio-button-hover-background: red;
}

${adminManagerCss}

`
