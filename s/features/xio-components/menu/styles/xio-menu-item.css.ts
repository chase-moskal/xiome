
import {css} from "../../../../framework/component.js"
export default css`

:host {
	display: block;
	width: 2em;
	height: 2em;
}

:host([theme="concrete"]) [part="button"] {
	display: block;
	font-size: inherit;
	color: inherit;
	position: relative;
	padding: 0;
	border: none;
	background: transparent;
	width: 100%;
	height: 100%;
}

:host([theme="concrete"]) [part="buttoncontent"] {
	display: flex;
	width: 100%;
	height: 100%;
	justify-content: center;
	align-items: center;
}

:host([theme="concrete"]) [part="buttoncontent"] {
	transform: scale(1);
	transition: transform 100ms ease;
}

:host([theme="concrete"]) [part="buttoncontent"]:active {
	transform: scale(1.1);
}

[part="panel"] {
	display: none;
}

:host([open]) [part="panel"] {
	display: block;
}

:host([theme="concrete"]) [part="panel"] {
	position: absolute;
	left: var(--menu-lanesize, 1rem);
	right: var(--menu-lanesize, 1rem);
	width: var(--menu-panel-width, 640px);
	max-width: calc(100% - calc(var(--menu-lanesize, 1rem) * 2));
	margin-top: var(--menu-padding, 0.15rem);
	margin-left: auto;
	padding: var(--menu-panel-padding, 1rem);
	background: var(--menu-panel-background, white);
	border-radius: var(--menu-panel-border-radius, 0);
	box-shadow: var(--menu-panel-box-shadow, none);
	backdrop-filter: var(--menu-panel-backdrop-filter, none);
	--webkit-backdrop-filter: var(--menu-panel-backdrop-filter, none);
}

:host([theme="concrete"][sticky]) [part="panel"] {
	top: 100%;
}

:host([theme="concrete"][lefty]) [part="panel"] {
	margin-left: unset;
	margin-right: auto;
}

`
