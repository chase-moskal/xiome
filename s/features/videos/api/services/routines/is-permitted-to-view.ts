
export function isPermittedToView({
		viewPrivileges, userPrivileges
	}: {
		viewPrivileges: string[]
		userPrivileges: string[]
	}) {

	for (const requiredPrivilege of viewPrivileges) {

		const userHasPrivilege = userPrivileges
			.find(p => p === requiredPrivilege)

		if (userHasPrivilege)
			return true
	}

	return false
}
