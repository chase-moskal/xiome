
import {isNode as stockIsNode} from "../../../../toolbox/is-node.js"

export async function digestPassword({isNode = stockIsNode, ...options}: {
			salt: string
			password: string
			isNode?: boolean
		}): Promise<string> {
	return stockIsNode
		? await digestPasswordNode(options)
		: await digestPasswordBrowser(options)
}

export async function digestPasswordNode({salt, password}: {
			salt: string
			password: string
		}): Promise<string> {
	const crypto = import("crypto")
	throw new Error("TODO implement")
}

export async function digestPasswordBrowser({salt, password}: {
			salt: string
			password: string
		}): Promise<string> {
	throw new Error("TODO implement")
}
