
import {wireAuthModels} from "../../features/auth/models/wire-auth-models.js"

export function assembleModels({remote}: {remote: any}) {
	return {
		...wireAuthModels({remote}),
	}
}
