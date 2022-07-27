
import {css} from "@chasemoskal/magical/x/camel-css/camel-css-lit.js"
export default css`

:host {
	display: block;
	width: 100%;
	max-width: 48rem;
}

.card2 {
	display: flex;
	width: fit-content;
	align-self: flex-start;
}

.display {
	font-size: 2rem;
	text-align: center;
	display: flex;
	gap: 0.2em;

	.symbol, strong {
		transform: scale(1, 1.4);
	}

	.currency, .symbol {
		opacity: 0.4;
		user-select: none;
	}

	.currency {
		font-size: 0.6em;
		line-height: 1;
		margin-left: -1.2rem;
		transform: rotate(90deg);
	}
}

.superscript {
	position: relative;
	font-size: 1em;

	strong{
		display: inline-block;
		margin-right: 0.7em;
	}

	span {
		position: absolute;
		right: 0px;
		font-size: 0.7em;
	}
}
`
