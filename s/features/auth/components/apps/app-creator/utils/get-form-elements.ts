
import {XioTextInput} from "../../../../../xio-components/inputs/xio-text-input.js"

export function getFormElements(root: ShadowRoot | HTMLElement) {
	const select = <X extends HTMLElement>(name: string) =>
		root.querySelector<X>(`.app-creator .app-${name}`)
	return {
		appHome: select<XioTextInput>("home"),
		appLabel: select<XioTextInput>("label"),
		appOrigins: select<XioTextInput<string[]>>("origins"),
	}
}
