
import {css} from "../../../../framework/component.js"
export default css`

:host {
	display: inline-block;
	--xiome-notes-indicator-size: 1em;
	--xiome-notes-indicator-color: red;
	--xiome-notes-indicator-bleedout: 0em;
	width: 3em;
	height: 3em;
	position: relative;
}

:host([no-icon]) .bell {
	display: none;
}

xiome-notes-indicator {
	width: var(--xiome-notes-indicator-size);
}

.count {
	vertical-align: top;
	position: absolute;
	height: var(--xiome-notes-indicator-size);
	width: var(--xiome-notes-indicator-size);
	background-color: var(--xiome-notes-indicator-color);
	border-radius: 50%;
	display: inline-block;
	text-align: center;
	right: var(--xiome-notes-indicator-bleedout: 0em);
	top: var(--xiome-notes-indicator-bleedout: 0em);
	font-weight: bold;
	color: white;
}
`
