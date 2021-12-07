
import {css} from "../../../../../framework/component.js"
export default css`

.history {
	overflow-y: auto;
	display: flex;
	flex-direction: column-reverse;
	height: 300px; /*Delete height values when the chat element gets styled*/
	--_scrollbar-width: 0.75em;
	--_scrollbar-background-color: rgba(100, 100, 100, 0.3);
	--_scrollbar-component-background-color: rgb(130, 130, 130);
	--_scrollbar-component-hover-background-color: rgb(150, 150, 150);
	--_scrollbar-component-active-background-color: rgb(170, 170, 170);
	--_scrollbar-component-border: 1px solid rgb(230, 230, 230);
	--_scrollbar-component-border-radius: 2em;
}

div.history {
	scrollbar-color: var(--_scrollbar-component-background-color) var(--_scrollbar-background-color);
	scrollbar-width: var(--_scrollbar_width);
}

div.history::-webkit-scrollbar {
	width: var(--_scrollbar_width);
}

div.history::-webkit-scrollbar-thumb {
	border: var(--_scrollbar-component-border);
	border-radius: var(--_scrollbar-component-border-radius);
	background: var(--_scrollbar-component-background-color);
}

div.history::-webkit-scrollbar-thumb:hover {
	background-color: var(--_scrollbar-component-hover-background-color);
}

div.history::-webkit-scrollbar-thumb:active {
	background-color: var(--_scrollbar-component-active-background-color);
}

div.history::-webkit-scrollbar-track {
	background-image: var(--_scrollbar-background-color);
}

.chat-placeholder {
	margin: auto 0 auto 0;
	opacity: 0.5;
	text-align: center;
}

.history ol {
}

.history li {
	background-color: rgb(60, 60, 60);
	margin-top: 1em;
}

li > header {
	display: flex;
	align-items: stretch;
	flex-direction: row;
	gap: 1.5em;
}

li > header > span {
	display: flex;
	align-items: center;
}

.userid {
	margin-left: 1em;
	overflow: hidden;
}

li > header > span > xio-button {
	--_border: var(--xio-button-border, none);
	--_padding: var(--xio-button-padding, 0.35em);
}

.nickname {
	font-size: 1.1em;
	font-weight: bold;
	padding-left: 0.25em;
}

.content {
	padding: 0.25em;
	white-space: pre-wrap;
}

.time {
	font-size: 1em;
	opacity: 0.5;
	padding-left: 0.5em;
}

`
