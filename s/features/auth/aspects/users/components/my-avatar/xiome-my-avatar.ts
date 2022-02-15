
import styles from "./xiome-my-avatar.css.js"
import {makeAccessModel} from "../../models/access-model.js"
import {renderOp} from "../../../../../../framework/op-rendering/render-op.js"
import {Component, html, mixinRequireShare, mixinStyles} from "../../../../../../framework/component.js"

@mixinStyles(styles)
export class XiomeMyAvatar extends mixinRequireShare<{
		accessModel: ReturnType<typeof makeAccessModel>
	}>()(Component) {

	render() {
		const accessOp = this.share.accessModel.getAccessOp()
		return renderOp(
			accessOp,
			access => html`
				<xio-avatar
					part=avatar
					.spec=${access?.user?.profile.avatar}
				></xio-avatar>
			`,
			null,
			{showErrorText: false},
		)
	}
}
