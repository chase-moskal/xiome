
export function makeLoginLink({home, loginToken}: {
		home: string
		loginToken: string
	}) {
	const url = new URL(home)
	url.hash = `#login=${loginToken}`
	return url
}
