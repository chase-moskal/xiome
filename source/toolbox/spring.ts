
/**
 * seeded pseudo random number generator
 * - adapted from: https://github.com/bryc/code/blob/master/jshash/PRNGs.md
 */
export function mulberry(seed: number) {
	return function random() {
		seed |= 0
		seed = seed + 0x6D2B79F5 | 0
		let x = Math.imul(seed ^ seed >>> 15, 1 | seed)
		x = x + Math.imul(x ^ x >>> 7, 61 | x) ^ x
		return ((x ^ x >>> 14) >>> 0) / 4294967296
	}
}

/**
 * seeded pseudo random number generator
 * - adapted from: https://github.com/bryc/code/blob/master/jshash/PRNGs.md
 */
export function splitmix(seed: number) {
	return function random() {
		seed |= 0
		seed = seed + 0x9e3779b9 | 0
		let t = seed ^ seed >>> 15
		t = Math.imul(t, 0x85ebca6b)
		t = t ^ t >>> 13
		t = Math.imul(t, 0xc2b2ae35)
		return ((t = t ^ t >>> 16) >>> 0) / 4294967296
	}
}
