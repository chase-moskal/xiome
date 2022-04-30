
import {wireAuthServices} from "../../features/auth/services/wire-auth-services.js"

export function assembleServices() {
	return {
		...wireAuthServices(),
	}
}
