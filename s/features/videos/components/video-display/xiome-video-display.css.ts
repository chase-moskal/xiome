
import {css} from "../../../../framework/component.js"
export default css`

:host {
	display: block;
	--xiome-video-display-select-background: inherit;
}

.controls-title,
.view,
.create-view {
	max-width: 42rem;
}

[part="iframe"] {
	width: 100%;
	height: 100%;
	border: none;
}

.mock-embed img {
	width: 100%;
}

.open {
	transform: rotate(180deg);
}

xio-button {
	--xio-button-border: none;
	--xio-button-padding: var(--xio-button-padding, 0.5em 0.5em);
	--xio-button-disabled-border-style: var(--xio-button--disabled-border-style, solid);
}

.xio-box {text-align: right}

select {
	background-color: var(--xiome-video-display-select-background);
	color: currentColor;
}

select option {
	background-color: #333;
	padding: 15px;
}

.controls-title {
	display: flex;
	border: 1px solid currentColor;
	padding: 0.5em;
	justify-content: space-between;
	margin-top: 0.5em;
}
.controls-title div {
	display: flex;
	flex-direction: column;
}

.controls-title span:nth-of-type(2) {
	font-size: 0.8em;
	font-weight: normal;
}
.create-button {
	margin: 0.5em;
}
.create-button:not([disabled]) {
	border: 1px solid currentColor;
	margin: 0.5em;
}

.create-view {
	display: flex;
	flex-direction: column;
	gap: 1em;
	border-right: 1px solid currentColor;
	border-left: 1px solid currentColor;
	border-bottom: 1px solid currentColor;
	margin-bottom: 0.5em;
}

.create-view .view-box {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	column-gap: 2em;
}
.create-view h4 {
	padding: 1em;
}

.create-content, .create-privileges {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-content: center;
}

.create-privileges {
	visibility: hidden;
}

.create-privileges[data-visible] {
	visibility: visible;
}

.create-content select {
	display: flex;
	justify-self: center;
	align-self: center;
	padding: 1em;
	font-size: 1em;
}

.create-content, .create-privileges {
	margin-bottom: 1em;
}

.create-privileges option {
	display: flex;
	justify-self: center;
	align-self: center;
	font-size: 1em;
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
	border-bottom: 1px solid currentColor;
	border-right: 1px solid currentColor;
	border-left: 1px solid currentColor;
}

.view-box {
	align-items: flex-start;
}

.view .view-box {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;
}

.view .box {
	display: flex;
	flex-direction: column;
	padding: 1em;
	align-items: center;
}

.view h4:nth-of-type(1) {
	text-align: left;
	margin: 0.5em;
}

.view ul {
	display: flex;
	justify-content: left;
	text-align: center;
	list-style-type: none;
	flex-wrap: wrap;
	margin-bottom: 1em;
}

.view ul li {
	border: 1px solid currentColor;
	margin: 5px;
	padding: 0.5em;
	border-radius: 5px;
}

.view xio-button {
	border: 1px solid currentColor;
	margin: 0.5em;
}

.view .box p:nth-of-type(2), xio-id {
	font-size: 2em;
}

.box xio-id {
	font-size: 16px;
}

`
