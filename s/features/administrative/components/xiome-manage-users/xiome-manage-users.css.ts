
import {css} from "../../../../framework/component.js"
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

.userinfo .controls {
	margin-left: 1em;
}

.userinfo .controls .edit[data-edit-mode] {
	color: lime;
	--xio-button-hover-color: lime;
}

.editwidget > div {
	margin-top: 1em;
}

.editwidget header + * {
	margin-top: 0.25em;
}

.editwidget header small {
	font-size: inherit;
	opacity: 0.6;
}

.editwidget ul {
	list-style: none;
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
