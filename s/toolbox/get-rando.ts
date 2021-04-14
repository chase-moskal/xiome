
import {Await} from "../types/await.js"
import {isNode as stockIsNode} from "./is-node.js"
import {identifierFromBinary} from "./identifiers.js"

export type Rando = Await<ReturnType<typeof getRando>>

export async function getRando({isNode = stockIsNode}: {isNode?: boolean} = {}) {

	const randomBuffer: (bytes: number) => ArrayBuffer = isNode
		? await (async() => {
			const crypto = await import("crypto")
			return (bytes: number) => crypto.randomBytes(bytes).buffer
		})()
		: (bytes: number) => crypto.getRandomValues(new Uint8Array(bytes)).buffer

	const compare: (a: string, b: string) => boolean = isNode
		? await (async() => {
			const crypto = await import("crypto")
			return (a: string, b: string) => crypto.timingSafeEqual(
				Buffer.from(a, "utf8"),
				Buffer.from(b, "utf8"),
			)
		})()
		: (a, b) => {
			console.warn("insecure compare")
			return a === b
		}

	function random(): number {
		const buffer = randomBuffer(8)
		const ints = new Int8Array(buffer)
		ints[7] = 63
		ints[6] |= 0xf0
		const view = new DataView(buffer)
		return view.getFloat64(0, true) - 1
	}

	function randomId() {
		const buffer = randomBuffer(32)
		return identifierFromBinary(buffer)
	}
	
	function randomSample<T>(palette: T[]): T {
		return palette[Math.floor(random() * palette.length)]
	}
	
	function randomSequence(length: number, palette: string[]): string {
		const results: string[] = []
		while (results.length < length) {
			const sample = randomSample(palette)
			results.push(sample)
		}
		return results.join("")
	}

	return {
		random,
		compare,
		randomId,
		randomBuffer,
		randomSample,
		randomSequence,
	}
}
