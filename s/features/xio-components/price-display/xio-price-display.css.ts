
import {css} from "@chasemoskal/magical"
export default css`

:host {
	display: block;
	width: 100%;
	max-width: 48rem;
}

.card {
	display: flex;
	width: fit-content;
	margin: 0 auto;
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
		text-transform: uppercase;
	}

	.vertical {
		font-size: 0.7em;
		text-orientation: upright;
		writing-mode: vertical-rl;
		text-align: center;
		letter-spacing: -0.2em;
	}
}
`
