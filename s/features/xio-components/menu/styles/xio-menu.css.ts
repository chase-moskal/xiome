
import {css} from "../../../../framework/component.js"
export default css`

.system {
	position: static;
	margin: var(--menu-margin, auto);
}

:host([theme="concrete"]) .system {
	display: flex;
	align-items: flex-end;
	justify-content: flex-end;
}

:host([theme="concrete"][sticky]) .system {
	pointer-events: none;
	position: absolute;
	width: 100%;
	right: 0;
}

:host([theme="concrete"][sticky]) .system > * {
	pointer-events: all;
}

:host([theme="concrete"][lefty]) .system {
	right: auto;
	left: 0;
	align-items: flex-start;
	justify-content: flex-start;
}

:host([theme="concrete"]) [part="blanket"] {
	z-index: 99;
	display: none;
	position: fixed;
	background: var(--menu-blanket-background, rgba(0,0,0, 0.5));
	backdrop-filter: var(--menu-blanket-backdrop-filter, blur(5px));
	--webkit-backdrop-filter: var(--menu-blanket-backdrop-filter, blur(5px));
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
}

:host([theme="concrete"][active]) [part="blanket"] {
	display: block;
}

:host([theme="concrete"]) [part="list"] {
	z-index: 100;
	display: flex;
	align-items: flex-end;
	justify-content: flex-end;
	padding: var(--menu-padding, 0.15rem);
	background: var(--menu-background, rgba(240, 240, 240, 0.5));
	border-radius: var(--menu-border-radius, 0);
}

:host([theme="concrete"][sticky]) [part="list"] {
	margin-right: var(--menu-lanesize, 1rem);
}

:host([theme="concrete"][sticky][lefty]) [part="list"] {
	margin-right: unset;
	margin-left: var(--menu-lanesize, 1rem);
}

:host([theme="concrete"]) [part="list"] slot::slotted(menu-item) {
	display: block;
	flex: 0 0 auto;
}

`
