
import {css} from "../../../../../../framework/component.js"
export default css`

:host {
	display: block;
	width: var(--avatar-size, 2em);
	height: var(--avatar-size, 2em);
	--op-size: calc(var(--avatar-size, 2em) * 0.5);
}

xio-op {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
}

:host([logged-in]) .avatar {
	color: #fff;
}

`
