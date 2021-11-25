
import {css} from "../../../../../framework/component.js"
export default css`

.history {
	overflow-y: auto;
	display: flex;
	flex-direction: column-reverse;
	height: 300px; /*Delete height values when the chat element gets styled*/
	--_scrollbar-width: 0.75em;
	--_scrollbar-background-color: rgba(255, 128, 0, 0.5);
	--_scrollbar-gradient: linear-gradient(rgba(255, 128, 0, 0.8), rgba(255, 128, 0, 0.5));
	--_scrollbar-shadow: inset 0 0 0.5em rgb(255, 128, 0);
	--_scrollbar-component-background-color: rgb(140, 140, 140);
	--_scrollbar-component-hover-background-color: rgb(150, 150, 150);
	--_scrollbar-component-active-background-color: rgb(170, 170, 170);
	--_scrollbar-component-border: 1px solid rgb(230, 230, 230);
	--_scrollbar-component-icon-repeat: no-repeat;
	--_scrollbar-component-icon-position: center;
	--_scrollbar-component-icon-color: rgba(100, 100, 100, 0.6);
	--_scrollbar-top-button-radius-border: 2em 2em 0 0;
	--_scrollbar-top-button-icon: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-arrow-up'><line x1='12' y1='19' x2='12' y2='5'></line><polyline points='5 12 12 5 19 12'></polyline></svg>");
	--_scrollbar-bottom-button-radius-border: 0 0 2em 2em;
	--_scrollbar-bottom-button-icon: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-arrow-down'><line x1='12' y1='5' x2='12' y2='19'></line><polyline points='19 12 12 19 5 12'></polyline></svg>");
}

div.history {
	scrollbar-color: var(--_scrollbar-component-background-color) var(--_scrollbar_background-color);
	scrollbar-width: var(--_scrollbar_width);
}

div.history::-webkit-scrollbar {
	width: var(--_scrollbar_width);
}

div.history::-webkit-scrollbar-thumb {
	border: var(--_scrollbar-component-border);
	background: var(--_scrollbar-component-background-color);
}

div.history::-webkit-scrollbar-thumb:hover {
	background-color: var(--_scrollbar-component-hover-background-color);
}

div.history::-webkit-scrollbar-thumb:active {
	background-color: var(--_scrollbar-component-active-background-color);
}

div.history::-webkit-scrollbar-track {
	background-image: var(--_scrollbar-gradient);
}

div.history::-webkit-scrollbar-track:hover {
	box-shadow: var(--_scrollbar-shadow);
}

div.history::-webkit-scrollbar-button:start:decrement {
	color: var(--_scrollbar-component-icon-color);
	background-color: var(--_scrollbar-component-background-color);
	background-image: var(--_scrollbar-top-button-icon);
	background-position: var(--_scrollbar-component-icon-position);
	background-repeat: var(--_scrollbar-component-icon-repeat);
	border: var(--_scrollbar-component-border);
	border-radius: var(--_scrollbar-top-button-radius-border);
}

div.history::-webkit-scrollbar-button:start:decrement:hover {
	background-color: var(--_scrollbar-component-hover-background-color);
}

div.history::-webkit-scrollbar-button:start:decrement:active {
	background-color: var(--_scrollbar-component-active-background-color);
}

div.history::-webkit-scrollbar-button:end:increment {
	color: var(--_scrollbar-component-icon-color);
	background-color: var(--_scrollbar-component-background-color);
    background-image: var(--_scrollbar-bottom-button-icon);
	background-position: var(--_scrollbar-component-icon-position);
	background-repeat: var(--_scrollbar-component-icon-repeat);
	border: var(--_scrollbar-component-border);
	border-radius: var(--_scrollbar-bottom-button-radius-border);
}

div.history::-webkit-scrollbar-button:end:increment:hover {
	background-color: var(--_scrollbar-component-hover-background-color);
}

div.history::-webkit-scrollbar-button:end:increment:active {
	background-color: var(--_scrollbar-component-active-background-color);
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
	align-items: center;
	justify-content: space-between;
}

li > header > span > xio-button {
	--_border: var(--xio-button-border, none);
	--_padding: var(--xio-button-padding, 0.2em);
}

.nickname {
	font-size: 1.1em;
	font-weight: bold;
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

.time {
	font-size: 0.6em;
	padding-left: 0.5em;
}

`
