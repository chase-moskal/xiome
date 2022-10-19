
import {html} from "lit"
import {view} from "@chasemoskal/magical/x/view/view.js"
import {css} from "@chasemoskal/magical/x/camel-css/camel-css-lit.js"

import {TierInfo} from "../utils/apprehend-tier-info.js"
import {SubscriptionTier} from "../../isomorphic/concepts.js"
import {centsToDollars} from "../components/subscription-planning/ui/price-utils.js"

export const RenderTier = view(use => ({
		info,
		tier,
		isSubscribedToThisTier,
	}: {
		info: TierInfo | undefined
		tier: SubscriptionTier
		isSubscribedToThisTier: boolean
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
					vertical-currency
					value=${centsToDollars(tier.pricing[0].price)}>
					${tier.label}
				</xio-price-display>
				<p>monthly</p>
			</div>

			${
				info ? html`
					<div class=label>
						${info.stateLabel}
						<button @click=${info.action}>
							${info.buttonLabel}
						</button>
					</div>
				` : null
			}
		</div>
	`
})

RenderTier.shadow = true

RenderTier.css = css`
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	.tier {
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		heigth: 8rem;
		font: inherit;
		color: inherit;

		border: 1px solid;
		border-radius: 3px;

		> div {
			padding: 0.5em;
		}

		.details {
			text-align: center;
			flex-basis: 50%;

			h2 {
				font-weight: 100;
				margin-bottom: 0.3em;
				text-transform: capitalize;
			}
		}

		.label {
			display: flex;
			flex-basis: 50%;
			align-items: center;
			flex-direction: column;
			justify-content: flex-end;
			gap: 0.2rem;
			background: #fff2;

			button {
				padding: 0.3rem;
				border: 1px solid;
				border-radius: 5px;
				cursor: pointer;
				color: inherit;
				background: transparent;
				opacity: 0.7;
			
				^:is(:hover, :focus) {
					opacity: 1;
				}
			}
		}
	}
`
