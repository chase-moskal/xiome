
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
	flex-direction: column;
	flex-wrap: wrap;
	background: #0002;
	padding: 0.5em;
	margin-top: 0.5em;
}

.userinfo {
	display: flex;
	flex-direction: row;
}

.userinfo xio-profile-card {
	flex: 1 1 auto;
}

.userinfo .controls .edit[data-edit-mode] {
	color: lime;
	--xio-button-hover-color: lime;
}

`
