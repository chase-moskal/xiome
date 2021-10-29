
import {css} from "../../../../framework/component.js"
export default css`

:host {
	display: inline-block;
	--xiome-notes-indicator-size: 1em;
	--xiome-notes-indicator-color: red;
	--xiome-notes-indicator-bleedout: -0.4em;
	width: 3em;
	height: 3em;
	position: relative;
}
:host([no-icon]) .bell {
	display: none;
}

:host([no-icon]) .count {
	right: var(--xiome-notes-indicator-bleedout);
	top: var(--xiome-notes-indicator-bleedout);
}

xiome-notes-indicator {
	width: var(--xiome-notes-indicator-size)
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
	right: 5px;
	font-weight: bold;
	color: white;
}
`
