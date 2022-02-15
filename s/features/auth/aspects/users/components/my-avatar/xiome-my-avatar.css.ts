
import {css} from "../../../../../../framework/component.js"
export default css`

:host {
	display: block;
	width: var(--avatar-size, 2em);
	height: var(--avatar-size, 2em);
}

:host([logged-in]) .avatar {
	color: #fff;
}

`
