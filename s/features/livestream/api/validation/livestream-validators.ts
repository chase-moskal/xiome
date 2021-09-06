
import {maxLength, minLength, validator, regex, schema, string, url} from "../../../../toolbox/darkvalley.js"

export const validateShowLabel = validator<string>(
	string(),
	minLength(1),
	maxLength(64),
)

export const validateVimeoId = validator<string>(
	string(),
	minLength(1),
	maxLength(64),
	regex(/^\d+$/, "invalid vimeo id"),
)

export const validateVimeoUrl = validator<string>(
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

export const isUrl = (value: string) => url()(value).length === 0

export const validateVimeoField = validator<string>(
	string(),
	maxLength(2048),
	value => value === ""
		? []
		: isUrl(value)
			? validateVimeoUrl(value)
			: validateVimeoId(value),
)

export const validateShowInput = schema({
	label: validateShowLabel,
	vimeoId: (value: string) => value === ""
		? []
		: validateVimeoId(value),
})
