
import {makeStoreModel} from "../../models/store-model.js"
import {Component, html, mixinRequireShare} from "../../../../framework/component.js"

export class XiomeStoreCustomerPortal extends mixinRequireShare<{
		storeModel: ReturnType<typeof makeStoreModel>
	}>()(Component) {

	get #storeModel() {
		return this.share.storeModel
	}

	async init() {
		await this.#storeModel.initialize()
	}

	#openPopup = async () => {
		const {customerPortal} = this.#storeModel.billing
		await customerPortal()
	}

	render() {
		return html`
			<xio-button @press=${this.#openPopup}>
				customer portal
			</xio-button>
		`
	}
}
