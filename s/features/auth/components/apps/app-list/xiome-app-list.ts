
import styles from "./xiome-app-list.css.js"
import {AppModel} from "../../../types/app-model.js"
import {AppDisplay} from "../../../types/apps/app-display.js"
import {loading} from "../../../../../toolbox/loading/loading.js"
import {ZapTextInput} from "../../../../zapcomponents/inputs/zap-text-input.js"
import {WiredComponent, html, mixinStyles, query} from "../../../../../framework/component.js"
import {renderWrappedInLoading} from "../../../../../framework/loading/render-wrapped-in-loading.js"

@mixinStyles(styles)
export class XiomeAppList extends WiredComponent<{appModel: AppModel}> {
	private createAppLoading = loading()

	@query(".app-creator .app-label")
	private appLabel: ZapTextInput

	@query(".app-creator .app-home")
	private appHome: ZapTextInput

	@query(".app-creator .app-origins")
	private appOrigins: HTMLTextAreaElement

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

	private handleCreateClick = async() => {
		const draft = {
			home: this.appHome.text,
			label: this.appLabel.text,
			origins: this.appOrigins.value
				.split("\n")
				.map(line => line.trim()),
		}
		this.appHome.text = ""
		this.appLabel.text = ""
		this.appOrigins.value = ""
		await this.createAppLoading.actions.setLoadingUntil({
			errorReason: "",
			promise: this.share.appModel.registerApp(draft),
		})
	}

	private renderAppCreator() {
		return html`
			<div class=app-creator>
				<zap-text-input class=app-label placeholder="app label"></zap-text-input>
				<zap-text-input class=app-home placeholder="app home"></zap-text-input>
				<textarea class=app-origins placeholder="app origins"></textarea>
				<br/>
				<button @click=${this.handleCreateClick}>
					create app
				</button>
			</div>
		`
	}

	render() {
		const {appListLoadingView} = this.share.appModel
		return html`
			${renderWrappedInLoading(appListLoadingView, appList => appList.length
				? this.renderAppList(appList)
				: this.renderNoApps()
			)}
			${this.renderAppCreator()}
		`
	}
}
