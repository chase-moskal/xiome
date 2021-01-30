
import styles from "./xiome-app-list.css.js"
import {AppModel} from "../../../types/app-model.js"
import {AppDisplay} from "../../../types/apps/app-display.js"
import {loading} from "../../../../../framework/loading/loading.js"
import {WiredComponent, html, mixinStyles, query} from "../../../../../framework/component.js"
import {renderWrappedInLoading} from "../../../../../framework/loading/render-wrapped-in-loading.js"
import { makeAppCreator } from "./app-creator.js"

@mixinStyles(styles)
export class XiomeAppList extends WiredComponent<{appModel: AppModel}> {

	firstUpdated() {
		this.share.appModel.loadAppList()
	}

	private renderNoApps() {
		return html`
			<slot></slot>
		`
	}

	private deleteApp = async(appId: string) => {
		await this.share.appModel.deleteApp(appId)
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
						<p>
							<span>app-label:</span>
							<span>${app.label}</span>
						</p>
						<p>
							<span>app-home:</span>
							<span>${app.home}</span>
						</p>
						<button @click=${() => this.deleteApp(app.appId)}>
							delete app
						</button>
					</div>
				`)}
			</div>
		`
	}

	private readonly appCreator = makeAppCreator({
		shadowRoot: this.shadowRoot,
		requestUpdate: () => this.requestUpdate(),
		createApp: async appDraft => {
			await this.share.appModel.registerApp(appDraft)
		},
	})

	render() {
		const {appListLoadingView} = this.share.appModel
		return html`
			${renderWrappedInLoading(appListLoadingView, appList => appList.length
				? this.renderAppList(appList)
				: this.renderNoApps()
			)}
			${this.appCreator.render()}
		`
	}
}
