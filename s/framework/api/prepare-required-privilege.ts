
import {objectMap} from "../../toolbox/object-map.js"
import {AnonAuth} from "../../features/auth/types/auth-metas.js"
import {PrivilegeChecker} from "../../features/auth/aspects/permissions/types/privilege-checker.js"

export function prepareRequiredPrivilege<
		xPrivileges extends {[key: string]: string}
	>() {

	return function requiredPrivilege<xMethods extends {[key: string]: (...args: any[]) => Promise<any>}>(
			checker: PrivilegeChecker<xPrivileges>,
			key: keyof xPrivileges,
			methods: xMethods
		) {

		return <xMethods>objectMap(methods, method =>
			async(...args: any[]) => {
				checker.requirePrivilege(<any>key)
				return method(...args)
			}
		)
	}
}
