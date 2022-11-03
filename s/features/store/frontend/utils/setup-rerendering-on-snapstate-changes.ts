
import {Snapstate} from "@chasemoskal/snapstate"
import {Use} from "../../../../toolbox/magical-component.js"

export function setupRerenderingOnSnapstateChanges(use: Use<any>, snap: Snapstate<any>) {
	use.setup(
		() => snap.subscribe(
			() => use.element.requestUpdate()
		)
	)
}
