
import {Dictionary} from "./types/dictionary.js"
import {Rando} from "dbmage"
import {NicknameStructure} from "./types/nickname-structure.js"

export function makeNicknameGenerator({
		rando,
		delimiter,
		dictionary,
		nicknameStructure,
	}: {
		rando: Rando
		delimiter: string
		dictionary: Dictionary
		nicknameStructure: NicknameStructure
	}) {

	const nicknameData = nicknameStructure.map(
		dictionarySet => dictionarySet.reduce(
			(previous, wordGroupName) => [
				...previous,
				...dictionary[wordGroupName],
			],
			<string[]>[]
		)
	)

	return () => nicknameData
		.map(names => rando.randomSample(names))
		.join(delimiter)
}
