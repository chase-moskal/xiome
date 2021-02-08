
import styles from "./xiome-app-manager.css.js"
import {makeAppCreator} from "./app-creator/app-creator.js"
// import {makeTokenManager} from "./token-manager/token-manager.js"
import {WiredComponent, html, mixinStyles} from "../../../../framework/component.js"
import {renderWrappedInLoading} from "../../../../framework/loading/render-wrapped-in-loading.js"

import {AppModel} from "../../types/app-model.js"
import {AppDisplay} from "../../types/apps/app-display.js"
import {renderXiomeConfig} from "./utils/render-xiome-config.js"

@mixinStyles(styles)
export class XiomeAppManager extends WiredComponent<{appModel: AppModel}> {

	firstUpdated(changes: any) {
		super.firstUpdated(changes)
		this.share.appModel.loadAppList()
	}

	private readonly appCreator = makeAppCreator({
		root: this.shadowRoot,
		requestUpdate: () => this.requestUpdate(),
		createApp: async appDraft => {
			await this.share.appModel.registerApp(appDraft)
		},
	})

	private renderNoApps() {
		return html`
			<slot name=no-apps></slot>
		`
	}

	private deleteApp = async(appId: string) => {
		await this.share.appModel.deleteApp(appId)
	}

	render() {
		const {appListLoadingView} = this.share.appModel
		return html`
			${renderWrappedInLoading(appListLoadingView, appList => appList.length
				? this.renderAppList(appList)
				: this.renderNoApps())}
			${this.appCreator.render()}
		`
	}

	private renderAppList(appList: AppDisplay[]) {
		return html`
			<slot></slot>
			<div class=app-list>
				${appList.map(app => html`
					<div class=app data-app-id=${app.appId}>
						<p class=app-label>
							<span>🌐</span>
							<strong>${app.label}</strong>
							<code class=id>${app.appId}</code>
						</p>
						<p class=app-home>
							<span>homepage:</span>
							<span>
								<a part="link link-external" target=_blank href="${app.home}">
									${app.home}
								</a>
							</span>
						</p>
						<div class=app-code>
							<p>copy-paste the config into your webpage html:</p>
							<code class=htmlcode>
								${renderXiomeConfig(app.appId)}
							</code>
						</div>
						<button
							class=delete-app-button
							@click=${() => this.deleteApp(app.appId)}>
								delete community
						</button>
					</div>
				`)}
			</div>
		`
	}
}
