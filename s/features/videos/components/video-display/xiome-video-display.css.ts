
import {css} from "../../../../framework/component.js"
export default css`

:host {
	display: block;
	--blackBg: inherit;
}

iframe {
	width: 100%;
	height: 100%;
	border: none;
}


.mock-embed img {
	width: 100%;
}
	xio-button div {
		display: flex;
		padding: 5px;
	}

.open {
	transform: rotate(180deg);
	--_border: none;
}

xio-button div {display: flex}

xio-button {
	--_border: none;
	--_padding: var(--xio-button-padding, 0.5em 0.5em);
	--_disabled-border-style: var(--xio-button--disabled-border-style, solid);
	margin: 20px;
	font-size: clamp(16px, 4vw, 22px);
}

.xio-box {text-align: right}

h2 {margin-top: 20px}

h2 span {
	font-size: 40px;
	margin-right: 40px;
}

select {background-color: var(--blackBg)}

select option {
	background-color: #333;
	padding: 15px;
}

.create-button:not([disabled]) {border: 4px solid #999}

.create-view {
	margin-top: 10px;
	border: 1px solid #999;
	display: flex;
	flex-direction: column;
	row-gap: 2em;
}

.create-view .flex-box {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	column-gap: 2em;
}
.p-assign {
	font-size: 25px;
	padding: 20px;
}

.create-content {
	margin: 10px;
}

.create-content select {
	padding: 15px;
	width: 300px;
	font-size: 20px;
}

.create-privileges {
	margin: 10px;
	max-width: 400px;
}

.create-privileges option {
	font-size: 20px;
}

select:focus {outline:none}
::-webkit-scrollbar {width: 10px}
::-webkit-scrollbar-thumb {background: #888}
::-webkit-scrollbar-thumb:hover {background: #555}

/* When video is displayed css */

.view {
	display: flex;
	flex-direction: column;
	flex: 100%;
	justify-content: space-around;
	margin-top: 10px;
	border: 1px solid #999;
	border-radius: 5px;
	row-gap: 2em;
}

.view .flex-box {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;
}

.view .box {
	display: flex;
	flex-direction: column;
	padding: 20px;
	align-items: center;
}

.view p:nth-of-type(1) {
	font-size: 20px;
	text-align: left;
	margin: 5px;
}

.view ul {
	display: flex;
	justify-content: left;
	text-align: center;
	list-style-type: none;
	flex-wrap: wrap;
}

.view ul li {
	border: 1px solid #999;
	margin: 5px;
	padding: 10px;
	border-radius: 5px;
}

.view xio-button {
	border: 4px solid #999;
}

.view .box p:nth-of-type(2), xio-id {
	font-size: 30px;
}

}

`
