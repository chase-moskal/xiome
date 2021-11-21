
import styles from "./xiome-bank-connect.css.js"
import {onesie} from "../../../../toolbox/onesie.js"
import {Op, ops} from "../../../../framework/ops.js"
import {makeStoreModel} from "../../model/store-model.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {StripeAccountDetails} from "../../api/services/types/stripe-account-details.js"
import {AutowatcherComponentWithShare, mixinStyles, html, property} from "../../../../framework/component.js"

@mixinStyles(styles)
export class XiomeBankConnect extends AutowatcherComponentWithShare<{
		modals: ModalSystem
		bank: ReturnType<typeof makeStoreModel>["shares"]["bank"]
	}> {

	@property({type: String, reflect: true})
	private appId: string

	@property({type: Object})
	private stripeAccountDetails: Op<StripeAccountDetails> = ops.loading()

	private refreshStripeAccountDetails = onesie(async() => {
		if (this.appId) {
			ops.operation({
				setOp: op => this.stripeAccountDetails = op,
				promise: this.share.bank.getStripeAccountDetails()
					.then(details => {
						this.requestUpdate()
						return details
					}),
			})
		}
		else {
			const errorReason = "missing appId for xiome-bank-connect"
			this.stripeAccountDetails = ops.error(errorReason)
			console.warn(errorReason)
		}
	})

	async init() {
		await this.refreshStripeAccountDetails()
	}

	// TODO implement
	private async clickSetupPayouts() {
		await this.share.bank.setupStripeAccount()
		await this.refreshStripeAccountDetails()
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
			<p>stripe account id: <xio-id id=${details.stripeAccountId}></xio-id></p>
			<p>details submitted: ${details.details_submitted}</p>
			<p>payouts enabled: ${details.payouts_enabled}</p>
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
		return renderOp(
			this.stripeAccountDetails,
			details => details
				? this.renderDetails(details)
				: this.renderNoAccount()
		)
	}
}
