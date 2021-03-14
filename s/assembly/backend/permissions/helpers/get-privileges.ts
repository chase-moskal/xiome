
export function getPrivileges<
				xPrivilegeGroup extends {[key: string]: string},
				xLabels extends keyof xPrivilegeGroup,
			>(
				group: xPrivilegeGroup,
				...labels: xLabels[]
			): {
				[P in xLabels]: xPrivilegeGroup[P]
			} {

	return <any>Object.fromEntries(
		labels.map(label => [<string>label, group[label]])
	)
}
