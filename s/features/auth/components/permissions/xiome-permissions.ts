
import styles from "./xiome-permissions.css.js"
import {AuthModel} from "../../types/auth-model.js"
import {WiredComponent, mixinStyles, html, property} from "../../../../framework/component.js"

@mixinStyles(styles)
export class XiomePermissions extends WiredComponent<{authModel: AuthModel}> {

	render() {
		return html`
			<div class=container>
				<div class=roles>
					roles
				</div>
				<div class=assigned>
					assigned
				</div>
				<div class=available>
					available
				</div>
			</div>
		`
	}
}
