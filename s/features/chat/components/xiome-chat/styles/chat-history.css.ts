
import {css} from "../../../../../framework/component.js"
export default css`

.history {
	overflow-y: scroll;
	display: flex;
	text-align: center;
	flex-direction: column-reverse;
	/*Everything below this is for testing, delete before pull request*/
	height: 300px;
	border: 2px solid blue;
}

.history ol {
	text-align: left;
	/*Everything below this is for testing, delete before pull request*/
	border: 2px dotted green;
}

.history li {
	border-radius: 10px;
	background-color: rgb(60, 60, 60);
	margin-top: 10px;
	/*Everything below this is for testing, delete before pull request*/
	border: 2px dashed yellow;
}

.nickname {
	font-size: 1.1em;
	font-weight: bold;
	padding: 0 3px;
}

.userid {
	font-size: 0.5em;
	display: inline-block;
	opacity: 0.5;
	overflow: hidden;
	width: 2.5em;
}

.content {
	white-space: pre-wrap;
}

.feather {
	display: inline-block;
	margin-left: 0.5em;
	float: right;
}

li > footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.time {
	font-size: 0.6em;
}

`
