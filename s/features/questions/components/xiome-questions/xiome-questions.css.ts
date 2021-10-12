
import postCss from "./parts/post/post.css.js"
import {css} from "../../../../framework/component.js"
export default css`

/* * {
	outline: 1px solid #f002;
} */

:host {
	display: block;
	max-width: 42em;
	--like-color: var(--xiome-questions-like-color, cyan);
	--report-color: var(--xiome-questions-report-color, #f90);
}

.questions-moderation-panel {
	padding: 1em;
	border: 1px dotted;
	margin-bottom: 1em;
}

.questions-moderation-panel .purge-button {
	--xio-button-hover-color: red;
}

slot[name="empty"] {
	display: block;
	margin-top: 1em;
}

[part="questions-list"] {
	list-style: none;

}

[part="questions-list"] > li {
	margin-top: 2em;
}

${postCss}

[part="answers-list"] {
	list-style: none;
	margin-left: 3.4em;
	margin-right: 1em;
	margin-bottom: 1em;
}

[part="answers-list"] > li {
	
	margin-top: 1em;
}

@media (max-width: 420px) {
	[part="answers-list"] {
		margin-left: 1em;
		margin-right: 0;
	}
	[part="answers-list"] > li {
		border-left: 1px solid;
	}
}

/*
** question editor
*/

.editor .intro {
	margin-bottom: 1em;
}

.editor .intro .heading {
	font-size: 2em;
}

.editor .buttonbar {
	text-align: right;
	padding: 0.5em;
}

.question-editor {
	padding-bottom: 2em;
	margin-bottom: 2em;
	border-bottom: 1px dashed;
}

/*
** answer editor
*/

.answer-editor {
	border: 1px dashed;
	margin-left: 5em;
	margin-top: 1em;
}

.answer-editor .intro {
	padding: 1em;
}

`
