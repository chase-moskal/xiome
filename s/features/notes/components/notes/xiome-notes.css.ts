
import {css} from "../../../../framework/component.js"
export default css`

:host {
	display: flex;
	flex-direction: column;
	align-items: stretch;
	justify-content: center;
	max-width: 50em;
	border: solid #999 0.1em;
}

/* Note tabs new/old */

.tabs {
	display: flex;
	justify-content: center;
	padding-bottom: 1em;
	margin: 1em 2em;
	border-bottom: solid #999 0.1em;
}

[data-tab] {
	font-weight: normal;
	margin: auto;
}

[data-tab][data-active='true'] {
	font-weight: bold;
	color: bisque;
}

/* Individual note */

ol > li {
	display: flex;
	flex-direction: column;
	padding: 1em;
	margin: 1em 2em;
	border: solid #999 0.1em;
	list-style-type: none;
}

ol > li > header {
	display: flex;
	justify-content: space-between;
	align-self: flex-end;
	width: 100%;
	margin-bottom: 0.5em;
}

/* Button bar */

.buttonbar {
	display:flex;
	justify-content: flex-end;
	padding-top: 1em;
	margin: 0 2em 1em 2em;
	border-top: solid #999 0.1em;
}
`
