
import {css} from "../../../framework/component.js"

export default css`

:host {
	display: inline-block;
	width: var(--avatar-size, 2em);
	height: var(--avatar-size, 2em);
	border-radius: var(--avatar-border-radius, 0.3em);
	overflow: hidden;
	user-select: none;
}

.avatar {
	display: block;
	width: 100%;
	height: 100%;
	color: var(--xio-avatar-color, #444);
	background: var(--xio-avatar-background, #888);
}

.avatar[data-logged-in] {
	color: #fff;
}

svg, img {
	pointer-events: none;
	display: block;
	width: 100%;
	height: 100%;
	object-fit: cover;
}

`
