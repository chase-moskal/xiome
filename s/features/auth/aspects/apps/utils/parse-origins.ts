
export const parseOrigins = (text: string) =>
	text
		.split("\n")
		.map(line => line.trim().toLowerCase())
		.filter(line => line.length > 0)
