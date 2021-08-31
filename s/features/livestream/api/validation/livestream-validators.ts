
import {maxLength, minLength, one, schema, string, url} from "../../../../toolbox/darkvalley.js"

export const validateShowLabel = one<string>(
	string(),
	minLength(1),
	maxLength(64),
)

export const validateVimeoId = one<string>(
	string(),
	minLength(1),
	maxLength(64),
)

export const validateVimeoUrl = one<string>(
	string(),
	maxLength(2048),
	url(),
	value => {
		const url = new URL(value)
		return url.origin.toLowerCase() === "https://vimeo.com"
			? []
			: ["invalid vimeo url (wrong origin)"]
	},
)

const isUrl = (value: string) => url()(value).length === 0

export const validateVimeoField = one<string>(
	string(),
	minLength(1),
	maxLength(2048),
	value => isUrl(value)
		? validateVimeoId(value)
		: validateVimeoUrl(value),
)

export const validateShowInput = schema({
	label: validateShowLabel,
	vimeoId: validateVimeoId,
})
