
export function deepClone<T extends {}>(obj: T): T {
	return JSON.parse(JSON.stringify(obj))
}

const isSet = (a: any) => (a !== null && a !== undefined)

export function deepEqual<T extends {}>(a: T, b: T): boolean {
	if (!isSet(a) || !isSet(b)) return a === b

	for (const [key, aValue] of Object.entries(a)) {
		if (!b.hasOwnProperty(key)) return false
		const bValue = b[key]
		switch (typeof aValue) {
			case "object":
				if (!deepEqual(aValue, bValue))
					return false
				break
			case "function":
				if (!isSet(bValue) || aValue.toString() !== bValue.toString())
					return false
				break
			default:
				if (aValue !== bValue)
					return false
		}
	}

	for (const [key] of Object.entries(a))
		if (!b.hasOwnProperty(key))
			return false

	for (const [key] of Object.entries(b))
		if (!a.hasOwnProperty(key))
			return false

	return true
}
