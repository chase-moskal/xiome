
// TODO multisub: maybe use camel if you want?
import {css} from "@chasemoskal/magical/x/camel-css/camel-css-lit.js"
// import {css} from "../../../../framework/component.js"

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
	align-items: stretch;
}

button {
	display: flex;
	flex-direction: column;
	align-items: stretch;
	justify-content: space-between;

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
