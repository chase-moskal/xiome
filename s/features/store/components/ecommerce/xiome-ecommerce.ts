
import styles from "./xiome-ecommerce.css.js"
import {makeStoreModel} from "../../model/store-model.js"
import {StoreStatus} from "../../topics/types/store-status.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {Component2WithShare, mixinStyles, html} from "../../../../framework/component2/component2.js"

@mixinStyles(styles)
export class XiomeEcommerce extends Component2WithShare<{
		modals: ModalSystem
		ecommerce: ReturnType<typeof makeStoreModel>["shares"]["ecommerce"]
	}> {

	init() {
		this.share.ecommerce.initialize()
	}

	private renderStoreManagement() {
		const {ecommerce} = this.share
		return renderOp(ecommerce.storeStatus, storeStatus => {
			switch (storeStatus) {

				case StoreStatus.Uninitialized:
					return html`<p>store uninitialized</p>`

				case StoreStatus.Unlinked:
					return html`<p>store banking info not linked</p>`

				default:
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
		})
	}

	render() {
		const {ecommerce} = this.share
		return ecommerce.userCanManageStore
			? this.renderStoreManagement()
			: html`
				<p>you are not privileged to manage the store</p>
			`
	}
}
