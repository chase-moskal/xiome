
import styles from "./xiome-ecommerce.css.js"
import {altStoreModel} from "../../models/store-model/super-store-model.js"
import {WiredComponent, mixinStyles, html} from "../../../../framework/component.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"

@mixinStyles(styles)
export class XiomeEcommerce extends WiredComponent<{
		modals: ModalSystem
	} & ReturnType<typeof altStoreModel>["shares"]> {

	// // redux-style wiring

	// #state: StoreState

	// subscribe() {
	// 	return this.share.storeModel.renderSubscribe(state => {
	// 		this.#state = state
	// 		this.requestUpdate()
	// 	})
	// }




	// firstUpdated() {
	// 	this.share.ecommerceModel.fetchStoreStatus(true)
	// }

	// render() {
	// 	const {ecommerceModel} = this.share
	// 	return renderWrappedInLoading(
	// 		ecommerceModel.loadingViews.storeStatus,
	// 		status => {
	// 			switch (status) {

	// 				case StoreStatus.Uninitialized:
	// 					return html`<p>store uninitialized</p>`

	// 				case StoreStatus.Unlinked:
	// 					return html`<p>store banking info not linked</p>`

	// 				default:
	// 					const enabled = status === StoreStatus.Enabled
	// 					async function save(checked: boolean) {
	// 						return checked
	// 							? ecommerceModel.enableEcommerce()
	// 							: ecommerceModel.disableEcommerce()
	// 					}
	// 					return html`
	// 						<p>store is configured properly</p>
	// 						<p>
	// 							<xio-checkbox
	// 								?initially-checked=${enabled}
	// 								.save=${save}
	// 							></xio-checkbox>
	// 							Ecommerce active
	// 						</p>
	// 					`
	// 			}
	// 		}
	// 	)
	// }
}
