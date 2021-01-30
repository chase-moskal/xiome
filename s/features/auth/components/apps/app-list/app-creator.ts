
import {AppDraft} from "../../../../../types.js"
import {html} from "../../../../../framework/component.js"
import {debounce2} from "../../../../../toolbox/debounce2.js"
import {validateAppDraft} from "../../../topics/apps/validate-app-draft.js"
import {XioTextInput} from "../../../../xio-components/inputs/xio-text-input.js"

export function makeAppCreator({shadowRoot, requestUpdate, createApp}: {
		shadowRoot: ShadowRoot
		requestUpdate: () => void
		createApp: (appDraft: AppDraft) => Promise<void>
	}) {

	let problems = []
	let appDraft: AppDraft

	function getFormElements() {
		const select = <X extends HTMLElement>(name: string) =>
			shadowRoot.querySelector<X>(`.app-creator .app-${name}`)
		return {
			appHome: select<XioTextInput>("home"),
			appLabel: select<XioTextInput>("label"),
			appOrigins: select<HTMLTextAreaElement>("origins"),
		}
	}

	function clearForm() {
		const {appHome, appLabel, appOrigins} = getFormElements()
		appHome.text = ""
		appLabel.text = ""
		appOrigins.value = ""
		requestUpdate()
	}

	function readForm() {
		const {appHome, appLabel, appOrigins} = getFormElements()
		appDraft = {
			home: appHome.text,
			label: appLabel.text,
			origins: (appOrigins.value ?? "")
				.split("\n")
				.map(line => line.trim()),
		}
		problems = validateAppDraft(appDraft)
		if (problems.length) appDraft = undefined
		console.log({problems, appDraft})
		requestUpdate()
	}

	const readFormDebounced = debounce2(500, readForm)

	const handleFormChange = () => {
		problems = []
		appDraft = undefined
		readFormDebounced()
	}

	async function handleCreateClick() {
		clearForm()
		await createApp(appDraft)
	}

	function render() {
		return html`
			<div class=app-creator>
				<xio-text-input
					class=app-label
					placeholder="app label"
					@textchange=${handleFormChange}

				></xio-text-input>
				<xio-text-input
					class=app-home
					placeholder="app home"
					@textchange=${handleFormChange}
				></xio-text-input>
				<textarea
					class=app-origins
					placeholder="app origins"
					@keyup=${handleFormChange}
					@change=${handleFormChange}
				></textarea>
				<br/>
				<button
					?disabled=${!appDraft || problems.length > 0}
					@click=${handleCreateClick}>
						create app
				</button>
			</div>
		`
	}

	return {render}
}
