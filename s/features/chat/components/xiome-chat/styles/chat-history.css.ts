
import {css} from "../../../../../framework/component.js"
export default css`

.history ol,
.history slot[name="no-messages"] {
	height: var(--xiome-chat-history-height);
	overflow-y: auto;
	scrollbar-color: #0004 #0002;
	scrollbar-width: thin;
}

.history ol::-webkit-scrollbar {
	width: 0.4em;
}

.history ol::-webkit-scrollbar-thumb {
	border-radius: 1em;
	background: #0004;
}

.history ol::-webkit-scrollbar-thumb:hover {
	background: #0008;
}

.history ol::-webkit-scrollbar-thumb:active {
	background: #000a;
}

.history ol::-webkit-scrollbar-track {
	border-radius: 1em;
	background: #0002;
}

slot[name="no-messages"] {
	opacity: 0.5;
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
}

.history li + li {
	margin-top: 0.75em;
}

.history li > header {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 0.5em;
}

.history li .moderation {
	opacity: 0.5;
}

.history li > header > span {
	display: flex;
	align-items: center;
}

.history li > header > span > xio-button {
	--xio-button-border: none;
	--xio-button-padding: 0 0.3em;
}

.history li .nickname {
	font-size: 1em;
	opacity: var(--xio-chat-nickname-opacity, 0.5);
	color: var(--xio-chat-nickname-color, currentColor);
}

.history li .userid {
	font-size: 1em;
	opacity: var(--xio-chat-userid-opacity, 0.5);
	color: var(--xio-chat-userid-color, currentColor);
}

.history li .content {
	font-size: 1.3em;
	word-break: break-word;
}

.history li .time {
	opacity: 0.3;
	font-size: 1rem;
}

`
