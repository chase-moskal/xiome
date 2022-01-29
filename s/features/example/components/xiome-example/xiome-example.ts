
import styles from "./xiome-example.css.js"

import {makeExampleModel} from "../../models/example-model.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {Component, html, mixinRequireShare, mixinStyles} from "../../../../framework/component.js"

@mixinStyles(styles)
export class XiomeExample extends mixinRequireShare<{
		modals: ModalSystem
		exampleModel: ReturnType<typeof makeExampleModel>
	}>()(Component) {

	get state() {
		return this.share.exampleModel.state
	}

	render() {
		return renderOp(this.state.accessOp, access => html`
			<p>Example Component</p>
			${access?.user
				? html`<p>Welcome, ${access.user.profile.nickname}</p>`
				: html`<p>User is not logged in.</p>`}
		`)
	}
}
