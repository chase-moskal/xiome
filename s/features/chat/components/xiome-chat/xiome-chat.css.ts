
import {css} from "../../../../framework/component.js"
import chatHistoryCss from "./styles/chat-history.css.js"
export default css`

X * { outline: 1px solid #f902; }

:host {
	display: block;
    --pad: var(--xio-chat-pad, 0);
    --background: var(--xio-chat-background, transparent);
    --border: var(--xio-chat-border, none);
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
}

.chatbox header > span {
	display: inline-flex;
	justify-content: center;
	align-content: center;
	--xio-button-padding: 0.3em;
}

div .authorship {
	display: flex;
	align-items: center;
}

div[slot="logged-out"] {
	text-align: center;
	line-height: 2em;
}

${chatHistoryCss}

`
