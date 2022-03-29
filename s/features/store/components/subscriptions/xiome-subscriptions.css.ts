
import {css} from "../../../../framework/component.js"
export default css`

ol, ul {
	list-style: none;
}

.plans > li {
	margin-top: 1em;
}

.tiers {
	display: flex;
	flex-direction: row;
	gap: 0.5em;
}

button {
	border: none;
	background: transparent;
	font: inherit;
	color: inherit;

	border: 1px solid;
	border-radius: 3px;

	cursor: pointer;
	opacity: 0.7;
}

button:is(:hover, :focus) {
	opacity: 1;
}

button > div {
	padding: 0.5em;
}

.label {
	background: #fff2;
}

`
