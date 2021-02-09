
import styles from "./xiome-app-manager.css.js"
import {makeAppCreator} from "./app-creator/app-creator.js"
import {parseOrigins} from "../../topics/apps/parse-origins.js"
import {renderXiomeConfig} from "./utils/render-xiome-config.js"
import {makeAppStateManager} from "./utils/app-state-manager.js"
import {appDraftValidators} from "../../topics/apps/app-draft-validators.js"
import {XioTextInput} from "../../../xio-components/inputs/xio-text-input.js"
import {WiredComponent, html, mixinStyles} from "../../../../framework/component.js"
import {renderWrappedInLoading} from "../../../../framework/loading/render-wrapped-in-loading.js"

import {AppModel} from "../../types/app-model.js"
import {AppDisplay} from "../../types/apps/app-display.js"

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
				${appList.map(app => this.renderApp(app))}
			</div>
		`
	}

	private getAppState = makeAppStateManager({
		submit: this.share.appModel.updateApp,
		requestUpdate: () => this.requestUpdate(),
	})

	private renderApp(app: AppDisplay) {
		const getValueFor = <X extends HTMLElement>(select: string): X => (
			this.shadowRoot
				.querySelector(`.app[data-app-id="${app.appId}"] .app-${select}`)
		)
		const {formState, formEventHandlers} = this.getAppState({
			app,
			getFormValues: () => ({
				label: getValueFor<XioTextInput>("label").value,
				home: getValueFor<XioTextInput>("home").value,
				origins: getValueFor<XioTextInput<string[]>>("origins").value,
			})
		})
		function originsMinusHome(home: string, origins: string[]) {
			return origins
				.filter(o => o.toLowerCase() !== new URL(home.toLowerCase()).origin)
				.map(o => o.toLowerCase())
		}
		return html`
			<div class=app data-app-id=${app.appId}>
				<xio-text-input
					class=app-label
					initial="${app.label}"
					?disabled=${formState.formDisabled}
					.validator=${appDraftValidators.label}
					@valuechange=${formEventHandlers.handleFormChange}>
						community label
				</xio-text-input>

				<xio-text-input
					class=app-home
					initial="${app.home}"
					?disabled=${formState.formDisabled}
					.validator=${appDraftValidators.home}
					@valuechange=${formEventHandlers.handleFormChange}>
						website homepage
				</xio-text-input>

				<xio-text-input
					textarea
					class=app-origins
					initial="${originsMinusHome(app.home, app.origins).join("\n")}"
					?disabled=${formState.formDisabled}
					show-validation-when-empty
					.parser=${parseOrigins}
					.validator=${appDraftValidators.additionalOrigins}
					@valuechange=${formEventHandlers.handleFormChange}>
						additional origins (optional)
				</xio-text-input>

				<xio-button
					?disabled=${!formState.valid}
					@press=${formEventHandlers.handleSubmitClick}>
					save changes
				</xio-button>

				<div class=app-code>
					<p>install html</p>
					<code class=htmlcode>
						${renderXiomeConfig(app.appId)}
					</code>
				</div>

				<xio-button
					class=delete-app-button
					@press=${() => this.deleteApp(app.appId)}>
						delete community
				</xio-button>
			</div>
		`
	}
}
