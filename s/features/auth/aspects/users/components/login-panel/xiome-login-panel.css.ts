
import {css} from "../../../../../../framework/component.js"
export default css`

:host {
	display: block;
}

slot {
	display: block;
}

xio-text-input,
xio-button {
	margin-top: 0.2em;
}

xio-text-input > span {
	opacity: 0.4;
	font-size: 0.7em;
}

.buttonbar {
	margin-top: 0.5em;
	vertical-align: middle;
}

slot[name="legal"] {
	display: inline-block;
	margin: 0 1em;
}

small {
	display: block;
	opacity: 0.5;
	font-size: 0.7em;
}

`
