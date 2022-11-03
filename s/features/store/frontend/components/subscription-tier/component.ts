
import {html} from "lit"

import {examples} from "./example-data.js"
import {SubscriptionStatus} from "../../../isomorphic/concepts.js"
import {component} from "../../../../../toolbox/magical-component.js"
import {getStatusIcon} from "../../views/tier/utils/get-status-icon.js"
import {getButtonLabel} from "../../views/tier/utils/get-button-label.js"
import {getStatusLabel} from "../../views/tier/utils/get-status-label.js"
import {centsToDollars} from "../subscription-planning/ui/price-utils.js"
import {TierBasics, TierContext, TierInteractivity} from "../../views/tier/types.js"

import styles from "./styles.js"

export const XiomeStoreSubscriptionTier =

component<{
	basics: TierBasics
	context: TierContext
	interactivity: TierInteractivity | undefined
}>({
	styles,
	shadow: true,
	properties: {
		basics: {type: Object},
		context: {type: Object},
		interactivity: {type: Object},
	},
},

use => {
	const {
		basics: {tier, pricing} = examples.basics,
		context: {status, isSubscribedToThisTier} = examples.context,
		interactivity,
	} = use.element

	const recurringInterval = pricing?.interval === "month"
		? "monthly"
		: "yearly"

	const icon = getStatusIcon(status)
	const statusLabel = getStatusLabel(status)

	use.attr.string["data-tier"] = tier.tierId
	use.attr.string["data-status"] = statusLabel
	use.attr.boolean["data-subscribed"] = isSubscribedToThisTier

	function renderButton() {
		const buttonLabel = getButtonLabel(interactivity!.button)
		const buttonify = (part: string) => `${part} ${part}_${buttonLabel}`
		return html`
			<button part="${buttonify("tier_button")}" @click=${interactivity!.action}>
				${buttonLabel}
			</button>
		`
	}

	return html`
		<div part=tier_details>
			${
				icon
					? html`
						<div part=tier_icon data-icon="${icon.name}">
							<div part=tier_icon_content>
								${icon.svg}
							</div>
						</div>
					`
					: null
			}
			<h4 part=tier_label>${tier.label}</h4>
			<slot></slot>
			${pricing
				? html`
					<xio-price-display
						unit-superscript
						value="${centsToDollars(pricing.price)}">
							${tier.label}
					</xio-price-display>
					<p>${recurringInterval}</p>
				`
				: html`
					<p style="color: red">price not set</p>
				`}
		</div>

		<div part=tier_info>
			${
				status !== SubscriptionStatus.Unsubscribed
					? html`<span part=tier_status>${statusLabel}</span>`
					: undefined
			}
			${
				interactivity
					? renderButton()
					: undefined
			}
		</div>
	`
})
