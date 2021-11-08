
import {Await} from "../../../../types/await.js"
import {makeChatModel} from "../../models/chat-model.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {ComponentWithShare, html, mixinStyles, property} from "../../../../framework/component.js"

import styles from "./xiome-chat.css.js"
import {whenOpReady} from "../../../../framework/op-rendering/when-op-ready.js"

@mixinStyles(styles)
export class XiomeChat extends ComponentWithShare<{
		modals: ModalSystem
		chatModel: ReturnType<typeof makeChatModel>
	}> {

	@property({type: String})
	room: string = "default"

	get #model() {
		return this.share.chatModel
	}

	#room: Await<ReturnType<ReturnType<typeof makeChatModel>["room"]>>

	async init() {
		this.#room = await this.#model.room(this.room)
		console.log("ROOM", this.#room)
	}

	#renderModerationHeader() {
		return this.#model.allowance.moderateAllChats
			? html`
				<header>
					<p>room="${this.room}"</p>
					<p>
						<xio-button>toggle chat status</xio-button>
					</p>
				</header>
			`
			: null
	}

	#renderHistory() {
		return this.#model.allowance.viewAllChats
			? html`
				<div>*chat goes here*</div>
			`
			: html`
				<div>you are not privileged to view the chat</div>
			`
	}

	#renderParticipation() {
		return html`
			<xiome-login-panel>
				${whenOpReady(this.#model.state.accessOp, () => (
					this.#model.allowance.participateInAllChats
						? html`
							<div>
								<p>authorship area</p>
							</div>
						`
						: html`
							<div>
								<p>you do not have privilege to participate in the chat</p>
							</div>
						`
					)
				)}
			</xiome-login-panel>
		`
	}

	render() {
		return html`
			<div class=chatbox>
				${this.#renderModerationHeader()}
				${this.#renderHistory()}
				${this.#renderParticipation()}
			</div>
		`
	}
}
