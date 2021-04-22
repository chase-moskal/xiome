
import styles from "./xiome-ecommerce.css.js"
import {makeStoreModel} from "../../models/store-model/store-model.js"
import {WiredComponent, mixinStyles, html} from "../../../../framework/component.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {ops} from "../../../../framework/ops.js"
import {StoreStatus} from "../../topics/types/store-status.js"
import {renderOp} from "../../../../framework/loading/render-op.js"

@mixinStyles(styles)
export class XiomeEcommerce extends WiredComponent<{
		modals: ModalSystem
		ecommerce: ReturnType<typeof makeStoreModel>["shares"]["ecommerce"]
	}> {

	firstUpdated() {
		this.share.ecommerce.initialize()
	}

	render() {
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
}
