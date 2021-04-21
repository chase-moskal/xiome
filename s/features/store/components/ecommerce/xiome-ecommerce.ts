
import styles from "./xiome-ecommerce.css.js"
import {makeStoreModel} from "../../models/store-model/store-model.js"
import {WiredComponent, mixinStyles, html} from "../../../../framework/component.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {ops} from "../../../../framework/ops.js"
import {StoreStatus} from "../../topics/types/store-status.js"

@mixinStyles(styles)
export class XiomeEcommerce extends WiredComponent<{
		modals: ModalSystem
		ecommerce: ReturnType<typeof makeStoreModel>["shares"]["ecommerce"]
	}> {

	firstUpdated() {
		this.share.ecommerce.fetchStoreStatus(true)
	}

	render() {
		console.log("RENDER")
		const {ecommerce} = this.share
		const storeStatus = ops.value(ecommerce.storeStatus)
		console.log("storestatus", storeStatus)
		return storeStatus !== undefined
			? (() => {
				switch (storeStatus) {

					case StoreStatus.Uninitialized:
						return html`<p>store uninitialized</p>`

					case StoreStatus.Unlinked:
						return html`<p>store banking info not linked</p>`

					default:
						console.log("renderproperly")
						const enabled = storeStatus === StoreStatus.Enabled
						async function save(checked: boolean) {
							return checked
								? ecommerce.enableEcommerce()
								: ecommerce.disableEcommerce()
						}
						return html`
							<p>store is configured properly</p>
							<p>
								<xio-checkbox
									?initially-checked=${enabled}
									.save=${save}
								></xio-checkbox>
								Ecommerce active
							</p>
						`
				}
			})()
			: html`
				<p>...loading...</p>
			`
	}
}
