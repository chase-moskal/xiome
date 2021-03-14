
export interface PrivilegeChecker<xPrivileges extends {[key: string]: string}> {
	hasPrivilege(key: keyof xPrivileges): boolean
	requirePrivilege(key: keyof xPrivileges): void
}
