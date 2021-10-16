
import {css} from "../../../../framework/component.js"
export default css`

:host {
	display: block;
}


.linkbox{
	width: max-content;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
}


xio-button.helpBtn{
	padding: 5px 3px;
}

xio-button.linkBtn{
	margin-right: 165px;
	padding: 5px 3px;
}

div.failed{
	color: red;
	display: flex;
}

div.linked{
	display: flex;
}

div.helpbox ul{
	margin-left: 16px;
}

.parent-container{
	max-width: max-content;
	border: 1px solid;
	border-radius: 5px;
}

.child-container{
	margin : 10px 5px;
}
`
