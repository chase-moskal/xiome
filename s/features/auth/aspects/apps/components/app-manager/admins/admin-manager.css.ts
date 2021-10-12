
import {css} from "../../../../../../../framework/component.js"
export default css`

.adminmanager .adminassigner {
	display: flex;
	flex-direction: row;
	margin: 0.5em 0;
}

.adminmanager .adminassigner > * {
	display: block;
}

.adminmanager .adminassigner > xio-text-input {
	flex: 1 1 auto;
}

.adminmanager .adminassigner > xio-text-input {
	width: 100%;
	max-width: 100%;
}

.adminmanager .adminassigner > xio-text-input::part(problems) {
	min-width: unset;
}

.adminmanager .adminassigner > xio-button {
	margin-top: 1.1em;
	margin-left: 0.3em;
}

.adminmanager .adminlist ul {
	list-style: none;
	padding: 0 1em;
	border: 1px solid #fff1;
}

.adminmanager .adminlist li {
	display: flex;
	flex-direction: row;
	align-content: center;
	padding: 0.3em 0;
	font-size: 0.8em;
}

.adminmanager .adminlist li + li {
	border-top: 1px solid #fff1;
}

.adminmanager .adminlist li > * {
	display: block;
}

.adminmanager .adminlist li > span {
	flex: 1 1 auto;
	display: flex;
	align-items: center;
	word-break: break-all;
}

.adminmanager .adminlist li > xio-button {
	color: #fff3;
}

`
