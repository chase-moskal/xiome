
import {css} from "../../../../../../framework/component.js"
export default css`

* {
	ZZoutline: 1px solid #0f02;
}

:host {
	display: block;
	width: 100%;
}

.container {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 0.5em;
}

.container > * {
	flex: 3 1 10em;
	display: flex;
	flex-direction: column;
}

.roles {
	flex: 1 3 10em;
}

.roles xio-button[data-hard] {
	opacity: 0.6;
}

.container > * > p {
	padding: 0 0.5em;
}

[part=plate] {
	flex: 1 1 auto;
	padding: 0.5em;
	background: #fff2;
}

[part=plate] xio-button {
	display: inline-block;
	margin: 0.2em 0.1em;
	--xio-button-disabled-opacity: 0.6;
}

[part=plate] xio-button[data-hard] {
	opacity: 0.6;
}

[part=plate] xio-button[data-selected]::part(button) {
	border: 1px solid lime;
	background: yellow;
	color: black;
}

[part=plate] xio-button > div {
	display: flex;
	flex-direction: row;
}

[part=plate] xio-button .icon {
	margin-right: 0.2em;
}

[part=plate] xio-button svg {
	width: 0.8em;
	height: 0.8em;
}

.buttonbar {
	text-align: right;
	background: #0002;
}

.buttonbar [data-button=delete] {
	--xio-button-hover-color: red;
	--xio-button-hover-background: transparent;
}

.buttonbar [data-button=new] {
	--xio-button-hover-color: lime;
	--xio-button-hover-background: transparent;
}

`
