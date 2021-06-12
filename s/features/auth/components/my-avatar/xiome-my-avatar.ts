
import styles from "./xiome-my-avatar.css.js"
import {ops} from "../../../../framework/ops.js"
import {AuthModel} from "../../models/types/auth/auth-model.js"
import {Component2WithShare, html, mixinStyles} from "../../../../framework/component2/component2.js"

@mixinStyles(styles)
export class XiomeMyAvatar extends Component2WithShare<{authModel: AuthModel}> {
	render() {
		const access = ops.value(this.share.authModel.access)
		const avatarSpec = access?.user?.profile.avatar
		return html`
			<xio-avatar .spec=${avatarSpec} part="xio-avatar"></xio-avatar>
		`
	}
}
