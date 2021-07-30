
import styles from "./xiome-my-avatar.css.js"
import {ops} from "../../../../../../framework/ops.js"
import {makeAccessModel} from "../../models/access-model.js"
import {AutowatcherComponentWithShare, html, mixinStyles} from "../../../../../../framework/component/component.js"

@mixinStyles(styles)
export class XiomeMyAvatar extends AutowatcherComponentWithShare<{
		accessModel: ReturnType<typeof makeAccessModel>
	}> {
	render() {
		const access = ops.value(this.share.accessModel.access)
		const avatarSpec = access?.user?.profile.avatar
		return html`
			<xio-avatar .spec=${avatarSpec} part="xio-avatar"></xio-avatar>
		`
	}
}
