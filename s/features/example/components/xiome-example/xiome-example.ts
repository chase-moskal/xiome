
import {makeExampleModel} from "../../models/example-model.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {ComponentWithShare, html, mixinStyles} from "../../../../framework/component.js"

import styles from "./xiome-example.css.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"

@mixinStyles(styles)
export class XiomeExample extends ComponentWithShare<{
		modals: ModalSystem
		exampleModel: ReturnType<typeof makeExampleModel>
	}> {

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
