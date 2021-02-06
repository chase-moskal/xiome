
import styles from "./xiome-app-manager.css.js"
import {AppModel} from "../../types/app-model.js"
import {AppDisplay} from "../../types/apps/app-display.js"
import {WiredComponent, html, mixinStyles} from "../../../../framework/component.js"
import {renderWrappedInLoading} from "../../../../framework/loading/render-wrapped-in-loading.js"

import {makeAppCreator} from "./app-creator/app-creator.js"
import {makeTokenManager} from "./token-manager/token-manager.js"

@mixinStyles(styles)
export class XiomeAppManager extends WiredComponent<{appModel: AppModel}> {

	firstUpdated() {
		this.share.appModel.loadAppList()
	}

	private readonly appCreator = makeAppCreator({
		root: this.shadowRoot,
		requestUpdate: () => this.requestUpdate(),
		createApp: async appDraft => {
			await this.share.appModel.registerApp(appDraft)
		},
	})

	private readonly tokenManager = makeTokenManager({
		root: this.shadowRoot,
		requestUpdate: () => this.requestUpdate(),
		createToken: async tokenDraft => {
			await this.share.appModel.registerAppToken(tokenDraft)
		},
		deleteToken: async appTokenId => {
			await this.share.appModel.deleteAppToken(appTokenId)
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
			<slot name=create-app-heading></slot>
			${this.appCreator.render()}
		`
	}

	private renderAppList(appList: AppDisplay[]) {
		return html`
			<slot></slot>
			<div class=applist>
				${appList.map(app => html`
					<div class=app data-app-id=${app.appId}>
						<div class=appdetails>
							<p class=app-label>
								<span>💡</span>
								<span>${app.label}</span>
							</p>
							<p class=app-home>
								<span>home:</span>
								<span>
									<a part="link link-external" target=_blank href="${app.home}">
										${app.home}
									</a>
								</span>
							</p>
							<p class=app-id>
								<span>app id:</span>
								<code>${app.appId}</code>
							</p>
						</div>
						${this.tokenManager.render(app)}
						<button
							class=delete-app-button
							@click=${() => this.deleteApp(app.appId)}>
								delete app
						</button>
					</div>
				`)}
			</div>
		`
	}
}
