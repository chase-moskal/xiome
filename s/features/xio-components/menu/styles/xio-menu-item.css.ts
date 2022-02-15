
import {css} from "../../../../framework/component.js"
export default css`

*:focus {
	outline: var(--focus-outline, 2px solid #0af);
}

:host {
	display: block;
	margin: var(--menu-gapsize, 0.15rem);
	width: 2em;
	height: 2em;
}

:host-context([theme="concrete"]) [part="button"] {
	font-size: inherit;
	color: inherit;
	position: relative;
	display: block;
	padding: 0;
	border: none;
	background: transparent;
	width: 100%;
	height: 100%;
}

[part="panel"] {
	display: none;
}

:host([open]) [part="panel"] {
	display: block;
}

:host-context([theme="concrete"]) [part="panel"] {
	position: absolute;
	left: var(--menu-lanesize, 1rem);
	right: var(--menu-lanesize, 1rem);
	width: var(--menu-panel-width, 640px);
	max-width: calc(100% - calc(var(--menu-lanesize, 1rem) * 2));
	margin-top: var(--menu-gapsize, 0.15rem);
	margin-left: auto;
	padding: var(--menu-panel-padding, 1rem);
	background: var(--menu-panel-background, white);
	border-radius: var(--menu-panel-border-radius, 0);
	box-shadow: var(--menu-panel-box-shadow, none);
	backdrop-filter: var(--menu-panel-backdrop-filter, none);
	--webkit-backdrop-filter: var(--menu-panel-backdrop-filter, none);
}

:host-context([theme="concrete"][sticky]) [part="panel"] {
	top: 100%;
}

:host-context([theme="concrete"][lefty]) [part="panel"] {
	margin-left: unset;
	margin-right: auto;
}

`
