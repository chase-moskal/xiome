
export function makeLoginLink({home, loginToken}: {
		home: string
		loginToken: string
	}) {
	return `${home}?login=${loginToken}`
}
