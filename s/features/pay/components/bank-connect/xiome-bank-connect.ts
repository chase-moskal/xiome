
import styles from "./xiome-bank-connect.css.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {WiredComponent, mixinStyles, html, property} from "../../../../framework/component.js"
import {renderWrappedInLoading} from "../../../../framework/loading/render-wrapped-in-loading.js"
import {BankModel} from "../../models/bank-manager/types/bank-model.js"
import {mobxify} from "../../../../framework/mobxify.js"
import {loading} from "../../../../framework/loading/loading.js"
import {StripeAccountDetails} from "../../topics/types/stripe-account-details.js"
import {AuthModel} from "../../../auth/models/types/auth/auth-model.js"

@mixinStyles(styles)
export class XiomeBankConnect extends WiredComponent<{
		modals: ModalSystem
		authModel: AuthModel
		bankModel: BankModel
	}> {

	@property({type: String, reflect: true})
	appId: string

	private state = mobxify({
		stripeAccountDetailsLoading: loading<StripeAccountDetails>()
	})

	async firstUpdated() {
		const loadingActions = this.state.stripeAccountDetailsLoading.actions
		if (this.appId) {
			loadingActions.setLoadingUntil({
				errorReason: "error loading stripe account details",
				promise: this.share.bankModel.getStripeAccountDetails(this.appId),
			})
		}
		else {
			const errorReason = "missing appId for xiome-bank-connect"
			loadingActions.setError(errorReason)
			console.warn(errorReason)
		}
	}

	// TODO implement
	private async clickSetupPayouts() {
		const links = await this.share.bankModel.createStripeAccountPopup(this.appId)
		console.log("links!", links)
	}

	private renderCreateOrEditAccount() {
		return html`
			<div>
				<xio-button @press=${this.clickSetupPayouts}>setup payouts</xio-button>
			</div>
		`
	}

	private renderDetails(details: StripeAccountDetails) {
		return html`
			<p>stripe email: ${details.email}</p>
			<p>stripe account id: ${details.stripeAccountId}</p>
			<p>details submitted: ${details.detailsSubmitted}</p>
			<p>payouts enabled: ${details.payoutsEnabled}</p>
			${this.renderCreateOrEditAccount()}
		`
	}

	private renderNoAccount() {
		return html`
			<p>no banking info linked</p>
			${this.renderCreateOrEditAccount()}
		`
	}

	render() {
		this.share.authModel
		return renderWrappedInLoading(
			this.state.stripeAccountDetailsLoading.view,
			details => details
				? this.renderDetails(details)
				: this.renderNoAccount(),
		)
	}
}
