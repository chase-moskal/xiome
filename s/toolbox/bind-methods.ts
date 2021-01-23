
export function bindMethods<T extends { [key: string]: any} >(obj: T) {
	for (const key in obj)
		if (typeof obj[key] === "function")
			obj[key] = obj[key].bind(obj)
}
