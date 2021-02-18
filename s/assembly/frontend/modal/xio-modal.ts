
// import {Modal} from "./types/modal.js"
// import {mixinStyles} from "../../../framework/component/mixin-styles.js"
// import {Component, html, property, render, TemplateResult} from "../../../framework/component.js"

// import styles from "./xio-modal.css.js"
// import {mobxify} from "../../../framework/mobxify.js"
// import {ModalControls} from "./types/modal-controls.js"
// import { ModalOptions } from "./types/modal-options.js"

// @mixinStyles(styles)
// export class XioModal extends Component {
// 	private _count = 0
// 	private _map = new Map<number, Modal>()
// 	private get _modals() { return Array.from(this._map.values()) }

// 	createRenderRoot() {
// 		return this
// 	}

// 	firstUpdated() {
// 		this.confirm({
// 			title: "Are you sure?",
// 			body: "seriously? you're really sure?",
// 			yes: "Yes",
// 			no: "No",
// 		})
// 	}

// 	popup({renderContent, onBlanketClick}: ModalOptions) {
// 		const count = this._count++
// 		const controls: ModalControls = {
// 			close: () => {
// 				this._map.delete(count)
// 				this.requestUpdate()
// 			}
// 		}
// 		// if (shadow) {
// 		// 	const shadowContent = html`
// 		// 		<div part=content data-count=${count} tabindex=0>
// 		// 			${renderContent(controls)}
// 		// 		</div>
// 		// 	`
// 		// 	this._map.set(count, makeModal({content: shadowContent, controls}))
// 		// }
// 		// else {
// 		// 	const slot = `modal-${count}`
// 		// 	const shadowContent = html`<slot name="${slot}"></slot>`
// 		// 	const lightContent = html`
// 		// 		<div part=content slot="${slot}" data-count=${count} tabindex=0>
// 		// 			${renderContent(controls)}
// 		// 		</div>
// 		// 	`
// 		// 	this._map.set(count, makeModal({content: shadowContent, controls}))
// 		// 	render(lightContent, this)
// 		// }
// 		// this.requestUpdate().then(() => this.focus())
// 		// return controls
// 	}

// 	async confirm({
// 			title,
// 			body = null,
// 			yes = "yes",
// 			no = "no",
// 		}: {
// 			title: string | TemplateResult
// 			body?: string | TemplateResult
// 			yes?: string
// 			no?: string
// 		}) {
// 		return new Promise<boolean>(resolve => {
// 			this.popup({
// 				shadow: true,
// 				onBlanketClick: controls => {
// 					controls.close()
// 					resolve(false)
// 				},
// 				renderContent: controls => {
// 					const onYes = () => { controls.close(); resolve(true) }
// 					const onNo = () => { controls.close(); resolve(false) }
// 					return html`
// 						<div data-confirm>
// 							${typeof title == "string" ? html`<h2>${title}</h2>` : title}
// 							${typeof body == "string" ? html`<p>${body}</p>` : body}
// 							<div data-buttons>
// 								<xio-button part=button-yes @press=${onYes}>${yes}</xio-button>
// 								<xio-button part=button-no @press=${onNo}>${no}</xio-button>
// 							</div>
// 						</div>
// 					`
// 				},
// 			})
// 		})
// 	}

// 	prompt() {
		
// 	}

// 	render() {
// 		return this._modals.map(modal => modal.render())
// 	}
// }
