
import styles from "./xiome-my-avatar.css.js"
import {ops} from "../../../../../../framework/ops.js"
import {Component2WithShare, html, mixinStyles} from "../../../../../../framework/component2/component2.js"
import {makeAccessModel} from "../../models/access-model.js"

@mixinStyles(styles)
export class XiomeMyAvatar extends Component2WithShare<{accessModel: ReturnType<typeof makeAccessModel>}> {
	render() {
		const access = ops.value(this.share.accessModel.access)
		const avatarSpec = access?.user?.profile.avatar
		return html`
			<xio-avatar .spec=${avatarSpec} part="xio-avatar"></xio-avatar>
		`
	}
}
