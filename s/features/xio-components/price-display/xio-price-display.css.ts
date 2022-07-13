
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
	text-align: center;
}

.display > div {
	position: relative;
	font-size: 3rem;
}

strong {
	display: inline-block;
	transform: scale(1, 1.4);
	margin-right: 0.7em;
}

.superscript {
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
	font-size: 2em;
	letter-spacing: 5px;
}
`
