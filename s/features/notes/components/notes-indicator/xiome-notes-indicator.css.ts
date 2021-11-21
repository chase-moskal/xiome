
import {css} from "../../../../framework/component.js"
export default css`

:host {
	display: inline-block;
	--xiome-notes-indicator-count-size: 1em;
	--xiome-notes-indicator-color: red;
	--xiome-notes-indicator-bleedout: 0em;
	font-size: var(--xiome-notes-indicator-size, 1em);
	width: var(--xiome-notes-indicator-icon-size, 3em);
	position: relative;
}

:host([no-icon]) .bell {
	display: none;
}

.count {
	display: flex;
	justify-content: center;
	align-items: center;
	vertical-align: top;
	position: absolute;
	height: 1em;
	width: 1em;
	background-color: var(--xiome-notes-indicator-color);
	border-radius: 50%;
	text-align: center;
	right: var(--xiome-notes-indicator-bleedout);
	top: var(--xiome-notes-indicator-bleedout);
	font-weight: bold;
	color: white;
	font-size: var(--xiome-notes-indicator-count-size);
}
`
