
import {XioAvatarSimpleSpec} from "../types/xio-avatar-types.js"

export function randomXioAvatarSimpleSpec(): XioAvatarSimpleSpec {
	return {
		type: "simple",
		value: Math.random(),
	}
}
