
import {css} from "../../../framework/component2/component2.js"

export default css`

:host {
	display: inline-block;
	width: var(--avatar-size, 3em);
	height: var(--avatar-size, 3em);
	border-radius: var(--avatar-border-radius, 0.3em);
	overflow: hidden;
	user-select: none;
}

.avatar {
	display: block;
	width: 100%;
	height: 100%;
	color: #444;
	background: #888;
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
