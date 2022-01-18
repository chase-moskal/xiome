
import {css} from "../../../../framework/component.js"
import chatHistoryCss from "./styles/chat-history.css.js"
export default css`

:host {
	display: block;
	max-width: 56em;
	--xiome-chat-history-height: 20em;
}

.modheader {
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
	align-items: end;
	padding: 0 1em;
}

.modheader > span:nth-child(1) {
	opacity: 0.5;
	padding: 0.2em 0;
}

.modheader > span:nth-child(2) {
	margin-left: auto;
}

xio-button {
	--xio-button-disabled-border-style: none;
}

.modheader xio-button {
	--xio-button-border: none;
}

.modheader xio-button::part(button-slot) {
	display: flex;
	align-items: center;
	gap: 0.5em;
}

.history {
	padding: 1em;
	border: 1px solid;
	border-radius: 0.5em 0.5em 0 0;
	border-bottom: 0;
}

.chatbox xiome-login-panel {
	display: block;
	border: 1px solid currentColor;
	border-radius: 0 0 0.5em 0.5em;
}

.chatbox xiome-login-panel[status="logged-out"] {
	padding: 1em;
}

.chatbox slot[name="offline"],
.chatbox slot[name="muted"] {
	display: block;
	padding: 2em 1em;
	text-align: center;
}

.chatbox slot[name="offline"] {
	border: 1px solid currentColor;
	border-radius: 0.5em;
}

.chatfooter {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	margin: 0.1em 0.5em;
}

.chatfooter svg {
	width: 1.3em;
}

.chatfooter .user-count {
	margin: 0 0.5em;
}

.chatfooter .user-counting-details {
	opacity: 0.5;
}

${chatHistoryCss}

.authorship {
	display: flex;
	align-items: stretch;
	Xborder: 1px solid;
}

.authorship xio-text-input {
	border-right: 1px solid;
	--xio-text-input-height: 6em;
	--xio-text-input-label-opacity: 0.5;
	--xio-text-input-border: 0;
	--xio-text-input-pad: 1em;
}

.authorship xio-button {
	height: 6em;
	flex: 1 1 auto;
	--xio-button-border: 0;
	--xio-button-disabled-border-style: none;
}

.authorship xio-button::part(button) {
	width: 100%;
}

.authorship .inputlabel {
	display: block;
	opacity: 0.5;
	padding: 0.2em 0;
	margin-left: 1em;
}

`
