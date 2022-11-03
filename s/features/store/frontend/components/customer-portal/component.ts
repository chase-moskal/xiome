
import {html} from "lit"
import {property} from "lit/decorators.js"

import {makeStoreModel} from "../../model/model.js"
import {Op, ops} from "../../../../../framework/ops.js"
import {renderOp} from "../../../../../framework/op-rendering/render-op.js"
import {mixinStyles, mixinRequireShare, Component} from "../../../../../framework/component.js"

import styles from "./styles.js"

@mixinStyles(styles)
export class XiomeStoreCustomerPortal extends mixinRequireShare<{
		storeModel: ReturnType<typeof makeStoreModel>
	}>()(Component) {

	get #storeModel() {
		return this.share.storeModel
	}

	async init() {
		await this.#storeModel.initialize()
	}

	@property()
	private op: Op<void> = ops.ready(undefined)

	#openPopup = async () => {
		const {customerPortal} = this.#storeModel.billing
		await ops.operation({
			promise: customerPortal(),
			setOp: newOp => this.op = newOp
		})
	}

	#renderButton() {
		return html`
			<xio-button @press=${this.#openPopup}>
				<slot>
					billing panel
				</slot>
			</xio-button>
		`
	}

	#renderMessageWhenStoreInactive() {
		return html`
			<slot name="not-ready"></slot>
		`
	}

	#renderMessageWhenLoggedOut() {
		return html`
			<slot name="logged-out"></slot>
		`
	}

	render() {
		const {accessOp} = this.#storeModel.state.user
		const {connectStatusOp} = this.#storeModel.state.stripeConnect
		const combinedOp = ops.combine(accessOp, connectStatusOp, this.op)
		return html`
			${renderOp(combinedOp, () => {
				const {userLoggedIn, storeActive} = this.#storeModel.get.is
				if (userLoggedIn) {
					if (storeActive)
						return this.#renderButton()
					else
						return this.#renderMessageWhenStoreInactive()
				}
				else
					return this.#renderMessageWhenLoggedOut()
			})}
		`
	}
}
