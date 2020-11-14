
// node

export const digestIterations = 100000
export const digestByteLength = 32
export const digestAlgorithm = "sha512"

// web-crypto

const {freeze} = Object

export const pbkdf2Algorithm = freeze({
	name: "PBKDF2",
	iterations: digestIterations,
	hash: freeze({name: "SHA-512"}),
})

export const digestBitLength = digestByteLength * 8
