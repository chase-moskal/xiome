
import styles from "./xiome-ecommerce.css.js"
import {AuthModel} from "../../../auth/models/types/auth/auth-model.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {WiredComponent, mixinStyles, html, property} from "../../../../framework/component.js"
import {renderWrappedInLoading} from "../../../../framework/loading/render-wrapped-in-loading.js"
import {makeEcommerceModel} from "../../models/ecommerce-model/ecommerce-model.js"
import {StoreStatus} from "../../topics/types/store-status.js"

@mixinStyles(styles)
export class XiomeEcommerce extends WiredComponent<{
		modals: ModalSystem
		authModel: AuthModel
		ecommerceModel: ReturnType<typeof makeEcommerceModel>
	}> {

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
						return html`
							<p>store is configured properly</p>
							<p>store status: ${status === StoreStatus.Enabled ? "enabled" : "disabled"}</p>
						`
				}
			}
		)
	}
}
