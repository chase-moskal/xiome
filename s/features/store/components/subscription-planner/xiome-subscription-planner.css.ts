
import {css} from "../../../../framework/component2/component2.js"
export default css`

.plans {
	list-style: none;
}

.plans > li {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	margin-top: 1rem;
	border: 1px solid;
}

.plans > li > * {
	flex: 1 1 auto;
	padding: 0.5em;
}

.planinfo {
	width: 32em;
}

.planinfo > * + * {
	margin-top: 0.5rem;
}

.planinfo .label {
	font-size: 1.5em;
}

.planinfo .label::before {
	content: "🗓️";
	display: inline-block;
	margin-right: 0.5em;
}

.planinfo .price {
	font-size: 1.5em;
}

.planinfo .activity {
	max-width: 32em;
}

.planinfo .activity-indicator {
	display: inline-block;
	color: white;
	background: red;
	padding: 0.2em;
	border-radius: 0.5em;
}

.plans > li[data-active] .planinfo .activity .activity-indicator {
	background: green !important;
}

.plancontrols {
	flex: 0 1 auto;
	max-width: 15em;
}

.plancontrols > * + * {
	margin-top: 0.5em;
}

/* generic */

.identifier {
	display: inline-flex;
	flex-direction: column;
	background: #0002;
	border-radius: 0.3em;
	padding: 0.2em;
	text-align: center;
}

.identifier-label {
	padding: 0.2em;
}

.identifier-id {
	width: 8em;
	padding: 0.2em;
	overflow: hidden;
	text-overflow: ellipsis;
	background: #0002;
	border-radius: 0.3em;
}

`
