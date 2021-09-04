
import styles from "./xiome-my-avatar.css.js"
import {makeAccessModel} from "../../models/access-model.js"
import {renderOp} from "../../../../../../framework/op-rendering/render-op.js"
import {AutowatcherComponentWithShare, html, mixinStyles} from "../../../../../../framework/component/component.js"

@mixinStyles(styles)
export class XiomeMyAvatar extends AutowatcherComponentWithShare<{
		accessModel: ReturnType<typeof makeAccessModel>
	}> {
	render() {
		const accessOp = this.share.accessModel.getAccessOp()
		return renderOp(accessOp, access => html`
			<xio-avatar
				.spec=${access?.user?.profile.avatar}
				part="xio-avatar"
			></xio-avatar>
		`)
	}
}
