
import {css} from "@chasemoskal/magical"
export default css`xiome-store-subscription-catalog {

:is(ol, ul) {
	list-style: none;
}

[data-plans] > li {
	margin-top: 1em;
}

[data-tiers] {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 0.5em;
	align-items: stretch;
	> span {
		display: block;
	}
	> * {
		max-width: 100%;
	}
}

[data-plan-label] {
	font-size: 1em;
	padding-bottom: 0.2em;
}

}`
