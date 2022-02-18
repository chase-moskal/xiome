
import {css} from "../../../../framework/component.js"
export default css`

:host {
	display: block;
	--_select-bg: var(--xiome-video-display-select-background, #222);
	--xiome-video-display-selected-option-color: cyan;
}

.controls-title,
.view,
.viewcreator {
	max-width: 42rem;
}

[part="iframe"] {
	width: 100%;
	border: none;
}

.mock-embed img {
	width: 100%;
}

.buttonbar {
	text-align: right;
}

.controls-title,
.viewcreator,
.view {
	border: 1px solid;
	border-radius: 0.2em;
}

.controls-title {
	padding: 0.1em 0.5em;
}
.controls-title[data-open] {
	border-bottom-left-radius: 0;
	border-bottom-right-radius: 0;
}
.view, .viewcreator {
	border-top: 0;
	border-top-left-radius: 0;
	border-top-right-radius: 0;
}

.controls-title {
	display: flex;
	align-items: center;
}
.controls-title div span {
	display: block;
}
.controls-title span:nth-of-type(2) {
	opacity: 0.8;
	font-size: 0.8em;
	font-weight: normal;
	padding-left: 0.2em;
}

.togglebutton {
	--xio-button-border: 0;
	margin-left: auto;
	transition: transform 300ms ease;
	transform: rotate(0deg);
}
[data-open] .togglebutton {
	transform: rotate(180deg);
}

.view, .viewcreator {
	display: flex;
	flex-direction: column;
	gap: 0.2em;
	padding: 0.5em;
}

.viewcreator .selectionarea {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	width: 100%;
	gap: 0.5em;
	margin: 0.5em 0;
}

.viewcreator .selectionarea > * {
	flex: 1 1 auto;
}

select {
	color: inherit;
	background: transparent;
	border: 1px solid;
	width: 100%;
}

select[multiple] {
	min-height: 10em;
}

select option {
	padding: 0.1em 0.2em;
	color: inherit;
	background: var(--_select-bg);
}

.create-privileges {
	visibility: hidden;
}

.create-privileges[data-visible] {
	visibility: visible;
}

.create-privileges option[selected] {
	color: var(--xiome-video-display-selected-option-color);
}

::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-thumb { background: currentColor; }

::scrollbar { width: 8px; }
::scrollbar-thumb { background: currentColor; }

/* When video is displayed css */

.view-details {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;
	gap: 0.8em;
	margin: 0.5em 0;
}

.view-details > * {
	text-align: center;
}

.view ul {
	display: flex;
	justify-content: left;
	text-align: center;
	list-style-type: none;
	flex-wrap: wrap;
}

.view ul li {
	border: 1px solid;
	margin: 0.2em;
	padding: 0.1em 0.4em;
	border-radius: 1em;
}

`
