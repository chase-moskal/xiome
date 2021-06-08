
export type XioAvatarType = "simple" | "image"

export interface XioAvatarBlankSpec {
	type: "blank"
}

export interface XioAvatarSimpleSpec {
	type: "simple"
	value: number
}

export interface XioAvatarImageSpec {
	type: "image"
	link: string
}

export type XioAvatarSpec =
	| XioAvatarBlankSpec
	| XioAvatarSimpleSpec
	| XioAvatarImageSpec
