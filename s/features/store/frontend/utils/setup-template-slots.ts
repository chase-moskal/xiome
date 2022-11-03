
import {Use} from "../../../../toolbox/magical-component.js"
import {TemplateSlots} from "../../../../toolbox/template-slots.js"

export function engageTemplateSlotting(use: Use<any>) {

	const [slots] = use.state(() =>
		new TemplateSlots(
			use.element,
			() => use.element.requestUpdate(),
		)
	)

	return slots
}
