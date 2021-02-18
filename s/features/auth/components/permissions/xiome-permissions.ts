
import styles from "./xiome-permissions.css.js"
import {AuthModel} from "../../types/auth-model.js"
import {makePermissionsModel} from "../../models/permissions-model.js"
import {WiredComponent, mixinStyles, html, property} from "../../../../framework/component.js"
import { renderWrappedInLoading } from "../../../../framework/loading/render-wrapped-in-loading.js"

@mixinStyles(styles)
export class XiomePermissions extends WiredComponent<{
		authModel: AuthModel
		permissionsModel: ReturnType<typeof makePermissionsModel>
	}> {

	firstUpdated() {
		this.share.permissionsModel.load()
	}

	render() {
		const {permissionsLoadingView} = this.share.permissionsModel
		return renderWrappedInLoading(permissionsLoadingView, permissions => html`
			<div class=container>
				<div class=roles>
					<p>roles</p>
					<div>
						<ul>
							${permissions.roles.map(role => html`
								<li>${role.label} / ${role.roleId.substr(0, 8)}</li>
							`)}
						</ul>
					</div>
				</div>
				<div class=assigned>
					<p>assigned</p>
					<div>
						...
					</div>
				</div>
				<div class=available>
					<p>available</p>
					<div>
						...
					</div>
				</div>
			</div>
		`)
	}
}
