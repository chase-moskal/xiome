
import {css} from "../../../../../../../framework/component.js"
export default css`

[data-vote] {
	display: block;
	border: none;
	font: inherit;
	background: transparent;
	color: inherit;
}

[data-vote] {
	cursor: pointer;
	opacity: 0.6;
	user-select: none;
}

[data-vote="report"] {
	opacity: 0.4;
}

[data-vote]:not([disabled]):hover,
[data-vote]:not([disabled]):focus {
	opacity: 1;
}

[data-vote][disabled] {
	cursor: default;
}

[data-vote="like"][data-active] {
	color: var(--like-color);
}

[data-vote="report"][data-active] {
	color: var(--report-color);
}

[data-vote] > span {
	vertical-align: middle;
}

[data-vote] > span:nth-child(2) {
	font-size: 0.9em;
}

[data-vote] svg {
	width: 1.4em;
	height: 1.4em;
	position: relative;
	top: 0.1em;
}

`
