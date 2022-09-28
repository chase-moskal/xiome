
import {Op} from "../../../../../framework/ops.js"
import {ops} from "../../../../../framework/ops.js"
import {html} from "../../../../../framework/component.js"
import {makeStoreModel} from "../../../models/store-model.js"
import {SubscriptionTier} from "../../../types/store-concepts.js"
import {renderOp} from "../../../../../framework/op-rendering/render-op.js"
import {centsToDollars} from "../../subscription-planning/ui/price-utils.js"
import {ModalSystem} from "../../../../../assembly/frontend/modal/types/modal-system.js"

export function preparePurchaseActions({
		modals, buttonLabel, tier, storeModel
	}:{
		modals: ModalSystem
		buttonLabel: string
		tier: SubscriptionTier
		storeModel: ReturnType<typeof makeStoreModel>
	}) {

	const {tierId} = tier
	const {subscriptions} = storeModel

	return {
		upgradeOrDowngrade: async () => {
			let op: Op<void> = ops.ready(undefined)
			function setOp(newOp: Op<void>) {
				op = newOp
				popup.controls.rerender()
			}
			const popup = modals.popup({
				focusNthElement: 1,
				renderContent: (controls) => {
					const isError = ops.isError(op)
					return html`
						<h2>${buttonLabel}</h2>
						${renderOp(op,
							() => html`
								<div data-confirm>
									<p>are you sure you want to ${buttonLabel} your subscription to <strong>${tier.label}</strong> for $${centsToDollars(tier.pricing.price)}/month?</p>
									<div data-buttons>
										<xio-button
											focusable
											data-button=yes
											data-vibe="positive"
											@press=${async() => {
											await ops.operation({
												promise: subscriptions.purchase({
													tierId, showLoadingSpinner: true
												}),
												setOp,
											})
											controls.close()}}>
												yes
										</xio-button>
										<xio-button
											focusable
											data-button=no
											data-vibe="neutral"
											@press=${controls.close}>
												no
										</xio-button>
									</div>
								</div>
							`,
							null,
							{loadingMessage: `switching to ${tier.label}`}
						)}
						${isError
							? html `
									<div data-buttons>
										<xio-button
											focusable
											data-button=no
											data-vibe="neutral"
											@press=${controls.close}>
												ok
										</xio-button>
									</div>
							`
							: null
						}
					`
				},
				onBlanketClick(controls) {
					const isLoading = ops.isLoading(op)
					if(!isLoading)
						controls.close()
				},
			})
		},
		buySubscriptionWithCheckoutPopup: async () => {
			await subscriptions.purchase({tierId})
		},
		buySubscriptionWithExistingPaymentMethod: async () => {
			const proceedWithPurchase = await modals.confirm({
				title: `${buttonLabel} subscription`,
				body: html`are you sure you want to ${buttonLabel} <strong>${tier.label}</strong> for $${centsToDollars(tier.pricing.price)}/month?`
			})
			if(proceedWithPurchase) await subscriptions.purchase({tierId})
		}
	}
}
