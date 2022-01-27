
import {isNode as stockIsNode} from "dbmage"

import {digestPasswordNode} from "./environments/digest-password-node.js"
import {digestPasswordBrowser} from "./environments/digest-password-browser.js"

export async function digestPassword({isNode = stockIsNode, ...options}: {
			salt: string
			password: string
			isNode?: boolean
		}): Promise<string> {

	return stockIsNode
		? await digestPasswordNode(options)
		: await digestPasswordBrowser(options)
}
