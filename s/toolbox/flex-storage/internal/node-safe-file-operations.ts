
import {promises as fsp} from "fs"

export function nodeSafeFileOperations(path: string) {
	let operationChain: Promise<Map<string, any>> = Promise.resolve(undefined)

	async function load(): Promise<Map<string, any>> {
		try {
			return new Map<string, any>(JSON.parse(await fsp.readFile(path, "utf8")))
		}
		catch (error) {
			return new Map<string, any>()
		}
	}

	async function save(map: Map<string, any>) {
		const text = JSON.stringify(map.entries())
		await fsp.writeFile(path, text, "utf8")
	}

	return async function operation(
			action: (map: Map<string, any>) => Promise<undefined | Map<string, any>>
				= async() => undefined
		) {
		operationChain = operationChain.then(async() => {
			const map = await load()
			const changes = await action(map)
			if (changes) await save(map)
			return map
		})
		return operationChain
	}
}
