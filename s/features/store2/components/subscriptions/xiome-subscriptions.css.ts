
import {css} from "@chasemoskal/magical/x/camel-css/camel-css-lit.js"

export default css`

ol, ul {
	list-style: none;
}

.plans > li {
	margin-top: 1em;
}

.tiers {
	display: flex;
	flex-direction: row;
	gap: 0.5em;
	align-items: stretch;
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
