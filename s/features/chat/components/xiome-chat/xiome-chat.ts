
import {Await} from "../../../../types/await.js"
import {makeChatModel} from "../../models/chat-model.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {ComponentWithShare, html, mixinStyles, property} from "../../../../framework/component.js"

import styles from "./xiome-chat.css.js"

@mixinStyles(styles)
export class XiomeChat extends ComponentWithShare<{
		modals: ModalSystem
		chatModel: ReturnType<typeof makeChatModel>
	}> {

	@property({type: String})
	room: string

	get #model() {
		return this.share.chatModel
	}

	#room: Await<ReturnType<ReturnType<typeof makeChatModel>["room"]>>

	async init() {
		this.#room = await this.#model.room(this.room)
		console.log("ROOM", this.#room)
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
