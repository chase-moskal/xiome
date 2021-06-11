
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

.editwidget {
	padding: 0.5em;
}

.editwidget header {
	padding: 0.5em;
}

.editwidget .manageroles {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	width: 100%;
}

.editwidget .manageroles > div {
	flex: 1 1 auto;
}

.editwidget .manageroles > div > div {
	padding: 0.5em;
}

.editwidget ul {
	list-style: none;
	padding: 0.5em;
}

.editwidget .allprivileges {
	margin-top: 0.5em;
}

.editwidget .allprivileges li {
	display: inline-block;
	font-size: 0.75em;
	padding: 0.1em 0.3em;
	margin: 0.2em 0.1em;
	border: 1px solid;
	border-radius: 1em;
}

`
