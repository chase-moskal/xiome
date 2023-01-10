
import {css} from "@chasemoskal/magical"
export default css`

:host {
	max-width: max-content;

	display: flex;
	flex-direction: column;
	justify-content: space-between;

	font: inherit;
	color: inherit;

	border: 1px solid;
	border-radius: 3px;
}

:host > div {
	padding: 0.5em;
}

[part~="tier_details"] {
	position: relative;

	text-align: center;
	flex-basis: 50%;

	[part~="tier_label"] {
		font-size: 1.5em;
	}

	[part~="tier_icon"] {
		position: absolute;
		top: -0.75em;
		right: -0.75em;
		width: 1.5em;
		height: 1.5em;
		padding: 0.2em;
		border-radius: 1em;
		background: currentColor;
		svg, [part~="tier_icon_content"] {
			width: 100%;
			height: 100%;
		}
		[part~="tier_icon_content"] { color: blue; }
		^[data-icon="check"] [part~="tier_icon_content"] { color: green; }
		^[data-icon="x"] [part~="tier_icon_content"] { color: red; }
		^[data-icon="warning"] [part~="tier_icon_content"] { color: orange; }
	}
}

[part~="tier_info"] {
	display: flex;
	flex-basis: 50%;
	align-items: center;
	flex-direction: column;
	justify-content: flex-end;
	gap: 0.2rem;
	background: #fff2;

	[part~="tier_button"] {
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

`
