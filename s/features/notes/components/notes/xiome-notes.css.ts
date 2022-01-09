	import { css } from "../../../../framework/component.js";
	export default css`
	:host {
	display: block;
	}

	[data-tab] {
		font-weight: normal;
		margin-left: 20px;
		border: none;
		border-top: 0px;
		border-left: 0px;
		border-right: 0px;
		border-style: solid;
		outline: none;
	}

	[data-tab][data-active="true"] {
		font-weight: bold;
		color: bisque;
	}

	.tabs {
		display: flex;
		justify-content: center;
	}

	.tab-new,
	.tab-old {
	}

	.note-container {
		border-style: solid;
		padding: 20px;
		width: 30%;
	}
	.note-body {
		border-style: solid;
		border-width: 3px 3px;
		width: auto;
		color: gray;
		list-style-type: none;
		padding: 10px 10px 10px 10px;
		margin-top: 15px;
		margin-bottom: 15px;
		word-wrap: break-word;
	}

	.typeandtime {
		display: flex;
		flex-direction: row;
	}

	.note-type {
		flex: 1;
	}
	.note-time {
		flex: 7;
	}

	.note-title {
		font-size: 40px;
		font-weight: 300;
		line-height: 45px;
	}

	.note-text {
	font-size: 20px;
	font-weight: 100;
	line-height: 26px;
	}

	.buttonbar {
	display: flex;
	justify-content: flex-end;
	}

	[visibility] {
	top: 0;
	float: right;
	font-size: 20px;
	font-weight: normal;
	}

	.page-container {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	}

	.note-content-box {
	border-left: 0px;
	border-right: 0px;
	border-style: solid;
	padding: 5px 5px 5px 10px;
	margin-bottom: 10px;
	margin-top: 10px;
	}
	`;
