
import {makeStoreModel} from "../../models/store-model.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"

import {Component, html, mixinRequireShare, mixinStyles, property, query} from "../../../../framework/component.js"

export class XiomeStoreConnect extends mixinRequireShare<{
		modals: ModalSystem
		storeModel: ReturnType<typeof makeStoreModel>
	}>()(Component) {

	render() {
		return html`
			<p>store connect</p>
		`
	}
}
