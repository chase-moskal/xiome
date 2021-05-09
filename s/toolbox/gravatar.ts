
import {MD5} from "crypto-es/lib/md5.js"
 //               ^^
 // Could not find a declaration file for module

export function gravatar(email: string) {
	return `https://www.gravatar.com/avatar/${MD5(email)}?s=240`
}
