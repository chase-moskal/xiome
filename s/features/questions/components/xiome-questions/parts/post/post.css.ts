
import {css} from "../../../../../../framework/component.js"
import votingUnitCss from "./voting-unit/voting-unit.css.js"
export default css`

${votingUnitCss}

.post {
	display: grid;
	grid-template-rows: auto;
	grid-template-columns: auto 1fr auto;
	grid-template-areas:
		".... tophat    ...."
		"bar1 bubble    bar2"
		".... buttonbar ....";
}

a {
	opacity: 0.5;
	color: inherit;
	text-decoration: none;
}

a:hover, a:focus {
	opacity: 0.8;
	text-decoration: underline;
}

/*
** normal questions
*/

.post .tophat { grid-area: tophat }
.post .bar1 { grid-area: bar1 }
.post .bar2 { grid-area: bar2 }
.post .bubble { grid-area: bubble }
.post .buttonbar { grid-area: buttonbar }

.post .bar {
	padding: 0.5em;
	padding-top: 0.2em;
	display: flex;
	flex-direction: column;
}

.post .bar > * + * {
	margin-top: 0.1em;
}

.post .bar.bar2 {
	padding-top: 0;
}

.post .metabar {
	font-size: 0.7em;
	padding: 0 1.5em;
	opacity: 0.6;
}

.post .tophat xio-profile-card {
	width: 100%;
}

.post .bubble {
	flex: 1 1 auto;
	/* padding-left: 1em; */
}

.post .bubble xio-text-input {
	--xio-text-input-border-radius: 0 1em 1em 1em;
	--xio-text-input-pad: 0.5em;
}

.post .bubble .textbox p {
	border-radius: 0 1em 1em 1em;
	border: 1px solid;
	padding: 0.5em;
	min-height: 4em;
}

.post [part="bubble"] {
	white-space: pre-wrap;
}

/*
** question editor
*/

.intro {
	margin-bottom: 1em;
}

.intro .heading {
	font-size: 2em;
}

.post.editor .buttonbar {
	text-align: right;
	padding: 0.5em;
}

.post.editor {
	padding-bottom: 2em;
	margin-bottom: 2em;
	border-bottom: 1px dashed;
}

`
