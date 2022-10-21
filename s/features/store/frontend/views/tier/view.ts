
import {html} from "lit"
import {view} from "@chasemoskal/magical/x/view/view.js"

import {getStatusIcon} from "./utils/get-status-icon.js"
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

	const [pricing] = tier.pricing
	const recurringInterval = pricing.interval === "month"
		? "monthly"
		: "yearly"

	const icon = getStatusIcon(status)

	return html`
		<div
			part=tier
			data-tier="${tier.tierId}"
			?data-subscribed=${isSubscribedToThisTier}>

			<slot name="${tier.tierId}"></slot>

			<div part=tier_details>
				${
					icon
						? html`
							<div part=tier_icon data-icon="${icon.name}">
								<div part=tier_icon_content>
									${icon.svg}
								</div>
							</div>`
						: null
				}
				<h4 part=tier_label>${tier.label}</h4>
				<xio-price-display
					unit-superscript
					value="${centsToDollars(pricing.price)}">
						${tier.label}
				</xio-price-display>
				<p>${recurringInterval}</p>
			</div>

			<div part=tier_info>
				<span part=tier_status>${getStatusLabel(status)}</span>
				${
					interactivity
						? html`
							<button part=tier_button @click=${interactivity.action}>
								${getButtonLabel(interactivity.button)}
							</button>
						`
						: null
				}
			</div>
		</div>
	`
})

TierView.shadow = false
TierView.css = styles
