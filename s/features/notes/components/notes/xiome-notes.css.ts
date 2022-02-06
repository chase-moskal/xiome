
import {css} from "../../../../framework/component.js"
export default css`

:host {
	display: flex;
	flex-direction: column;
	align-items: stretch;
	justify-content: center;
	max-width: 32em;
	border: solid 0.1em;
}

xio-button {
	--xio-button-border: none;
	--_disabled-border-style: none;
}

/* Note tabs new/old */

.tabs {
	display: flex;
	justify-content: space-evenly;
	padding-bottom: 1em;
	margin: 1em 2em;
	border-bottom: solid 0.1em;
}

[data-tab] {
	font-weight: normal;
}

[data-tab][data-active='true'] {
	font-weight: bold;
	border-bottom: solid 0.2em;
}

/* Individual note */

ol > li {
	display: flex;
	flex-direction: column;
	padding: 1em;
	margin: 1em 2em;
	border: solid 0.1em;
	list-style-type: none;
}

ol > li > header {
	display: flex;
	justify-content: space-between;
	align-self: flex-end;
	width: 100%;
}

ol > li > p {
	opacity: 0.6;
}

/* Pagination */

.paginationBar {
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 1em 2em;
}

.paginationBar > span {
	margin: 0em 1em;
}

/* Notifications */

xio-op[mode="loading"], slot {
	display: block;
	text-align: center;
	width: 100%;
	margin-bottom: 1em;
}

/* Button bar */

.buttonbar {
	display: flex;
	justify-content: flex-end;
	padding-top: 1em;
	margin: 0 2em 1em 2em;
	border-top: solid 0.1em;
}

.buttonbar > xio-button {
	--xio-button-border: solid 0.1em;
}
`
