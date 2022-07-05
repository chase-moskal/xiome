
import {css} from "./component.js"
export default css`

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

:focus {
	outline: var(--focus-outline, 2px solid cyan);
}

:host-context(:focus) {
	outline: 0 !important;
}

`
