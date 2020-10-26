
export const nap = (milliseconds: number) =>
	new Promise(resolve => setTimeout(resolve, milliseconds))
