
function cap(x: number, min: number, max: number) {
	return x < min
		? min
		: x > max
			? max
			: x
}

function hsl(xHue: number, xSaturation: number, xLightness: number) {
	const hue = xHue % 360
	const saturation = cap(xSaturation, 0, 100)
	const lightness = cap(xLightness, 0, 100)
	return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

export function getNiceColors(value: number) {
	const base = Math.ceil(value * 360)
	const split_a = (base - 30) % 360
	const split_b = (base + 30) % 360
	return {
		color1: hsl(base, 100, 90),
		color2: hsl(split_a, 50, 60),
		color3: hsl(split_b, 50, 40),
	}
}
