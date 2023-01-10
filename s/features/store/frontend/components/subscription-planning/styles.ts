
import {css} from "@chasemoskal/magical"
export default css`

ul, ol {
	list-style: none;
}

.plandraft {
	> * {
		display: block;
		margin-top: 0.5em;
	}
}

[data-plan] {
	border: 1px solid;
	padding: 1em;
	margin-top: 1em;

	.editplan {
		margin-bottom: 1em;
	}

	.plandetails {
		margin-bottom: 1em;
	}

	.planediting > * + * {
		display: block;
		margin-top: 0.5em;
	}

	details {
		border: 1px dashed;
		padding: 0.5em;
		margin-top: 0.5em;
	}
	
	summary {
		font-size: 1.2em;
	}
	
	.tiersheading {
		margin-top: 1em;
	}
	
	.addtier {
		margin-top: 1em;
	}
	
	.tierdraft > * {
		display: block;
		margin-top: 0.5em;
	}
}

[data-tier] {
	border: 1px solid;
	padding: 1em;
	margin-top: 1em;

	.tierdetails {
		margin: 1em 0;
	}

	.tierediting > * {
		display: block;
		margin-top: 0.5em;
	}
}

[data-field="label"], .label {
	font-weight: bold;
}

`
