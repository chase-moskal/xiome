
import styles from "./xiome-app-list.css.js"
import {AppPayload} from "../../../../../types.js"
import {AppModel} from "../../../types/app-model.js"
import {WiredComponent, html, mixinStyles} from "../../../../../framework/component.js"

@mixinStyles(styles)
export class XiomeAppList extends WiredComponent<{appModel: AppModel}> {

	private renderNoApps() {
		return html`
			<slot></slot>
		`
	}

	private renderAppList(appList: AppPayload[]) {
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
						<textarea class=app-origins .value=${app.origins.join("\n")}></textarea>
						${app.platform
							? html`<p class=app-platform>platform</p>`
							: null}
					</div>
				`)}
			</div>
		`
	}

	render() {
		const {appList} = this.share.appModel
		return html`
			${appList.length === 0
				? this.renderNoApps()
				: this.renderAppList(appList)}
		`
	}
}
