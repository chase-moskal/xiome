
import styles from "./xiome-app-manager.css.js"
import {renderXiomeConfig} from "./utils/render-xiome-config.js"

import {WiredComponent, html, mixinStyles} from "../../../../framework/component.js"
import {renderWrappedInLoading} from "../../../../framework/loading/render-wrapped-in-loading.js"

import {makeAppForm} from "./form/app-form.js"
import {multipleAppForms} from "./form/multiple-app-forms.js"
import {formDraftToAppDraft} from "./form/utils/form-draft-to-app-draft.js"
import {appDisplayToFormDraft} from "./form/utils/app-display-to-form-draft.js"

import {AppModel} from "../../types/app-model.js"
import {AppDisplay} from "../../types/apps/app-display.js"

@mixinStyles(styles)
export class XiomeAppManager extends WiredComponent<{appModel: AppModel}> {

	firstUpdated(changes: any) {
		super.firstUpdated(changes)
		this.share.appModel.loadAppList()
	}

	private readonly appRegistrationForm = makeAppForm({
		clearOnSubmit: true,
		submitButtonText: "register new app",
		requestUpdate: () => this.requestUpdate(),
		query: selector => (
			this.shadowRoot
				.querySelector(".app-registration")
				.querySelector(selector)
		),
		submit: async formDraft => {
			const appDraft = formDraftToAppDraft(formDraft)
			await this.share.appModel.registerApp(appDraft)
		},
	})

	private readonly appListingForms = multipleAppForms({
		configureNewAppForm: (app: AppDisplay) => makeAppForm({
			clearOnSubmit: false,
			submitButtonText: "save changes",
			initialValues: appDisplayToFormDraft(app),
			requestUpdate: () => this.requestUpdate(),
			query: selector => (
				this.shadowRoot
					.querySelector(`.app[data-app-id="${app.appId}"] .app-editor`)
					.querySelector(selector)
			),
			submit: async formDraft => {
				const appDraft = formDraftToAppDraft(formDraft)
				await this.share.appModel.updateApp(app.appId, appDraft)
			},
		})
	})

	private deleteApp = async(appId: string) => {
		await this.share.appModel.deleteApp(appId)
	}

	private renderNoApps() {
		return html`
			<slot name=no-apps></slot>
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

	private renderApp(app: AppDisplay) {
		const appForm = this.appListingForms.getAppForm(app)
		return html`
			<div class=app data-app-id=${app.appId}>
				<div class=app-editor>
					${appForm.render()}
				</div>

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

	render() {
		const {appListLoadingView} = this.share.appModel
		return html`
			${renderWrappedInLoading(appListLoadingView, appList => appList.length
				? this.renderAppList(appList)
				: this.renderNoApps())}
			<div class=app-registration>
				<slot name="register-app-heading"></slot>
				${this.appRegistrationForm.render()}
			</div>
		`
	}
}
