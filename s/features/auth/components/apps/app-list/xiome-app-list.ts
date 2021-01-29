
import styles from "./xiome-app-list.css.js"
import {AppModel} from "../../../types/app-model.js"
import {AppDisplay} from "../../../types/apps/app-display.js"
import {renderLoading} from "../../../../../framework/render-loading.js"
import {WiredComponent, html, mixinStyles} from "../../../../../framework/component.js"

@mixinStyles(styles)
export class XiomeAppList extends WiredComponent<{appModel: AppModel}> {

	private renderNoApps() {
		return html`
			<slot></slot>
		`
	}

	private renderAppList(appList: AppDisplay[]) {
		return html`
			<div class=applist>
				${appList.map(app => html`
					<div class=app data-app-id=${app.appId}>
						<p class=app-id>
							<span>app-id:</span>
							<span>${app.appId}</span>
						</p>
						<zap-text-input class=app-label .text=${app.label}></zap-text-input>
						<zap-text-input class=app-home .text=${app.home}></zap-text-input>
					</div>
				`)}
			</div>
		`
	}

	render() {
		const {appListLoadingView} = this.share.appModel
		return renderLoading(appListLoadingView, appList => appList.length
			? this.renderAppList(appList)
			: this.renderNoApps()
		)
	}
}
