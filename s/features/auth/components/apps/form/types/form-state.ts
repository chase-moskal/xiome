
export interface FormState<xDraft> {
	draft: xDraft
	problems: string[]
	formDisabled: boolean
	readonly valid: boolean
}
