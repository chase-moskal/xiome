
import {css} from "./component.js"
export default css`

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

input[type=text],
textarea,
button {
	font: inherit;
	padding: 0.2em;
}

button { cursor: pointer; }
button[disabled] { cursor: default; }

`
