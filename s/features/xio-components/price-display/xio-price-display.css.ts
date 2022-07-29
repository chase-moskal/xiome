
import {css} from "@chasemoskal/magical/x/camel-css/camel-css-lit.js"
export default css`

:host {
	display: block;
	width: 100%;
	max-width: 48rem;
}

.card {
	display: flex;
	width: fit-content;
	align-self: flex-start;
}

.display {
	font-size: 1.2rem;
	display: flex;

	strong {
		font-size: 2em;
		line-height: 1;
	}

	.superscript {
		font-size: 1em;
		margin-top: 0.1em;
	}

	.symbol {
		opacity: 0.4;
		font-size: 1em;
		align-self: center;
		margin-right: 0.2em;
		user-select: none;
	}

	.currency {
		opacity: 0.4;
		font-size: 1em;
		margin-top: 0.1em;
		margin-left: 0.3em;
		user-select: none;
	}

	.vertical {
		font-size: 0.7em;
		text-orientation: upright;
		writing-mode: vertical-rl;
		text-align: center;
		letter-spacing: -0.2em;
	}
}

/*
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
*/
`
