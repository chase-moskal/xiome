
import styles from "./xiome-ecommerce.css.js"
import {StoreStatus} from "../../topics/types/store-status.js"
import {AuthModel} from "../../../auth/models/types/auth/auth-model.js"
import {makeEcommerceModel} from "../../models/ecommerce-model/ecommerce-model.js"
import {WiredComponent, mixinStyles, html} from "../../../../framework/component.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {renderWrappedInLoading} from "../../../../framework/loading/render-wrapped-in-loading.js"
import {altStoreModel, StoreState, superStoreModel} from "../../models/store-model/super-store-model.js"

@mixinStyles(styles)
export class XiomeEcommerce extends WiredComponent<{
		modals: ModalSystem
		storeModel: ReturnType<typeof altStoreModel>
	}> {

	#unsub = () => {}
	connectedCallback() {
		super.connectedCallback()
		this.#unsub = this.share.storeModel.watch(() => {
			this.render()
		})
	}
	disconnectedCallback() {
		super.disconnectedCallback()
		this.#unsub()
	}

	// #state: StoreState

	// subscribe() {
	// 	return this.share.storeModel.renderSubscribe(state => {
	// 		this.#state = state
	// 		this.requestUpdate()
	// 	})
	// }

	firstUpdated() {
		this.share.ecommerceModel.fetchStoreStatus(true)
	}

	render() {
		const {ecommerceModel} = this.share
		return renderWrappedInLoading(
			ecommerceModel.loadingViews.storeStatus,
			status => {
				switch (status) {

					case StoreStatus.Uninitialized:
						return html`<p>store uninitialized</p>`

					case StoreStatus.Unlinked:
						return html`<p>store banking info not linked</p>`

					default:
						const enabled = status === StoreStatus.Enabled
						async function save(checked: boolean) {
							return checked
								? ecommerceModel.enableEcommerce()
								: ecommerceModel.disableEcommerce()
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
			}
		)
	}
}
