
import {AppDraft} from "../../../../../types.js"
import {html, maybe} from "../../../../../framework/component.js"
import {debounce2} from "../../../../../toolbox/debounce2.js"
import {validateAppDraft} from "../../../topics/apps/validate-app-draft.js"
import {appDraftValidators} from "../../../topics/apps/app-draft-validators.js"
import {XioTextInput} from "../../../../xio-components/inputs/xio-text-input.js"
import { TextInputParser } from "../../../../xio-components/inputs/types/text-input-parser.js"

export function makeAppCreator({shadowRoot, requestUpdate, createApp}: {
		shadowRoot: ShadowRoot
		requestUpdate: () => void
		createApp: (appDraft: AppDraft) => Promise<void>
	}) {

	let problems = []
	let appDraft: AppDraft
	let formDisabled = false

	function getFormElements() {
		const select = <X extends HTMLElement>(name: string) =>
			shadowRoot.querySelector<X>(`.app-creator .app-${name}`)
		return {
			appHome: select<XioTextInput>("home"),
			appLabel: select<XioTextInput>("label"),
			appOrigins: select<XioTextInput<string[]>>("origins"),
		}
	}

	function clearForm() {
		const {appHome, appLabel, appOrigins} = getFormElements()
		appHome.setText("")
		appLabel.setText("")
		appOrigins.setText("")
		requestUpdate()
	}

	function readForm() {
		const {appHome, appLabel, appOrigins} = getFormElements()
		appDraft = {
			home: appHome.value,
			label: appLabel.value,
			origins: appOrigins.value,
		}
		problems = validateAppDraft(appDraft)
		if (problems.length) appDraft = undefined
		requestUpdate()
	}

	const readFormDebounced = debounce2(500, readForm)

	const handleFormChange = () => {
		problems = []
		appDraft = undefined
		readFormDebounced()
	}

	async function handleCreateClick() {
		readForm()
		formDisabled = true
		const draft: AppDraft = {...appDraft}
		requestUpdate()
		try {
			await createApp(draft)
			clearForm()
		}
		finally {
			formDisabled = false
			requestUpdate()
		}
	}

	const parseOrigins: TextInputParser<string[]> = text =>
		text
			.split("\n")
			.map(line => line.trim())
			.filter(line => line.length > 0)

	function render() {
		return html`
			<div class=app-creator>

				<xio-text-input
					class=app-label
					placeholder="app label"
					?disabled=${formDisabled}
					.validator=${appDraftValidators.label}
					@valuechange=${handleFormChange}
				></xio-text-input>

				<xio-text-input
					class=app-home
					placeholder="app home"
					?disabled=${formDisabled}
					.validator=${appDraftValidators.home}
					@valuechange=${handleFormChange}
				></xio-text-input>

				<xio-text-input
					textarea
					class=app-origins
					placeholder="app origins"
					?disabled=${formDisabled}
					.parser=${parseOrigins}
					.validator=${appDraftValidators.origins}
					@valuechange=${handleFormChange}
				></xio-text-input>

				<br/>
				<button
					?disabled=${formDisabled || !appDraft || problems.length > 0}
					@click=${handleCreateClick}>
						create app
				</button>
			</div>
		`
	}

	return {render}
}
