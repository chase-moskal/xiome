
import {css} from "../../../framework/component.js"
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
	border: 1px dashed;
	padding: 2rem 1rem;
}

.display {
	font-size: 2rem;
	text-align: center;
	display: flex;
	align-items: center;
	gap: 0.2em;
}

.symbol, strong {
	transform: scale(1, 1.4);
}

.superscript {
	position: relative;
	font-size: 1em;
}

.superscript > strong {
	display: inline-block;
	margin-right: 0.7em;
}

.superscript > span {
	position: absolute;
	right: 0px;
	font-size: 0.7em;
}

.currency,
.symbol {
	opacity: 0.4;
	user-select: none;
}

.currency {
	font-size: 0.6em;
	line-height: 1;
	margin-left: -0.5rem;
	transform: rotate(90deg);
}
`
