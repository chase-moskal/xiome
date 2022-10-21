
import {css} from "@chasemoskal/magical/x/camel-css/camel-css-lit.js"
export default css`

ol, ul {
	list-style: none;
}

[part="plans"] > li {
	margin-top: 1em;
}

[part="tiers"] {
	display: flex;
	flex-direction: row;
	gap: 0.5em;
	align-items: stretch;
	^ > span {
		display: block;
	}
}

[part="planlabel"] {
	font-size: 1em;
	padding-bottom: 0.2em;
}

`
