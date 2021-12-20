
import {objectMap} from "../../toolbox/object-map.js"
import {AnonAuth} from "../../features/auth/types/auth-metas.js"

export function prepareRequiredPrivilege<
		xAuth extends AnonAuth,
		xPrivileges extends {[key: string]: string}
	>() {

	return function requiredPrivilege<xMethods extends {[key: string]: (...args: any[]) => Promise<any>}>(
			key: keyof xPrivileges,
			methods: xMethods
		) {

		return <xMethods>objectMap(methods, method =>
			async(auth: xAuth, ...args: any[]) => {
				auth.checker.requirePrivilege(<any>key)
				return method(auth, ...args)
			}
		)
	}
}
