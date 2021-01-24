
import styles from "./styles/auth-panel.css.js"
import {WiredComponent, html, mixinStyles, TemplateResult} from "../../../framework/component.js"
import {makeAuthModel} from "../models/auth-model2.js"
import {LoadingView} from "../../../toolbox/loading2.js"

type AuthModel = ReturnType<typeof makeAuthModel>

export function renderLoading<xPayload>(
		loadingView: LoadingView<xPayload>,
		ready: (payload: xPayload) => TemplateResult,
	) {
	return loadingView.select<TemplateResult>({
		none: () => null,
		loading: () => html`<p>loading</p>`,
		error: reason => html`<p>${reason}</p>`,
		ready,
	})
}

@mixinStyles(styles)
export class AuthPanel extends WiredComponent<AuthModel> {

	private sendLoginLink() {
		this.share.sendLoginLink("chasemoskal@gmail.com")
	}

	private logout() {
		this.share.logout()
	}

	render() {
		const accessLoadingView = this.share.getAccessLoadingView()
		return renderLoading(accessLoadingView, access => {
			if (access)
				return html`
					<p>logged in as ${accessLoadingView.payload.user.profile.nickname}</p>
					<button @click=${this.logout}>Logout</button>
				`
			else
				return html`
					<p>logged out</p>
					<button @click=${this.sendLoginLink}>Send login link</button>
				`
		})
	}
}
