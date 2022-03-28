
import {makeStoreModel} from "../../models/store-model.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {Component, html, mixinRequireShare, mixinStyles} from "../../../../framework/component.js"

import xiomeBillingCss from "./xiome-billing.css.js"

@mixinStyles(xiomeBillingCss)
export class XiomeBilling extends mixinRequireShare<{
		modals: ModalSystem
		storeModel: ReturnType<typeof makeStoreModel>
	}>()(Component) {

	render() {
		return html`
			<p>billing</p>
		`
	}
}
