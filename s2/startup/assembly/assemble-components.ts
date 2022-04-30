
import {wireAuthComponents} from "../../features/auth/components/wire-auth-components.js"

export function assembleComponents({models}: {models: any}) {
	return {
		...wireAuthComponents(models),
	}
}
