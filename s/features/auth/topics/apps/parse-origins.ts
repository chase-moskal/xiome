
export const parseOrigins = (text: string) =>
	text
		.split("\n")
		.map(line => line.trim())
		.filter(line => line.length > 0)
