
import {css} from "../../../../framework/component.js"
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
}

[part=plate] xio-button[data-hard] {
	color: blue;
}

[part=plate] xio-button[disabled]::part(button) {
	border: 1px solid lime;
	background: yellow;
	color: black;
}

.buttonbar {
	text-align: right;
	color: orange;
}

`
