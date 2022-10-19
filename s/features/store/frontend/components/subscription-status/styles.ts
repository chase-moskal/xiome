
import {css} from "@chasemoskal/magical/x/camel-css/camel-css-lit.js"
export default css`

:host {
	display: block;
	width: max-content;
	border-radius: 5px;
}

.subscriptions {
	display: flex;
	gap: 1.5rem;
	padding-block: 1rem;

	.status_card {
		width: max-content;

		.tier_details {
			display: flex;
			flex-direction: column;
			width: max-content;
			border: 1px solid;
			text-align: center;
			position: relative;

			.tier_label {
				font-size: 1.5rem;
				text-transform: capitalize;
				margin-block: 0.4rem;
			}

			> xio-price-display {
				padding-inline: 0.5em;
			}

			.status_label {
				padding: 0.5em;
				margin-top: 0.7em;
				background: #ffffff22;
			}

			.status_icon{
				position: absolute;
				top: -10%;
				right: -10%;
				width: 30px;
				aspect-ratio: 1/1;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: #373737;
			}

			[data-status="purchased"] {
				color: green;
			}

			[data-status="cancelled"] {
				color: red;
			}
		}
	}
}
`
