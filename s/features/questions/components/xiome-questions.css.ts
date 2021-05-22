
import {css} from "../../../framework/component2/component2.js"
export default css`

* {
	outline: 1px solid #f002;
}

`

// export default css`

// * {
// 	margin: 0;
// 	padding: 0;
// 	box-sizing: border-box;
// }

// *:focus {
// 	outline: var(--focus-outline, 2px solid cyan);
// }

// :host {
// 	display: flex;
// 	flex-direction: var(--questions-board-flex-direction, column);
// }

// :host([hidden]) {
// 	display: none;
// }

// :host > metal-is-staff {
// 	flex: 1 1 auto;
// 	align-self: center;
// 	width: 100%;
// 	max-width: 420px;
// 	text-align: center;
// }

// .questions {
// 	list-style: none;
// }

// .questions > li + li {
// 	margin-top: 1em;
// }

// slot[name=post],
// slot[name=rate] {
// 	display: block;
// 	margin: 1.5em auto;
// 	text-align: center;
// }

// .question {
// 	display: flex;
// 	flex-direction: row;
// 	padding: 0.5em;
// 	background: var(--question-background, transparent);
// 	border-radius: var(--question-border-radius, 0.25em);
// }

// .question[data-mine] {
// 	background: var(--question-base-mine-background, rgba(255,255,255, 0.1));
// }

// .question > * {
// 	flex: 0 0 auto;
// }

// .author {
// 	font-size: 1em;
// 	display: flex;
// 	flex-direction: row;
// }

// cobalt-avatar {
// 	--cobalt-avatar-size: 4em;
// }

// .author .details {
// 	padding: 0.5em;
// 	padding-top: 0;
// }

// .author .time {
// 	opacity: 0.5;
// 	font-size: 0.75em;
// }

// .likebutton {
// 	opacity: 0.8;
// 	border: none;
// 	display: flex;
// 	align-items: center;
// 	font: inherit;
// 	color: inherit;
// 	background: transparent;
// 	cursor: pointer;
// }

// .likebutton:hover,
// .likebutton:focus {
// 	opacity: 1;
// }

// .likebutton > * {
// 	flex: 1 1 auto;
// }

// .likebutton .like-heart {
// 	font-size: 1.8em;
// }
// .likebutton .like-heart svg path {
// 	fill: none;
// 	stroke: currentColor;
// 	stroke-width: 1;
// }

// .likebutton[data-liked] {
// 	color: var(--question-like-color, rgba(255, 167, 183, 0.64));
// }

// .likebutton[data-liked] .like-heart svg path {
// 	fill: currentColor;
// }

// .likebutton .like-number {
// 	padding-left: 0.2em;
// }

// .body {
// 	position: relative;
// 	flex: 1 1 auto;
// 	display: flex;
// 	flex-direction: column;
// 	justify-content: space-between;
// 	padding: 0em;
// 	background: var(--question-body-background, rgba(255,255,255, 0.1));
// 	color: var(--question-body-color, inherit);
// 	border-radius: inherit;
// }

// .body::before {
// 	content: "";
// 	display: block;
// 	position: absolute;
// 	top: 1em;
// 	right: 100%;
// 	border: 0.5em solid transparent;
// 	border-right-color: var(--question-body-background, rgba(255,255,255, 0.1));
// }

// .content {
// 	padding: 1em;
// 	font: inherit;
// 	color: inherit;
// 	white-space: pre-wrap;
// 	overflow-wrap: anywhere;
// 	background: transparent;
// }

// textarea.content {
// 	min-height: 6em;
// 	transition: min-height 500ms ease;
// 	border: 1px dashed var(--question-body-background, rgba(255,255,255, 0.2));
// }

// textarea.content[data-expand] {
// 	min-height: 12em;
// }

// .controls {
// 	display: flex;
// 	justify-content: flex-end;
// 	align-items: center;
// 	padding: 0.2em;
// }

// .controls button {
// 	opacity: 0.7;
// 	border: none;
// 	color: var(--question-button-color, inherit);
// 	font: inherit;
// 	font-size: 0.8em;
// 	margin: 0 0.1em;
// 	padding: 0.2em 0.6em;
// 	background: var(--question-button-background, rgba(0,0,0, 0.2));
// 	border: var(--question-button-border, 1px solid rgba(0,0,0, 0.2));
// 	border-radius: var(--question-button-border-radius, 3px);
// 	text-shadow: var(--question-button-text-shadow, 1px 1px 2px rgba(0,0,0, 0.5));
// 	cursor: pointer;
// }

// .controls button:hover,
// .controls button:focus {
// 	opacity: 1;
// }

// .controls button[disabled] {
// 	background: rgba(255,255,255, 0.2);
// 	opacity: 0.4;
// }

// .message {
// 	flex: 1 1 auto;
// 	font-size: 0.8em;
// 	padding: 0.2em 0.6em;

// 	opacity: var(--question-message-opacity, 0.8);
// 	color: var(--question-message-color, white);
// 	background: var(--question-message-background, rgba(255,255,255, 0.1));
// 	border: var(--question-message-border, 1px solid);
// 	text-shadow: var(--question-message-text-shadow, 1px 1px 2px rgba(0,0,0, 0.5));
// }

// .message[data-angry] {
// 	color: var(--question-message-color-angry, red);
// 	background: var(--question-message-background-angry, rgba(128,32,32, 0.1));
// 	border: var(--question-message-border-angry, 1px solid);
// 	text-shadow: var(--question-message-text-shadow-angry, 1px 1px 2px rgba(0,0,0, 0.5));
// }

// .question.editor {
// 	order: 1;
// 	border: 1px dashed var(--question-body-background, rgba(255,255,255, 0.2));
// }

// .question.editor .body textarea {
// 	border-radius: inherit;
// }

// .question.editor .body textarea::placeholder {
// 	opacity: 0.3;
// }

// .controls .postbutton {
// 	color: var(---question-postbutton-color, white);
// 	background: var(--question-postbutton-background, #00bb3a);
// }

// @media (max-width: 800px) {
// 	.question {
// 		flex-direction: column;
// 	}
// 	.author {
// 		width: unset;
// 		margin-bottom: 0.5em;
// 	}
// 	.body::before {
// 		border-right-color: transparent;
// 		border-bottom-color: var(--question-body-background, rgba(255,255,255, 0.1));
// 		top: unset;
// 		right: unset;
// 		bottom: 100%;
// 		left: 1.5em;
// 	}
// 	.question.editor .controls {
// 		order: unset;
// 	}
// }

// `
