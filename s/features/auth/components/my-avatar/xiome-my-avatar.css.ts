
import {css} from "../../../../framework/component2/component2.js"
export default css`

.avatar {
	display: block;
	width: 3em;
	height: 3em;
	padding: 0.2em;
	border-radius: 0.3em;
	color: #333;
	background: #4448;
}

:host([logged-in]) .avatar {
	color: #fff;
}

svg {
	display: block;
	width: 100%;
	height: 100%;
}

`
