
export interface EditWidget {
	roleChanges: {
		[roleId: string]: undefined | "assign" | "revoke"
	}
	assignRole(roleId: string): void
	revokeRole(roleId: string): void
	save(): Promise<void>
}
