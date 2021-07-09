
export type RoleRow = {
	id_role: string
	label: string

	// hardcoded roles cannot be deleted
	hard: boolean

	// public roles are visible to anybody
	public: boolean

	// assignable roles can be freely assigned/revoked by admins
	assignable: boolean
}
