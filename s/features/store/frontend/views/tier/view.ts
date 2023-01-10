
import {html} from "lit"
import {view} from "@chasemoskal/magical"

import {getStatusIcon} from "./utils/get-status-icon.js"
import {getButtonLabel} from "./utils/get-button-label.js"
import {getStatusLabel} from "./utils/get-status-label.js"
import {TierBasics, TierButton, TierContext, TierInteractivity} from "./types.js"
import {centsToDollars} from "../../components/subscription-planning/ui/price-utils.js"

import styles from "./styles.js"

export const TierView = view({
		styles,
		shadow: false,
	}, use => ({
		basics: {tier, pricing},
		context: {isSubscribedToThisTier, status},
		interactivity,
	}: {
		basics: TierBasics
		context: TierContext
		interactivity: TierInteractivity | undefined
	}) => {

	const hasPricing = !!tier.pricing
	const recurringInterval = pricing?.interval === "month"
		? "monthly"
		: "yearly"

	const icon = getStatusIcon(status)
	const statusLabel = getStatusLabel(status)

	const statusify = (part: string) => `${part} ${part}_${statusLabel}`
	
	function renderButton() {

		const buttonLabel = getButtonLabel(interactivity.button)
		const buttonify = (part: string) => `${part} ${part}_${buttonLabel}`

		return html`
			<button part="${buttonify("tier_button")}" @click=${interactivity.action}>
				${buttonLabel}
			</button>
		`
	}

	return html`
		<div
			part="${statusify("tier")}"
			data-tier="${tier.tierId}"
			?data-subscribed=${isSubscribedToThisTier}>

			<slot name="${tier.tierId}"></slot>

			<div part="${statusify("tier_details")}">
				${
					icon
						? html`
							<div part="${statusify("tier_icon")}" data-icon="${icon.name}">
								<div part="${statusify("tier_icon_content")}">
									${icon.svg}
								</div>
							</div>`
						: null
				}
				<h4 part="${statusify("tier_label")}">${tier.label}</h4>
				<xio-price-display
					unit-superscript
					value="${centsToDollars(pricing.price)}">
						${tier.label}
				</xio-price-display>
				<p>${recurringInterval}</p>
			</div>

			<div part="${statusify("tier_info")}">
				<span part="${statusify("tier_status")}">${statusLabel}</span>
				${interactivity
					? renderButton()
					: null}
			</div>
		</div>
	`
})
