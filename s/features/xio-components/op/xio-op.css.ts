
import {css} from "../../../framework/component.js"
export default css`

slot {
	vertical-align: middle;
}

svg, span {
	display: inline-block;
	vertical-align: middle;
}

svg {
	width: var(--op-size, 1.2em);
	height: var(--op-size, 1.2em);
}

slot[name=loading] svg {
	animation:
		spin 10s linear infinite,
		fade 500ms ease infinite alternate;
}

slot[name=error] * {
	color: var(--loading-error-color, red);
}

@keyframes spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

@keyframes fade {
	from { opacity: 1.0; }
	to { opacity: 0.5; }
}

`
