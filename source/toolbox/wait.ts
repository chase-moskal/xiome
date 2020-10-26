
export const wait = (milliseconds: number = 1000) =>
	new Promise(resolve => setTimeout(resolve, milliseconds))
