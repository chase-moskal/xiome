
import {css} from "../../../../framework/component.js"
export default css`

:host {
	display: block;
	width: 24em;
	max-width: 100%;
	border: 1px solid;
	border-radius: 5px;
	--xiome-video-hosting-warning-color: red;
}

.dacastbox {
	padding: 1em;
}

xio-text-input::part(problems) {
	width: 100%;
}

.buttonbar {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
}

.buttonbar > * {
	margin: 0.4em 0.2em;
}

.failed {
	color: var(--xiome-video-hosting-warning-color);
	display: flex;
	padding: 0.5em 0;
}

.linked {
	display: flex;
}

.helpbox ul {
	padding-left: 1.5em;
}

.timeInfo{
	display: inline-flex;
	align-items: center;
	padding: 0.5em 0;
}


.unlinkBtn{
	display: flex;
	justify-content: flex-end;
}

svg.feather.feather-clock{
	width: 6em;
	height: 3em;
}
`
