
import {css} from "@chasemoskal/magical/x/camel-css/camel-css-lit.js"
export default css`

	.tier {
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		font: inherit;
		color: inherit;

		border: 1px solid;
		border-radius: 3px;

		> div {
			padding: 0.5em;
		}

		.details {
			position: relative;

			text-align: center;
			flex-basis: 50%;

			h2 {
				font-weight: 100;
				margin-bottom: 0.3em;
				text-transform: capitalize;
			}

			.icon {
				position: absolute;
				top: -0.75rem;
				right: -0.75rem;
				width: 1.5rem;
				height: 1.5rem;
				padding: 0.2rem;
				border-radius: 1rem;
				background: currentColor;
				svg {
					width: 100%;
					height: 100%;
					color: blue;
				}
				^[data-icon="check"] svg { color: green; }
				^[data-icon="x"] svg { color: red; }
				^[data-icon="warning"] svg { color: orange; }
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
