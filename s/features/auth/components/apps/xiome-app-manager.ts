
import styles from "./xiome-app-manager.css.js"
import {AppModel} from "../../types/app-model.js"
import {AppDisplay} from "../../types/apps/app-display.js"
import {WiredComponent, html, mixinStyles, query} from "../../../../framework/component.js"
import {renderWrappedInLoading} from "../../../../framework/loading/render-wrapped-in-loading.js"

import {makeAppCreator} from "./app-creator/app-creator.js"

@mixinStyles(styles)
export class XiomeAppManager extends WiredComponent<{appModel: AppModel}> {

	firstUpdated() {
		this.share.appModel.loadAppList()
	}

	private renderNoApps() {
		return html`
			<slot name=no-apps></slot>
		`
	}

	private deleteApp = async(appId: string) => {
		await this.share.appModel.deleteApp(appId)
	}

	private renderAppList(appList: AppDisplay[]) {
		return html`
			<slot></slot>
			<div class=applist>
				${appList.map(app => html`
					<div class=app data-app-id=${app.appId}>
						<p class=app-label>
							<span>label:</span>
							<span>${app.label}</span>
						</p>
						<p class=app-home>
							<span>home:</span>
							<span>${app.home}</span>
						</p>
						<p class=app-id>
							<span>app id:</span>
							<span>${app.appId}</span>
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
		root: this.shadowRoot,
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
			<slot name=creator-heading></slot>
			${this.appCreator.render()}
		`
	}
}
