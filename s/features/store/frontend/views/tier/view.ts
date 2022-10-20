
import {html} from "lit"
import {view} from "@chasemoskal/magical/x/view/view.js"

import {getButtonLabel} from "./utils/get-button-label.js"
import {getStatusLabel} from "./utils/get-status-label.js"
import {TierBasics, TierContext, TierInteractivity} from "./types.js"
import {centsToDollars} from "../../components/subscription-planning/ui/price-utils.js"

import styles from "./styles.js"

export const TierView = view(use => ({
		basics: {tier},
		context: {isSubscribedToThisTier, status},
		interactivity,
	}: {
		basics: TierBasics
		context: TierContext
		interactivity: TierInteractivity | undefined
	}) => {

	return html`
		<div
			class="tier"
			data-tier=${tier.tierId}
			?data-subscribed=${isSubscribedToThisTier}>

			<slot name="${tier.tierId}"></slot>

			<div class=details>
				<h2>${tier.label}</h2>
				<xio-price-display
					unit-superscript
					value=${centsToDollars(tier.pricing[0].price)}>
					${tier.label}
				</xio-price-display>
				<p>monthly</p>
			</div>

			${
				interactivity
					? html`
						<div class=label>
							<div class=state>
								${getStatusLabel(status)}
							</div>
							<button @click=${interactivity.action}>
								${getButtonLabel(interactivity.button)}
							</button>
						</div>
					`
					: null
			}
		</div>
	`
})

TierView.shadow = true
TierView.css = styles
