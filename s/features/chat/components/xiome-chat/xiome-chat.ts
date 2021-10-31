
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {ComponentWithShare, html, mixinStyles} from "../../../../framework/component.js"

import styles from "./xiome-chat.css.js"
import {makeChatModel} from "../../models/chat-model.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"

@mixinStyles(styles)
export class XiomeChat extends ComponentWithShare<{
		modals: ModalSystem
		chatModel: ReturnType<typeof makeChatModel>
	}> {

	get #model() {
		return this.share.chatModel
	}

	render() {
		return renderOp(this.#model.state.accessOp, access => html`
			<p>Example Component</p>
			${access?.user
				? html`<p>Welcome, ${access.user.profile.nickname}</p>`
				: html`<p>User is not logged in.</p>`}
		`)
	}
}
