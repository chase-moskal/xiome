
import styles from "./auth-panel.css.js"
import {AccessPayload} from "../../../../types.js"
import {loading} from "../../../../toolbox/loading2.js"
import {makeAuthModel} from "../../models/auth-model2.js"
import {WiredComponent, html, mixinStyles, property} from "../../../../framework/component.js"

@mixinStyles(styles)
export class AuthPanel extends WiredComponent<{authModel: AuthModel}> {

	@property({type: Object})
	sendLoading = loading<{email: string}>()

	private async sendLoginLink() {
		const email = "chasemoskal@gmail.com"
		this.sendLoading.actions.setLoadingUntil({
			promise: this.share.authModel.sendLoginLink(email)
				.then(() => ({email})),
			errorReason: "failed sending email",
		})
	}

	private resetSendLoading() {
		this.sendLoading.actions.setNone()
	}

	private logout() {
		this.sendLoading.actions.setNone()
		this.share.authModel.logout()
	}

	private renderLoggedIn(access: AccessPayload) {
		return html`
			<p>logged in as ${access.user.profile.nickname}</p>
			<button @click=${this.logout}>Logout</button>
		`
	}

	private renderLoggedOut() {
		console.log(this.sendLoading)
		return html`
			<zap-loading .loadingView=${this.sendLoading.view}>
				<div slot=none>
					<p>logged out</p>
					<button @click=${this.sendLoginLink}>Send login link</button>
				</div>
				${this.sendLoading.view.ready ? html`
					<div>
						email is sent (${this.sendLoading.view.payload.email})
						<button @click=${this.resetSendLoading}>try another address?</button>
					</div>
				` : null}
			</zap-loading>
		`
	}

	render() {
		const {accessLoadingView} = this.share.authModel
		const access = accessLoadingView.payload
		return html`
			<zap-loading .loadingView=${accessLoadingView}>
				${access
					? this.renderLoggedIn(access)
					: this.renderLoggedOut()}
			</zap-loading>
		`
	}
}

type AuthModel = ReturnType<typeof makeAuthModel>
