
export function originsMinusHome(home: string, origins: string[]) {
	return origins
		.filter(o => o.toLowerCase() !== new URL(home.toLowerCase()).origin)
		.map(o => o.toLowerCase())
}
