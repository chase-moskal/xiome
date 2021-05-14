
import styles from "./xiome-my-avatar.css.js"
import {ops} from "../../../../framework/ops.js"
import {AuthModel} from "../../models/types/auth/auth-model.js"
import {Component2WithShare, html, mixinStyles} from "../../../../framework/component2/component2.js"

@mixinStyles(styles)
export class XiomeMyAvatar extends Component2WithShare<{authModel: AuthModel}> {
	render() {
		const access = ops.value(this.share.authModel.access)
		const user = access?.user
		return html`
			<xio-avatar .user=${user}></xio-avatar>
		`
	}
}
