
import usersSvg from "../../../../framework/icons/users.svg.js"
import clearIcon from "../../../../framework/icons/clear.svg.js"
import unmuteIcon from "../../../../framework/icons/unmute.svg.js"
import onOffIcon from "../../../../framework/icons/on-off-button.svg.js"

import {makeChatModel} from "../../models/chat-model.js"
import {pluralize} from "../../../../toolbox/pluralize.js"
import {renderChatPost} from "./renderers/render-chat-post.js"
import {chatPostCoolOff} from "../../common/chat-constants.js"
import {makeChatRoom} from "../../models/room/make-chat-room.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {ChatDraft, ChatStatus} from "../../common/types/chat-concepts.js"
import {renderChatAuthorship} from "./renderers/render-chat-authorship.js"
import {XioTextInput} from "../../../xio-components/inputs/xio-text-input.js"
import {whenOpReady} from "../../../../framework/op-rendering/when-op-ready.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {Component, html, mixinRequireShare, mixinStyles, property, query} from "../../../../framework/component.js"

import xiomeChatCss from "./xiome-chat.css.js"

@mixinStyles(xiomeChatCss)
export class XiomeChat extends mixinRequireShare<{
		modals: ModalSystem
		chatModel: ReturnType<typeof makeChatModel>
	}>()(Component) {

	@property({type: String})
	room: string = "default"

	get #model() {
		return this.share.chatModel
	}

	get #roomStats() {
		const statsForRooms = this.#model.state.cache.roomStats?.statsForRooms
		if (statsForRooms) {
			return statsForRooms[this.room]
		}
	}

	#room: ReturnType<typeof makeChatRoom>
	#dispose = () => {}

	#scrolledToBottom = true
	#updateScrolledToBottom() {
		const ol = this.shadowRoot.querySelector("ol")
		const {scrollTop, scrollHeight, clientHeight} = ol
		const scrollTotal = scrollHeight - clientHeight
		const scrollFromBottom = scrollTotal - scrollTop
		this.#scrolledToBottom = scrollFromBottom < 50
	}
	#coordinateScrollingBehavior = () => {
		const ol = this.shadowRoot.querySelector(".history ol")
		if (ol) {
			if (ol.scrollHeight <= ol.clientHeight)
				this.#scrolledToBottom = true
			else if (this.#scrolledToBottom)
				ol.scrollTo(0, ol.scrollHeight - ol.clientHeight)
		}
		else
			this.#scrolledToBottom = true
	}

	subscribe() {
		this.#model.session(this.room)
			.then(({room, dispose}) => {
				this.#room = room
				this.#dispose = dispose
			})
			.then(() => this.requestUpdate())

		const unsubs = [
			super.subscribe(),
			() => this.#dispose(),
			this.#subscribeTooSoon(),
			this.#model.subscribeToChange(this.#coordinateScrollingBehavior),
		]

		return () => {
			for (const unsub of unsubs)
				unsub()
		}
	}

	#renderRoomStats() {
		const roomStats = this.#roomStats
		if (roomStats) {
			const {moderators, viewers, participants, totalUsers} = roomStats
			return this.#room
				? html`
					<p class=chatfooter>
						${usersSvg}
						<span class=user-count>
							${totalUsers} ${pluralize(totalUsers, "user", "users")}
						</span>
						<span class=user-counting-details>
							(${moderators} ${pluralize(moderators, "moderator", "moderators")},
							${participants} ${pluralize(participants, "participant", "participants")},
							${viewers} ${pluralize(viewers, "viewer", "viewers")})
						</span>
					</p>
				`
				: null
		}
	}

	#renderModerationHeader() {
		const status = this.#room.status
		const toggleStatus = () => {
			this.#room.setRoomStatus(
				this.#room.status === ChatStatus.Offline
					? ChatStatus.Online
					: ChatStatus.Offline
			)
		}
		const muteCount = this.#room.muted.length
		return this.#model.allowance.moderateAllChats
			? html`
				<header class=modheader>
					<span>room="${this.room}"</span>
					<span>
						<xio-button
							title="unmute ${muteCount} users"
							?disabled=${muteCount === 0}
							@press=${() => this.#room.unmuteAll()}>
								${unmuteIcon} ${muteCount}
						</xio-button>
						<xio-button
							title="clear chat room"
							@press=${() => this.#room.clear()}>
								${clearIcon}
						</xio-button>
						<xio-button
							title="set chat ${
								status === ChatStatus.Offline ? "online" : "offline"
							}"
							@press=${toggleStatus}>
								${onOffIcon}
						</xio-button>
					</span>
				</header>
			`
			: null
	}

	#renderHistory() {
		return html`
			<div class=history>
				${this.#model.allowance.viewAllChats
					? html`
						${this.#room.posts.length
							? html`
								<ol @scroll=${this.#updateScrolledToBottom}>
									${this.#room.posts.map(post => renderChatPost({
										post,
										isModerator: this.#model.allowance.moderateAllChats,
										mute: () => this.#room.mute(post.userId),
										remove: () => this.#room.remove([post.postId]),
										mutedIds: this.#room.muted
									}))}
								</ol>
							`
							: html`
								<slot name=no-messages>
									no messages
								</slot>
							`}
					`
					: html`
						<slot name=cannot-view>
							you are not privileged to view the chat
						</slot>
					`}
			</div>
		`
	}

	@property()
	private draftValid = false

	@query(".authorship xio-text-input")
	private authorshipInput: XioTextInput

	@property()
	private tooSoon: boolean = false
	#lastSend: number = Date.now()
	#updateTooSoon = () => {
		const since = Date.now() - this.#lastSend
		this.tooSoon = since < chatPostCoolOff
	}
	#subscribeTooSoon() {
		const interval = setInterval(this.#updateTooSoon, 1000)
		return () => clearInterval(interval)
	}

	#postToChat = (event: Event) => {
		event.preventDefault()
		const {tooSoon} = this
		if (!tooSoon) {
			const {value} = this.authorshipInput
			const draft: ChatDraft = {content: value}
			this.#lastSend = Date.now()
			this.authorshipInput.text = ""
			this.#updateTooSoon()
			this.#room.post(draft)
		}
	}

	#renderParticipation() {
		const authorshipArea = () => {
			return this.#room.weAreBanned
				? html`<slot name=banned>you are banned</slot>`
				: this.#room.weAreMuted
					? html`<slot name=muted>you are muted</slot>`
					: renderChatAuthorship({
						sendable: !!this.draftValid && !this.tooSoon,
						onSendClick: this.#postToChat,
						onEnterPress: this.#postToChat,
						onValidityChange: valid => this.draftValid = valid,
					})
		}
		return html`
			<xiome-login-panel>
				${whenOpReady(this.#model.state.accessOp, () => html`
					<slot name=logged-out slot=logged-out>
						login to participate in the chat
					</slot>
					<div class=participation>
						${this.#model.allowance.participateInAllChats
							? authorshipArea()
							: html`
								<slot name=cannot-participate>
									you do not have privilege to participate in the chat
								</slot>
							`}
					</div>
				`)}
			</xiome-login-panel>
		`
	}

	render() {
		return renderOp(this.#model.state.connectionOp, () => html`
			<div class=chatbox>
				${this.#room?
					html`
						${this.#renderModerationHeader()}
						${this.#room?.status === ChatStatus.Online
							? [
								this.#renderHistory(),
								this.#renderParticipation(),
								this.#renderRoomStats()
							]
							: html`
								<slot name=offline>
									chat is offline
								</slot>
							`}
					`:
					null}
			</div>
		`)
	}
}
