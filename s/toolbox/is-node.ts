
export const isNode = (typeof process !== "undefined")
	&& (process?.release?.name === "node")
