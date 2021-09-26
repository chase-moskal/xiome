
import * as Dacast from "../../types/dacast-types.js"

function randomHex() {
	const lingo = "0123456789abcdef"
	const result: string[] = []
	for (let i = 0; i < 8; i++) {
		result.push(
			lingo[Math.floor(Math.random() * lingo.length)]
		)
	}
	return result.join("")
}

export function fakeDacastContent(type: string): Dacast.Content {
	return {
		title: `${type} title ${randomHex()}`,
		online: true,
		id: randomHex(),
		thumbnail: "thumb.jpg",
		creation_date: "1999-12-25",
		start_date: "1999-12-31",
		end_date: "2000-01-01",
	}
}
