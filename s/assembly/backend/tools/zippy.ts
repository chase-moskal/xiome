
import {Await} from "../../../types/await.js"

export type ZipSpec = [string[], any][]

function isPlainObject(x: any) {
	return (
		typeof x === "object"
		&& x !== null
		&& !Array.isArray(x)
		&& !(x instanceof Promise)
	)
}

function unzipRecursive(object: {}, path: string[] = []) {
	let spec: ZipSpec = []

	for (const [key, value] of Object.entries(object)) {
		if (isPlainObject(value))
			spec = [
				...spec,
				...unzipRecursive(value, [...path, key])
			]
		else
			spec.push([[...path, key], value])
	}

	return spec
}

export function unzip(object: {}): ZipSpec {
	return unzipRecursive(object)
}

export async function waitSpec(spec: ZipSpec): Promise<ZipSpec> {
	const paths: string[][] = []
	const awaitables: any[] = []
	for (const [path, value] of spec) {
		paths.push(path)
		awaitables.push(value)
	}
	const values = await Promise.all(awaitables)
	return paths.map((path, index) => [path, values[index]])
}

export function applyProperty(object: {}, path: string[], value: any) {
	let level: any = object
	for (let i = 0; i < path.length; i++) {
		const final = i === (path.length - 1)
		const key = path[i]
		const existing = level[key]
		if (final)
			level[key] = value
		else {
			const existingIsObject = isPlainObject(existing)
			if (existingIsObject)
				level = existing
			else {
				const next = {}
				level[key] = next
				level = next
			}
		}
	}
}

export function zip<X extends {}>(spec: ZipSpec) {
	const result = {}

	for (const [path, value] of spec)
		applyProperty(result, path, value)

	return <X>result
}

export type PromiseStructure = {
	[key: string]: PromiseStructure | Promise<any> | any
}

export type WaitForProperties<X extends PromiseStructure> = {
	[P in keyof X]:
		X[P] extends PromiseLike<any>
			? Await<X[P]>
			: X[P] extends PromiseStructure
				? WaitForProperties<X[P]>
				: never
}

export async function waitForProperties<X extends PromiseStructure>(
		input: X
	): Promise<WaitForProperties<X>> {
	const specWithPromises = unzip(input)
	const specWithValues = await waitSpec(specWithPromises)
	return zip(specWithValues)
}
