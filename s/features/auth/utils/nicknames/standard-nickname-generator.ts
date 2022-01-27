
import {Rando} from "dbmage"
import {standardDictionary} from "./standard-dictionary.js"
import {makeNicknameGenerator} from "./make-nickname-generator.js"

export function standardNicknameGenerator({rando}: {rando: Rando}) {
	return makeNicknameGenerator({
		rando,
		delimiter: " ",
		dictionary: standardDictionary,
		nicknameStructure: [["adjectives", "colors"], ["animals"]],
	})
}
