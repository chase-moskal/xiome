
import {css} from "../../../../../../framework/component.js"
export default css`

.creator {
	margin: 1em auto;
}

.privilege {
	display: inline-flex;
	flex-direction: row;
	padding: 0.2em 0.5em;
	margin: 0.2em;
	border: 1px solid;
}

.privilege .icon {
	padding-right: 0.5em;
}

.privilege xio-button {
	--xio-button-padding: 0;
	--xio-button-border: none;
}

.privilege[data-hard] {
	opacity: 0.5;
	border: 1px solid dashed;
}

`
