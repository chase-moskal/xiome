
import {css} from "../../../../framework/component.js"
export default css`

:host {
	display: block;
}

[data-tab] {
  font-weight: normal;
}

[data-tab][data-active='true'] {
  font-weight: bold;
	color: bisque;
}
`
