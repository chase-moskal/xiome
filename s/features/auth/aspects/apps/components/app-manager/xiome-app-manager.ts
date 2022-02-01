
import {snapstate} from "@chasemoskal/snapstate"

import styles from "./xiome-app-manager.css.js"
import {renderXiomeConfig} from "./utils/render-xiome-config.js"

import {makeAppForm} from "./form/app-form.js"
import {AppDisplay} from "../../types/app-display.js"
import {makeAppsModel} from "../../models/apps-model.js"
import {makeAdminManager} from "./admins/admin-manager.js"
import {AppRecords} from "../../models/types/app-records.js"
import {formDraftToAppDraft} from "./form/utils/form-draft-to-app-draft.js"
import {strongRecordKeeper} from "../../../../../../toolbox/record-keeper.js"
import {renderOp} from "../../../../../../framework/op-rendering/render-op.js"
import {appDisplayToFormDraft} from "./form/utils/app-display-to-form-draft.js"
import {ModalSystem} from "../../../../../../assembly/frontend/modal/types/modal-system.js"
import {Component, mixinStyles, html, mixinRequireShare} from "../../../../../../framework/component.js"

@mixinStyles(styles)
export class XiomeAppManager extends mixinRequireShare<{
		modals: ModalSystem
		appsModel: ReturnType<typeof makeAppsModel>
	}>()(Component) {

	init() {
		this.share.appsModel.loadApps()
	}

	private appRegistrationForm = makeAppForm({
		clearOnSubmit: true,
		showAdditionalOrigins: false,
		submitButtonText: "create community",
		requestUpdate: () => this.requestUpdate(),
		query: selector => (
			this.shadowRoot
				.querySelector(".app-registration")
				.querySelector(selector)
		),
		submit: async formDraft => {
			const appDraft = formDraftToAppDraft(formDraft)
			await this.share.appsModel.registerApp(appDraft)
		},
	})

	private getAppState = strongRecordKeeper<string>()(appId => {
		const app = this.share.appsModel.getApp(appId)

		const state = snapstate({
			editMode: false,
		})

		const actions = {
			toggleEditMode() {
				state.writable.editMode = !state.writable.editMode
			},
		}

		state.subscribe(() => this.requestUpdate())

		return {
			toggleEditMode: actions.toggleEditMode,
			get editMode() { return state.readable.editMode },
			appForm: makeAppForm({
				clearOnSubmit: false,
				showAdditionalOrigins: true,
				submitButtonText: "save changes",
				initialValues: appDisplayToFormDraft(app),
				requestUpdate: () => { this.requestUpdate() },
				query: selector => (
					this.shadowRoot
						.querySelector(`.app[data-app-id="${app.appId}"] .app-options`)
						.querySelector(selector)
				),
				submit: async formDraft => {
					const appDraft = formDraftToAppDraft(formDraft)
					await this.share.appsModel.updateApp(app.appId, appDraft)
				},
			}),
			adminManager: (() => {
				const manager = makeAdminManager({
					app,
					appEditService: this.share.appsModel.appEditService,
					query: selector => this.shadowRoot
						.querySelector(`.app[data-app-id="${app.appId}"] .adminmanager`)
						.querySelector(selector)
				})
				manager.subscribe(() => this.requestUpdate())
				manager.controls.listAdmins()
				return manager
			})(),
		}
	})

	private deleteApp = async(app: AppDisplay) => {
		const userIsSure = await this.share.modals.confirm({
			title: "are you certain?",
			body: `you really want to delete your community "${app.label}"?`,
			yes: {label: "delete whole community", vibe: "negative"},
			no: {label: "nevermind", vibe: "neutral"},
			focusNthElement: 2,
		})
		if (userIsSure)
			await this.share.appsModel.deleteApp(app.appId)
	}

	private renderAppRegistration() {
		return html`
			<div class=app-registration>
				<slot name="register-app-heading"></slot>
				${this.appRegistrationForm.render({partNamespace: "appregistration"})}
			</div>
		`
	}

	private renderNoApps() {
		return html`
			<slot name=no-apps></slot>
			${this.renderAppRegistration()}
		`
	}

	private renderAppList(records: AppRecords) {
		return html`
			<slot></slot>
			<div class=app-list>
				${Object.entries(records)
					.map(([appId, record]) =>
						renderOp(record, app => this.renderApp(app)))}
			</div>
			${this.renderAppRegistration()}
		`
	}

	private renderAppBankLinking(app: AppDisplay) {
		return null
		// return html`
		// 	<div>
		// 		<h4>bank link to receive payouts</h4>
		// 		<xiome-bank-connect .appId=${app.appId}></xiome-bank-connect>
		// 	</div>
		// `
	}

	private renderAppCode(appId: string) {
		return html`
			<div class=app-code>
				<h4>connect your website</h4>
				<p>copy-paste this html into your website's &lt;head&gt; section:</p>
				<code class=htmlcode>
					${renderXiomeConfig(appId)}
				</code>
				<p>then head over to the <a part=link href="./components">components page</a></p>
			</div>
		`
	}

	private renderApp(app: AppDisplay) {
		const appState = this.getAppState(app.appId)
		return html`
			<div class=app data-app-id=${app.appId}>

				<div class=app-header part=app-header>
					<div class=title>
						<h3>
							<a part=link target=_blank href="${app.home}">
								${app.label}
							</a>
						</h3>
					</div>
					<div class=stats>
						<div data-stat=users>
							<span>${app.stats.users.toLocaleString()}</span>
							<span>users</span>
						</div>
						<div data-stat=monthly-active>
							<span>${app.stats.usersActiveMonthly.toLocaleString()}</span>
							<span>monthly active</span>
						</div>
						<div data-stat=active-last-day>
							<span>${app.stats.usersActiveDaily.toLocaleString()}</span>
							<span>daily active</span>
						</div>
					</div>
				</div>

				<div class=twoside>
					${this.renderAppCode(app.appId)}
					<div class=editside>
						<div class=buttons>
							<xio-button @click=${appState.toggleEditMode}>edit community</xio-button>
						</div>
						<div class=app-options ?hidden=${!appState.editMode}>
							<div class=app-details>
								${appState.appForm.render({partNamespace: "appeditor"})}
							</div>
							<div class=adminmanager>
								<h4>manage admins</h4>
								${appState.adminManager.render()}
							</div>
							${this.renderAppBankLinking(app)}
							<div class=finalbox>
								<xio-button
									class=delete-app-button
									@press=${() => this.deleteApp(app)}>
										delete community
								</xio-button>
							</div>
						</div>
					</div>
				</div>
			</div>
		`
	}

	render() {
		const {appRecords} = this.share.appsModel.state
		return html`
			${renderOp(appRecords, records => Object.values(records).length
				? this.renderAppList(records)
				: this.renderNoApps())}
		`
	}
}
