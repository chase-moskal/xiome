
import * as renraku from "renraku"

import {Permit} from "../types/permit.js"
import {PrivilegeChecker} from "../types/privilege-checker.js"

export function makePrivilegeChecker<xPrivileges extends {[key: string]: string}>(
		permit: Permit,
		privileges: xPrivileges,
	): PrivilegeChecker<xPrivileges> {

	function hasPrivilege(key: keyof xPrivileges) {
		return permit.privileges.includes(privileges[key])
	}

	function requirePrivilege(key: keyof xPrivileges) {
		if (!hasPrivilege(key))
			throw new renraku.ApiError(403, `forbidden; privilege required "${key}"`)
	}

	function requireNotHavePrivilege(key: keyof xPrivileges) {
		if (hasPrivilege(key))
			throw new renraku.ApiError(403, `forbidden: must not have privilege "${key}"`)
	}

	return {
		hasPrivilege,
		requirePrivilege,
		requireNotHavePrivilege,
	}
}
