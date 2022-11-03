
import {AccessPayload} from "../../../auth/types/auth-tokens.js"

export interface TestSession {
	access?: AccessPayload
	privileges: string[]
}

export function makeTestSession() {
	return {
		access: undefined,
		privileges: [],
	}
}
