
import {css} from "../../../framework/component2/component2.js"
export default css`

.container {
	display: block;
	width: 100%;
	max-width: 36em;
	padding: 0.5em !important;
	border: 1px solid;
}

.results {
	margin-top: 0.5em;
}

.userlist {
	list-style: none;
}

.userlist > li {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	margin-top: 0.5em;
	background: #0002;
	padding: 0.5em;
}

.userlist > li > xio-profile-card {
	flex: 1 1 auto;
}

.userlist > li > .controls {
	flex: 0 1 auto;
	display: flex;
	flex-direction: column;
}

.userlist > li > .controls > select {
	min-width: 12em;
	margin: 0.3em;
}

`
