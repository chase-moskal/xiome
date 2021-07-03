
// import {MD5} from "crypto-es/lib/md5.js"
//  //               ^^
//  // Could not find a declaration file for module

// export function gravatar({email, ...options}: {
// 		email: string
// 		size?: number
// 		default?:
// 			| "404"
// 			| "mp"
// 			| "identicon"
// 			| "monsterid"
// 			| "wavatar"
// 			| "retro"
// 			| "robohash"
// 			| "blank"
// 			| string
// 	}) {

// 	const query = makeQueryString({
// 		d: options.default,
// 		s: options.size
// 			? options.size.toString()
// 			: undefined,
// 	})

// 	return `https://www.gravatar.com/avatar/${MD5(email)}${query}`
// }

// function makeQueryString(params: {[key: string]: string | undefined}) {
// 	const entries = Object.entries(params)
// 	return entries.length
// 		? "?" + entries
// 			.map(([key, value]) => `${key}=${value}`)
// 			.join("&")
// 		: ""
// }
