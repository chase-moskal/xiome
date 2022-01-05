
import {css} from "../../../../framework/component.js"
import chatHistoryCss from "./styles/chat-history.css.js"
export default css`

:host {
	display: block;
	--pad: var(--xio-chat-pad, 0);
	--header-background: (--xio-chat-header-background,  transparent);
	--login-panel-background: (--xio-chat-login-panel-background,  transparent);
	--background: var(--xio-chat-background, transparent);
	--border-radius: var(--xio-chat-border-radius, 0em);
}

.chatbox {
	padding var(--pad);
	background: var(--background);
	border: var(--border);
	border-radius: var(--border-radius);
}

.chatbox header {
	display: block;
	background: var(--header-background);
}

.chatbox header > span {
	display: inline-flex;
	justify-content: center;
	align-content: center;
	--xio-button-padding: 0.3em;
}

.chatbox xiome-login-panel {
	background: var(--xio-chat-login-panel-background);
}

div .authorship {
	display: flex;
	align-items: stretch;
}

div[slot="logged-out"] {
	text-align: center;
	line-height: 2em;
}

${chatHistoryCss}

`
